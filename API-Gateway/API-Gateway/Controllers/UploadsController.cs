using API_Gateway.Clients;
using API_Gateway.DTOs.UploadVideo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Gateway.Controllers
{
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
            var response = await uploadServiceClient.InitUploadVideo(model);
            return Ok(response);
        }

        [HttpPost("complete-upload")]
        public async Task<IActionResult> CompleteUpload(CompleteUploaDto model)
        {
            var response = await uploadServiceClient.CompleteUpload(model);
            return Ok(response);
        }
    }
}
