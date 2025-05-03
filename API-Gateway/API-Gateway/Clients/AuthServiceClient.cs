using API_Gateway.Common.Response;
using API_Gateway.DTOs.Auth;
using Auth;
using Grpc.Net.Client;

namespace API_Gateway.Clients
{
    public class AuthServiceClient
    {
        private readonly AuthGRPC.AuthGRPCClient client;
        private readonly IConfiguration configuration;

        public AuthServiceClient(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var authServiceUrl = configuration["AuthService:Url"];
            var channel = GrpcChannel.ForAddress(authServiceUrl!);
            client = new AuthGRPC.AuthGRPCClient(channel);
        }

        public async Task<ApiResponse<object>> Register(RegisterDto model)
        {
            RegisterRequest request = new()
            {
                Email = model.Email,
                Password = model.Password,
                FullName = model.FullName,
            };

            RegisterResponse response = await client.RegisterAsync(request);
            return new()
            {
                Data = null,
                Message = response.Message
            };
        }

        public async Task<ApiResponse<object>> Login(LoginDto model)
        {
            LoginRequest request = new()
            {
                Email = model.Email,
                Password = model.Password,
            };

            LoginResponse response = await client.LoginAsync(request);
            return new()
            {
                Data = new 
                { 
                    Jwt = response.Jwt,
                },
                Message = response.Message
            };
        }
    }
}
