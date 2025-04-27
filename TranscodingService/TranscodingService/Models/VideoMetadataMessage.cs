namespace TranscodingService.Models
{
    public class VideoMetadataMessage
    {
        public string VideoId { get; set; } = string.Empty;
        public List<string> Checksums { get; set; } = [];
        public string FileName { get; set; } = string.Empty;
    }
}
