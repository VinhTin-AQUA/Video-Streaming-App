using Auth;
using Grpc.Net.Client;
using VideoUploadService;

namespace API_Gateway.Clients
{
    public class UploadServiceClient
    {
        private readonly VideoUploadGrpc.VideoUploadGrpcClient client;
        private readonly IConfiguration configuration;

        public UploadServiceClient(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var productServiceUrl = configuration["VideoUploadService:Url"];
            var channel = GrpcChannel.ForAddress(productServiceUrl!);
            client = new VideoUploadGrpc.VideoUploadGrpcClient(channel);
        }
    }
}
