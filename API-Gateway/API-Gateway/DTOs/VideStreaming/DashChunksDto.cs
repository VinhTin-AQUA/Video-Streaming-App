namespace API_Gateway.DTOs.VideStreaming
{
    public class DashChunksDto
    {
        public byte[] Bytes { get; set; } = [];
        public string ContentType { get; set; } = string.Empty;
    }
}
