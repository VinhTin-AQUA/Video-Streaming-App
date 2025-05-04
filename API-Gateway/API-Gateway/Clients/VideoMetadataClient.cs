using API_Gateway.DTOs.VideoMetata;
using Grpc.Net.Client;
using Videometadata;

namespace API_Gateway.Clients
{
    public class VideoMetadataClient
    {
        private readonly VideoMetadataGRPC.VideoMetadataGRPCClient client;
        private readonly IConfiguration configuration;

        public VideoMetadataClient(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var videoMetadataServiceUrl = configuration["VideoMetadataService:Url"];
            var channel = GrpcChannel.ForAddress(videoMetadataServiceUrl!);
            client = new VideoMetadataGRPC.VideoMetadataGRPCClient(channel);
        }

        public async Task<List<VideoMetadatDto>> GetAllVideoMetaData()
        {
            GetAllVideoMetadataResponse response = await client.GetAllVideoMetadataAsync(new Empty());
            var list = response.VideoMetadatas.Select(v =>
            {
                return new VideoMetadatDto
                {
                    Description = v.Description,
                    Duration = v.Duration,
                    FormatName = v.FormatName,
                    Id = v.Id,
                    IsPublic = v.IsPublic,
                    Size = v.Size,
                    Status = v.Status,
                    ThumbnailUrl = v.ThumbnailUrl,
                    Title = v.Title,
                    UserId = v.UserId,
                };
            }).ToList();
            return list;
        }


        public async Task<List<VideoMetadatDto>> GetVideoMetadatasOfUser(string userId)
        {
            GetVideoMetadatasOfUserRequest request = new()
            {
                UserId = userId
            };
            GetVideoMetadatasOfUserResponse response = await client.GetVideoMetadatasOfUserAsync(request);
            var list = response.VideoMetadatas.Select(v =>
            {
                return new VideoMetadatDto
                {
                    Description = v.Description,
                    Duration = v.Duration,
                    FormatName = v.FormatName,
                    Id = v.Id,
                    IsPublic = v.IsPublic,
                    Size = v.Size,
                    Status = v.Status,
                    ThumbnailUrl = v.ThumbnailUrl,
                    Title = v.Title,
                    UserId = v.UserId,
                };
            }).ToList();
            return list;
        }
    }
}
