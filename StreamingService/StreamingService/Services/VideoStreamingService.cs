using Grpc.Core;
using Minio.DataModel.Args;
using Minio.Exceptions;
using StreamingService;
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
                var objectName = $"{request.VideoId}/manifest.mpd";
                string manifestContent = await minIOService.GetManifestContent(MinIOContants.RAW_VIDEOS_BUCKET_NAME, objectName);

                return new GetDashManifestResponse
                {
                    ManifestContent = manifestContent,
                    ContentType = "application/dash+xml"
                };
            }
            catch (MinioException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }
    }
}
