using System;

namespace API_Gateway.DTOs.UploadVideo
{
    public class InitUploadVideoDto
    {
        public string Description { get; set; } = string.Empty;
        public float Duration { get; set; }
        public string Filename { get; set; } = string.Empty;
        public string FormatName { get; set; } = string.Empty;
        public long Size { get; set; }
        public string Title { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }
}
