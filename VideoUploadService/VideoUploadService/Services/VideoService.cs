using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using VideoUploadService.Clients;
using Videometadata;
using System.Text.Json;
using VideoUploadService.Common.Contants;
using VideoUploadService.Services.Kafka;


namespace VideoUploadService.Services
{
    public class VideoService : VideoUploadGrpc.VideoUploadGrpcBase
    {
        private readonly InternalMinioService internalMinio;
        private readonly ExternalMinIOService externalMinio;
        private readonly KafkaProducerService kafkaProducerService;
        private readonly VideoMetadataClient videoMetadataClient;

        public VideoService(InternalMinioService internalMinio,
            ExternalMinIOService externalMinio,
            KafkaProducerService kafkaProducerService,
            VideoMetadataClient videoMetadataClient)
        {
            this.internalMinio = internalMinio;
            this.externalMinio = externalMinio;
            this.kafkaProducerService = kafkaProducerService;
            this.videoMetadataClient = videoMetadataClient;
        }

        public override async Task<InitUploadResponse> InitUpload(InitUploadRequest request, ServerCallContext context)
        {
            // tạo record trong Metadata Service qua gRPC
            var metadata = await videoMetadataClient.AddVideoMetadata(new AddVideoMetadataRequest
            {
                Title = request.FileName,
                Description = request.Description,
                Duration = request.Duration,
                FormatName = request.FormatName,
                Size = request.Size,
                UserId = request.UserId,
            });

            // tạo pre-signed URLs cho từng chunk (5MB/chunk)
            var chunkUrls = new List<string>();
            for (int i = 0; i < CalculateChunkCount(request.Size); i++)
            {
                string objectName = $"{metadata.UserId}/{metadata.Id}/chunk-{i}";
                chunkUrls.Add(await externalMinio.GenPutPresignedUrl(MinIOContants.RAW_VIDEOS_BUCKET_NAME, objectName));
            }

            return new InitUploadResponse
            {
                VideoId = metadata.Id,
                ChunkUrls = { chunkUrls }
            };
        }

        public override async Task<CompleteUploadResponse> CompleteUpload(CompleteUploadRequest request, ServerCallContext context)
        {
            // verify chunks in MinIO
            bool allChunksUploaded = await internalMinio.VerifyChunks(
                request.UserId,
                request.VideoId,
                request.ChunkChecksums.Select(chunk => chunk).ToList(),
                MinIOContants.RAW_VIDEOS_BUCKET_NAME
            );

            if (!allChunksUploaded)
            {
                throw new RpcException(new Status(
                    StatusCode.FailedPrecondition,
                    "Missing chunks"
                ));
            }

            // cập nhật Metadata
            var metadata = await videoMetadataClient.UpdateVideoMetadata(
               new UpdateVideoMetadataRequest
               {
                   Id = request.VideoId,
                   Status = "processing"
               }
            );

            //var videoUpdate = new
            //{
            //    UserId = $"video_status_update_{request.UserId}",
            //    VideoId = request.VideoId,
            //    Status = "processing",
            //};
            //await kafkaProducerService.SendMessageAsync(KafkaContants.VIDEO_STATUS_UPDATED, videoUpdate);

            // hợp nhất các chunks thành file gốc
            await internalMinio.ComebineChunks(request.UserId, request.VideoId, MinIOContants.RAW_VIDEOS_BUCKET_NAME, metadata.Title);

            // Publish to Kafka để xử lý encoding
            var message = new
            {
                VideoId = request.VideoId,
                Checksums = request.ChunkChecksums,
                Title = metadata.Title,
                UserId = request.UserId,
            };
            await kafkaProducerService.SendMessageAsync(KafkaContants.VIDEO_ENCODING_TASKS_TOPIC, message);

            return new CompleteUploadResponse
            {
                VideoId = request.VideoId,
                Status = "processing",
            };
        }

        private int CalculateChunkCount(long fileSize, int chunkSize = 5 * 1024 * 1024)
        {
            return (int)Math.Ceiling((double)fileSize / chunkSize);
        }
    }
}
