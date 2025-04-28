using Grpc.Net.Client;
using Videometadata;

namespace TranscodingService.Clients
{
    public class VideoMetadataClientService
    {
        private readonly VideoMetadataGRPC.VideoMetadataGRPCClient client;
        private readonly IConfiguration configuration;

        public VideoMetadataClientService(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var productServiceUrl = configuration["MetadataService:Url"];
            var channel = GrpcChannel.ForAddress(productServiceUrl!);
            client = new VideoMetadataGRPC.VideoMetadataGRPCClient(channel);
        }

        public async Task<VideoMetadata> UpdateVideoMetadat(UpdateVideoMetadataRequest request)
        {
            var response = await client.UpdateVideoMetadataAsync(request);
            return response;
        }
    }
}
