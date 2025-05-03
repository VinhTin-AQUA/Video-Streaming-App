using API_Gateway.Clients;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoStreamingsController : ControllerBase
    {
        private readonly VideoStreamingClient videoStreamingClient;

        public VideoStreamingsController(VideoStreamingClient videoStreamingClient)
        {
            this.videoStreamingClient = videoStreamingClient;
        }

        [HttpGet("dash/{userId}/{videoId}/{fileName}")]
        public async Task<IActionResult> GetManifestContent(string userId, string videoId, string fileName)
        {
            // http://localhost:5246/api/videostreamings/dash/680e544cc25ced24733b73a8/processed/init-stream0.m4s
            if (fileName == "manifest.mpd")
            {
                var manifest = await videoStreamingClient.GetDashManifest(userId, videoId, fileName);
                return Content(manifest.Content, manifest.ContentType);
            }

            var chunks = await videoStreamingClient.GetDashChunks(userId, videoId, fileName);
            return File(chunks.Bytes, chunks.ContentType);
        }
    }
}
