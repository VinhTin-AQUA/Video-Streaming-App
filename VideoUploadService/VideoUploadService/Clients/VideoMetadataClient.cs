using Grpc.Net.Client;
using Videometadata;

namespace VideoUploadService.Clients
{
    public class VideoMetadataClient
    {
        private readonly VideoMetadataGRPC.VideoMetadataGRPCClient _client;
        private readonly IConfiguration _configuration;

        public VideoMetadataClient(
            IConfiguration configuration)
        {
            _configuration = configuration;

            var productServiceUrl = _configuration["MetadataService:Url"];
            var channel = GrpcChannel.ForAddress(productServiceUrl!);
            _client = new VideoMetadataGRPC.VideoMetadataGRPCClient(channel);
        }

        public async Task<VideoMetadata> AddVideoMetadata(AddVideoMetadataRequest request)
        {
            VideoMetadata r = await _client.AddVideoMetadataAsync(request);
            return r;
        }


        public async Task<VideoMetadata> UpdateVideoMetadata(UpdateVideoMetadataRequest request)
        {
            VideoMetadata r = await _client.UpdateVideoMetadataAsync(request);
            return r;
        }
    }
}
