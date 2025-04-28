using API_Gateway.Clients;
using API_Gateway.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace API_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthServiceClient authServiceClient;

        public AuthController(AuthServiceClient authServiceClient)
        {
            this.authServiceClient = authServiceClient;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> Signup(RegisterDto model)
        {
            var response = await authServiceClient.Register(model);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var response = await authServiceClient.Login(model);
            return Ok(response);
        }
    }
}
