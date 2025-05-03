using API_Gateway.Clients;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    }
}
