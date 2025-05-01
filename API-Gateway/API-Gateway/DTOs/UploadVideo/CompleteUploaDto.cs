namespace API_Gateway.DTOs.UploadVideo
{
    public class CompleteUploaDto
    {
        public string VideoId { get; set; } = string.Empty;
        public List<string> ChunkChecksums { get; set; } = [];
    }
}
