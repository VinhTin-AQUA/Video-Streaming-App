using Grpc.Core;
using System.Diagnostics;
using TranscodingService.Clients;
using TranscodingService.Contants;
using TranscodingService.Models;

namespace TranscodingService.Services
{
    public class VideoProcessor
    {
        private readonly MinIOService minIOService;
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly VideoUploadClientService videoUploadClientService;

        public VideoProcessor(MinIOService minIOService,
            IWebHostEnvironment webHostEnvironment,
            VideoUploadClientService videoUploadClientService)
        {
            this.minIOService = minIOService;
            this.webHostEnvironment = webHostEnvironment;
            this.videoUploadClientService = videoUploadClientService;
        }

        public async Task ProcessVideoAsync(VideoMetadataMessage? videoMetadataMessage)
        {
            if (videoMetadataMessage == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Nhận không nhận được message hoặc message bị lỗi"));
            }

            // 1. Tải video từ MinIO
            var inputPath = await minIOService.DownloadVideo(videoMetadataMessage.VideoId, videoMetadataMessage.FileName);

            // 2. Chuyển đổi bằng FFmpeg
            var outputDir = $"{webHostEnvironment.WebRootPath}/{videoMetadataMessage.VideoId}/processed";
            Directory.CreateDirectory(outputDir);

            // Sửa lại cách đặt dấu ngoặc kép cho output path
            var outputPath = Path.Combine(outputDir, "master.mpd");
            var quotedOutputPath = $"\"{outputPath}\"";

            var process = new Process
            {
                StartInfo = {
                    FileName = "ffmpeg",
                    Arguments = $"-i \"{inputPath}\" " +  // Đặt ngoặc kép trực tiếp
                               "-c:v libx264 -c:a aac -f dash -seg_duration 15 -window_size 5 " +
                               "-extra_window_size 3 -min_seg_duration 15 " +
                               $"-init_seg_name \"processed/init-stream$RepresentationID$.m4s\" " +
                               $"-media_seg_name \"processed/chunk-stream$RepresentationID$-$Number%05d$.m4s\" " +
                               $"{quotedOutputPath}",
                     RedirectStandardError = true, // Bắt buộc phải đọc stderr
                    RedirectStandardOutput = true, // Nếu cần đọc stdout
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            // Bắt đầu process
            process.Start();

            // Đọc stderr và stdout để tránh deadlock
            var stderrTask = process.StandardError.ReadToEndAsync();
            var stdoutTask = process.StandardOutput.ReadToEndAsync();

            // Chờ process kết thúc
            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
            {
                string errMessage = await process.StandardError.ReadToEndAsync();
                throw new RpcException(new Status(StatusCode.Internal, errMessage));
            }

            // 3. Upload lên MinIO
            await minIOService.UploadDirectory(outputDir, MinIOContants.RAW_VIDEOS_BUCKET_NAME, videoMetadataMessage.VideoId);

            // 4. Cập nhật Metadata
            await videoUploadClientService.UpdateVideoMetadat(
                new Videometadata.UpdateVideoMetadataRequest
                {
                    Id = videoMetadataMessage.VideoId,
                    Status = "ready"
                }
            );

            Directory.Delete(videoMetadataMessage.VideoId, recursive: true);
        }
    }
}
