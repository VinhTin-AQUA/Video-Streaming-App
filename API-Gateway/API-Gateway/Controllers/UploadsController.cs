using API_Gateway.Clients;
using API_Gateway.DTOs.UploadVideo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_Gateway.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly UploadServiceClient uploadServiceClient;

        public UploadsController(UploadServiceClient uploadServiceClient)
        {
            this.uploadServiceClient = uploadServiceClient;
        }

        [HttpPost("init-upload")]
        public async Task<IActionResult> InitUpload(InitUploadVideoDto model)
        {
            if(string.IsNullOrEmpty(User.FindFirstValue("id")))
            {
                return Unauthorized(new { message = "Unauthorized" });
            }
            model.UserId = User.FindFirstValue("id")!;
            var response = await uploadServiceClient.InitUploadVideo(model);
            return Ok(response);
        }

        [HttpPost("complete-upload")]
        public async Task<IActionResult> CompleteUpload(CompleteUploaDto model)
        {
            if (string.IsNullOrEmpty(User.FindFirstValue("id")))
            {
                return Unauthorized(new { message = "Unauthorized" });
            }
            model.UserId = User.FindFirstValue("id")!;
            var response = await uploadServiceClient.CompleteUpload(model);
            return Ok(response);
        }
    }
}
