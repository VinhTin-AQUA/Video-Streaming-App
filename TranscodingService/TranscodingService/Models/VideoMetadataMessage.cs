namespace TranscodingService.Models
{
    public class VideoMetadataMessage
    {
        public string VideoId { get; set; } = string.Empty;
        public List<string> Checksums { get; set; } = [];
        public string Title { get; set; } = string.Empty;
        public string UserId {  get; set; } = string.Empty;
    }
}
