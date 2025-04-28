using Grpc.Core;
using Minio.Exceptions;
using StreamingService.Contants;

namespace StreamingService.Services
{
    public class VideoStreamingService : VideoStreaming.VideoStreamingBase
    {
        private readonly MinIOService minIOService;

        public VideoStreamingService(MinIOService minIOService)
        {
            this.minIOService = minIOService;
        }

        public override async Task<GetDashManifestResponse> GetDashManifest(GetDashManifestRequest request, ServerCallContext context)
        {
            try
            {
                var objectName = $"{request.VideoId}/{request.FileName}";
                string manifestContent = await minIOService.GetManifestContent(MinIOContants.RAW_VIDEOS_BUCKET_NAME, objectName);

                return new GetDashManifestResponse
                {
                    Content = manifestContent,
                    ContentType = "application/dash+xml"
                };
            }
            catch (MinioException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<GetDashChunksResponse> GetDashChunks(GetDashChunksRequest request, ServerCallContext context)
        {
            try
            {
                var objectName = $"{request.VideoId}/{request.FileName}";
                byte[] bytes = await minIOService.GetFileBytes(MinIOContants.RAW_VIDEOS_BUCKET_NAME, objectName);

                return new GetDashChunksResponse
                {
                    Bytes = Google.Protobuf.ByteString.CopyFrom(bytes),
                    ContentType = "application/dash+xml"
                };
            }
            catch (MinioException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        private string GetMimeType()
        {
            var extension = Path.GetExtension("fileName").ToLowerInvariant();
            var mimeType = extension switch
            {
                ".mpd" => "application/dash+xml",
                ".m4s" => "video/iso.segment",
                ".mp4" => "video/mp4",
                _ => "application/octet-stream",
            };


            return mimeType;
        }
    }
}
