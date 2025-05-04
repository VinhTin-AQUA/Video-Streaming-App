using API_Gateway.Clients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoMetadatasController : ControllerBase
    {
        private readonly VideoMetadataClient videoMetadataClient;

        public VideoMetadatasController(VideoMetadataClient videoMetadataClient)
        {
            this.videoMetadataClient = videoMetadataClient;
        }

        [HttpGet("get-all-videometadatas")]
        public async Task<IActionResult> GetAllVideoMetadatas()
        {
            var r = await videoMetadataClient.GetAllVideoMetaData();
            return Ok(r);
        }


        [HttpGet("get-all-videometadatas-of-user")]
        [Authorize]
        public async Task<IActionResult> GetAllVideoMetadatasOfUser()
        {
            string? userId = User.FindFirstValue("id");
            if (userId == null)
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            var r = await videoMetadataClient.GetVideoMetadatasOfUser(userId);
            return Ok(r);
        }
    }
}
