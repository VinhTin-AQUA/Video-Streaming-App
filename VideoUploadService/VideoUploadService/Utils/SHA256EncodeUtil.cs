
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace VideoUploadService.Utils
{
    public static class SHA256EncodeUtil
    {
        public static string ComputeSha256HashByBytes(byte[] data)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(data);
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
            }
        }

        public static async Task<string> ComputeSha256HashByStream(Stream stream)
        {
            // Tạo MemoryStream để lưu dữ liệu từ stream gốc
            using (var memoryStream = new MemoryStream())
            {
                // Copy dữ liệu từ stream gốc vào memoryStream
                await stream.CopyToAsync(memoryStream);

                // Reset vị trí đọc về đầu stream
                memoryStream.Position = 0;

                // Tính toán SHA256 hash từ memoryStream
                using (SHA256 sha256 = SHA256.Create())
                {
                    byte[] hash = sha256.ComputeHash(memoryStream);
                    return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                }
            }
        }
    }
}
