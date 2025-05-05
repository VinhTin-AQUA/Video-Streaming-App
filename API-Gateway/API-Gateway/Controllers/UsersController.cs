using API_Gateway.Clients;
using API_Gateway.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserServiceClient userServiceClient;

        public UsersController(UserServiceClient userServiceClient)
        {
            this.userServiceClient = userServiceClient;
        }

        [Authorize]
        [HttpGet("get-user-by-id")]
        public async Task<IActionResult> GetUserById()
        {
            string? userId = User.FindFirstValue("id");
            if (userId == null)
            {
                return Unauthorized(new { message = "" });
            }
            var r = await userServiceClient.GetUserById(userId);
            return Ok(r);
        }

        [Authorize]
        [HttpPut("update-user")]
        public async Task<IActionResult> UpdateUser(UpdateUserProfileDto model)
        {
            string? userId = User.FindFirstValue("id");
            if (userId == null)
            {
                return Unauthorized(new { message = "" });
            }
            model.Id = userId;
            var r = await userServiceClient.UpdateUser(model);
            return Ok(r);
        }

        [Authorize]
        [HttpGet("init-user-avatar-upload")]
        public async Task<IActionResult> InitUserAvatarUpload()
        {
            string? userId = User.FindFirstValue("id");
            if (userId == null)
            {
                return Unauthorized(new { message = "" });
            }
            var r = await userServiceClient.InitUserAvatarUpload(userId);
            return Ok(r);
        }
    }
}
