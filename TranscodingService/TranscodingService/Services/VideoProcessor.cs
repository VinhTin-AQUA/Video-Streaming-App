using Grpc.Core;
using System.Diagnostics;
using TranscodingService.Clients;
using TranscodingService.Common.Contants;
using TranscodingService.Models;
using TranscodingService.Services.Kafka;

namespace TranscodingService.Services
{
    public class VideoProcessor
    {
        private readonly InternalMinIOService internalMinIOService;
        private readonly ExternalMinIOService externalMinIOService;
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly VideoMetadataClientService videoMetadataClientService;
        private readonly KafkaProducerService kafkaProducerService;

        public VideoProcessor(InternalMinIOService minIOService,
            ExternalMinIOService externalMinIOService,
            IWebHostEnvironment webHostEnvironment,
            VideoMetadataClientService videoUploadClientService,
            KafkaProducerService kafkaProducerService
            )
        {
            this.internalMinIOService = minIOService;
            this.externalMinIOService = externalMinIOService;
            this.webHostEnvironment = webHostEnvironment;
            this.videoMetadataClientService = videoUploadClientService;
            this.kafkaProducerService = kafkaProducerService;
        }

        public async Task ProcessVideoAsync(VideoMetadataMessage? videoMetadataMessage)
        {
            if (videoMetadataMessage == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Nhận không nhận được message hoặc message bị lỗi"));
            }

            #region create temp folder

            var inputPath = await internalMinIOService.DownloadVideo(videoMetadataMessage.UserId, 
                                                            videoMetadataMessage.VideoId, 
                                                            videoMetadataMessage.Title, 
                                                            MinIOContants.RAW_VIDEOS_BUCKET_NAME);
            var outputDir = $"{webHostEnvironment.WebRootPath}/{videoMetadataMessage.UserId}/{videoMetadataMessage.VideoId}/";
            Directory.CreateDirectory(outputDir);

            #endregion

            #region gen dash

            var outputPath = Path.Combine(outputDir, "manifest.mpd");
            var quotedOutputPath = $"\"{outputPath}\"";

            var convertDashprocess = new Process
            {
                StartInfo = {
                    FileName = "ffmpeg",
                    Arguments = $"-i \"{inputPath}\" " +  // Đặt ngoặc kép trực tiếp
                               "-c:v libx264 -c:a aac -f dash -seg_duration 5 " +
                               $"-init_seg_name \"init-stream$RepresentationID$.m4s\" " +
                               $"-media_seg_name \"chunk-stream$RepresentationID$-$Number%05d$.m4s\" " +
                               $"{quotedOutputPath}",
                     RedirectStandardError = true, // Bắt buộc phải đọc stderr
                    RedirectStandardOutput = true, // Nếu cần đọc stdout
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            convertDashprocess.Start();
            var convertDashStderrTask = convertDashprocess.StandardError.ReadToEndAsync();
            var convertDashStdoutTask = convertDashprocess.StandardOutput.ReadToEndAsync();

            await convertDashprocess.WaitForExitAsync();
            if (convertDashprocess.ExitCode != 0)
            {
                string errMessage = await convertDashprocess.StandardError.ReadToEndAsync();
                throw new RpcException(new Status(StatusCode.Internal, errMessage));
            }

            convertDashprocess.Refresh();
            convertDashprocess.CloseMainWindow();
            convertDashprocess.Dispose();

            #endregion

            #region gen thumbnail

            var thumbnailOutputPath = Path.Combine(outputDir, "thumbnail.jpg");
            var thumbnailQuotedOutputPath = $"\"{thumbnailOutputPath}\"";
            var genThumbnailProcess = new Process
            {
                StartInfo = {
                    FileName = "ffmpeg",
                    Arguments = $"-i \"{inputPath}\" " +
                                $"-ss 00:00:05 -vframes 1 " +  // Đặt ngoặc kép trực tiếp
                                $"{thumbnailQuotedOutputPath}",
                    RedirectStandardError = true, // Bắt buộc phải đọc stderr
                    RedirectStandardOutput = true, // Nếu cần đọc stdout
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            genThumbnailProcess.Start();
            var genThumbnailStderrTask = genThumbnailProcess.StandardError.ReadToEndAsync();
            var genThumbnailStdoutTask = genThumbnailProcess.StandardOutput.ReadToEndAsync();

            await genThumbnailProcess.WaitForExitAsync();
            if (genThumbnailProcess.ExitCode != 0)
            {
                string errMessage = await genThumbnailProcess.StandardError.ReadToEndAsync();
                throw new RpcException(new Status(StatusCode.Internal, errMessage));
            }

            genThumbnailProcess.Refresh();
            genThumbnailProcess.CloseMainWindow();
            genThumbnailProcess.Dispose();

            #endregion

            await internalMinIOService.UploadDirectory(outputDir, MinIOContants.RAW_VIDEOS_BUCKET_NAME, videoMetadataMessage.UserId, videoMetadataMessage.VideoId);
            await videoMetadataClientService.UpdateVideoMetadat(
                new Videometadata.UpdateVideoMetadataRequest
                {
                    Id = videoMetadataMessage.VideoId,
                    Status = "ready",
                    ThumbnailUrl = $"{videoMetadataMessage.UserId}/{videoMetadataMessage.VideoId}/thumbnail.jpg"
                }
            );

            var thumbnailPresignUrl = await externalMinIOService.GenGetPresignedUrl(MinIOContants.RAW_VIDEOS_BUCKET_NAME, $"{videoMetadataMessage.UserId}/{videoMetadataMessage.VideoId}/thumbnail.jpg");
            var videoUpdate = new
            {
                UserId = $"video_status_update_{videoMetadataMessage.UserId}",
                VideoId = videoMetadataMessage.VideoId,
                Status = "ready",
                ThumbnailUrl = thumbnailPresignUrl,
            };
            await kafkaProducerService.SendMessageAsync(KafkaContants.VIDEO_STATUS_UPDATED, videoUpdate);

            //if(Directory.Exists(Path.Combine(webHostEnvironment.WebRootPath, videoMetadataMessage.VideoId)))
            //{
            //    Directory.Delete(Path.Combine(webHostEnvironment.WebRootPath, videoMetadataMessage.VideoId), recursive: true);
            //}

            Console.WriteLine("Transcoding Successfully !!!");
        }
    }
}
