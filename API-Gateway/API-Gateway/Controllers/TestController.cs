using API_Gateway.Common.Contants;
using API_Gateway.DTOs.VideoMetata;
using API_Gateway.Services.Kafka;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API_Gateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly KafkaProducerService kafkaProducerService;

        public TestController(KafkaProducerService kafkaProducerService)
        {
            this.kafkaProducerService = kafkaProducerService;
        }

        [HttpGet("push-message")]
        public async Task<IActionResult> PushMessage()
        {
            var model = new UpdateVideoStatus()
            {
                UserId = $"video_status_update_6814c8337fa3a911fd0b46de",
                VideoId = "6815c5a7ed456e7cc891bb58",
                Status = "ready"
            };
            await kafkaProducerService.SendMessageAsync(KafkaContants.VIDEO_STATUS_UPDATED, model);
            return Ok(new { message = "success" });
        }
    }
}
