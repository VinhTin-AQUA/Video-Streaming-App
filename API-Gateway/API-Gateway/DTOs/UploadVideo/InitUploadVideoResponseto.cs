namespace API_Gateway.DTOs.UploadVideo
{
    public class InitUploadVideoResponseto
    {
        public string VideoId { get; set; } = string.Empty;
        public List<string> Urls { get; set; } = [];
    }
}
