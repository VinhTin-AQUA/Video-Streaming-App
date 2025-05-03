using API_Gateway.DTOs.VideStreaming;
using Grpc.Net.Client;
using StreamingService;

namespace API_Gateway.Clients
{
    public class VideoStreamingClient
    {
        private readonly VideoStreaming.VideoStreamingClient client;
        private readonly IConfiguration configuration;

        public VideoStreamingClient(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var videoStreamingServiceUrl = configuration["StreamingService:Url"];
            var channel = GrpcChannel.ForAddress(videoStreamingServiceUrl!);
            client = new VideoStreaming.VideoStreamingClient(channel);
        }

        public async Task<DashManifestContentDto> GetDashManifest(string userid, string videoId, string fileName)
        {
            GetDashManifestRequest request = new()
            {
                UserId = userid,
                VideoId = videoId,
                FileName = fileName
            };

            GetDashManifestResponse response = await client.GetDashManifestAsync(request);

            return new()
            {
                Content = response.Content,
                ContentType = response.ContentType
            };
        }

        public async Task<DashChunksDto> GetDashChunks(string userId, string videoId, string fileName)
        {
            GetDashChunksRequest request = new()
            {
                UserId = userId,
                VideoId = videoId,
                FileName = fileName
            };

            GetDashChunksResponse response = await client.GetDashChunksAsync(request);

            return new()
            {
                Bytes = response.Bytes.ToByteArray(),
                ContentType = response.ContentType
            };
        }
    }
}
