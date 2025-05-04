namespace API_Gateway.DTOs.VideoMetata
{
    public class UpdateVideoStatus
    {
        public string UserId { get; set; } = string.Empty;
        public string VideoId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ThumbnailUrl {  get; set; } = string.Empty;
    }
}
