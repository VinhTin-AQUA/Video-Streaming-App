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
                Title = Path.GetFileNameWithoutExtension(request.Filename),
                Artist = request.Artist,
                Filename = request.Filename,
                Desciption = request.Desciption,
                Duration = request.Duration,
                Formatname = request.FormatName,
                Size = request.Size,
            });

            // 2. Tạo pre-signed URLs cho từng chunk (ví dụ: 5MB/chunk)
            var chunkUrls = new List<string>();
            for (int i = 0; i < CalculateChunkCount(request.Size); i++)
            {
                string objectName = $"{metadata.Id}/chunk-{i}";
                chunkUrls.Add(await minio.GeneratePresignedUrl(objectName, MinIOContants.RAW_VIDEOS_BUCKET_NAME));
            }

            return new InitUploadResponse
            {
                UploadId = metadata.Id,
                ChunkUrls = { chunkUrls }
            };
        }

        public override async Task<CompleteUploadResponse> CompleteUpload(CompleteUploadRequest request, ServerCallContext context)
        {
            // Verify all chunks exist in MinIO
            bool allChunksUploaded = await minio.VerifyChunks(
                request.UploadId,
                request.ChunkChecksums.Count,
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
                   Id = request.UploadId,
                   Status = "processing"
               }
            );

            // hợp nhất các chunks thành file gốc
            await minio.ComebineChunks(request.UploadId, MinIOContants.RAW_VIDEOS_BUCKET_NAME, metadata.Filename);

            // Publish to Kafka để xử lý encoding
            var message = new
            {
                VideoId = request.UploadId,
                Checksums = request.ChunkChecksums
            };
            await kafkaProducerService.SendMessageAsync(KafakaContants.VIDEO_ENCODING_TASKS, message);

            return new CompleteUploadResponse
            {
                VideoId = request.UploadId,
                Status = "processing",
            };
        }

        private int CalculateChunkCount(long fileSize, int chunkSize = 5 * 1024 * 1024)
        {
            return (int)Math.Ceiling((double)fileSize / chunkSize);
        }
    }
}
