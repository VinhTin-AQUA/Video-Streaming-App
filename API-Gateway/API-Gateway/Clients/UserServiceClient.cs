using API_Gateway.DTOs.User;
using Grpc.Net.Client;
using User;
using Videometadata;

namespace API_Gateway.Clients
{
    public class UserServiceClient
    {
        private readonly UserGRPC.UserGRPCClient client;
        private readonly IConfiguration configuration;

        public UserServiceClient(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var userServiceUrl = configuration["UserService:Url"];
            var channel = GrpcChannel.ForAddress(userServiceUrl!);
            client = new UserGRPC.UserGRPCClient(channel);
        }

        public async Task<UserDto> GetUserById(string userId)
        {
            GetUserByIdRequest request = new()
            {
                UserId = userId,
            };

            var response = await client.GetUserByIdAsync(request);
            return new()
            {
                AvatarUrl = response.AvatarUrl,
                Email = response.Email,
                FullName = response.FullName,
                Id = response.Id
            };
        }

        public async Task<UserDto> UpdateUser(UpdateUserProfileDto model)
        {
            UpdateUserRequest request = new()
            {
                Id = model.Id,
                FullName = model.FullName
            };

            var response = await client.UpdateUserAsync(request);
            return new()
            {
                AvatarUrl = response.AvatarUrl,
                FullName = response.FullName,
                Email = response.Email,
                Id = model.Id
            };
        }

        public async Task<InitUserAvatarUploadDto> InitUserAvatarUpload(string userId)
        {
            InitUserAvatarUploadRequest request = new()
            {
                UserId = userId,
            };

            var response = await client.InitUserAvatarUploadAsync(request);
            return new()
            {
                UserAvatarUploadUrl = response.UserAvatarUploadUrl,
            };
        }
    }
}
