using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using VideoUploadService.Clients;
using Videometadata;
using System.Text.Json;
using VideoUploadService.Contants;


namespace VideoUploadService.Services
{
    public class VideoService : VideoUploadGrpc.VideoUploadGrpcBase
    {
        private readonly MinioService minio;
        private readonly KafkaProducerService kafkaProducerService;
        private readonly VideoMetadataClient videoMetadataClient;

        public VideoService(MinioService minio,
            KafkaProducerService kafkaProducerService,
            VideoMetadataClient videoMetadataClient)
        {
            this.minio = minio;
            this.kafkaProducerService = kafkaProducerService;
            this.videoMetadataClient = videoMetadataClient;
        }

        public override async Task<InitUploadResponse> InitUpload(InitUploadRequest request, ServerCallContext context)
        {
            // 1. Tạo record trong Metadata Service qua gRPC
            var metadata = await videoMetadataClient.AddVideoMetadata(new AddVideoMetadataRequest
            {
                Title = Path.GetFileNameWithoutExtension(request.FileName),
                Desciption = request.Desciption,
                Duration = request.Duration,
                FormatName = request.FormatName,
                Size = request.Size,
                UserId = request.UserId,
            });

            // 2. Tạo pre-signed URLs cho từng chunk (ví dụ: 5MB/chunk)
            var chunkUrls = new List<string>();
            for (int i = 0; i < CalculateChunkCount(request.Size); i++)
            {
                string objectName = $"{metadata.UserId}/{metadata.Id}/chunk-{i}";
                chunkUrls.Add(await minio.GeneratePresignedUrl(objectName, MinIOContants.RAW_VIDEOS_BUCKET_NAME));
            }

            return new InitUploadResponse
            {
                VideoId = metadata.Id,
                ChunkUrls = { chunkUrls }
            };
        }

        public override async Task<CompleteUploadResponse> CompleteUpload(CompleteUploadRequest request, ServerCallContext context)
        {
            // Verify all chunks exist in MinIO
            bool allChunksUploaded = await minio.VerifyChunks(
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

            // Cập nhật Metadata
            var metadata = await videoMetadataClient.UpdateVideoMetadata(
               new UpdateVideoMetadataRequest
               {
                   Id = request.VideoId,
                   Status = "processing"
               }
            );

            // hợp nhất các chunks thành file gốc
            await minio.ComebineChunks(request.UserId, request.VideoId, MinIOContants.RAW_VIDEOS_BUCKET_NAME, metadata.Title);

            // Publish to Kafka để xử lý encoding
            var message = new
            {
                VideoId = request.VideoId,
                Checksums = request.ChunkChecksums,
                Title = metadata.Title,
                UserId = request.UserId,
            };
            await kafkaProducerService.SendMessageAsync(KafakaContants.VIDEO_ENCODING_TASKS_TOPIC, message);

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
