using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_Gateway.DTOs.VideoMetata
{
    public class VideoMetadatDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FormatName { get; set; } = string.Empty;
        public float Duration { get; set; }
        public long Size { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}
