using Minio;
using Minio.DataModel.Args;

namespace TranscodingService.Services
{
    public class MinIOService
    {
        private readonly IMinioClient minioClient;
        private readonly IWebHostEnvironment webHostEnvironment;

        public MinIOService(IMinioClient minioClient, IWebHostEnvironment webHostEnvironment)
        {
            this.minioClient = minioClient;
            this.webHostEnvironment = webHostEnvironment;
        }

        // Tải video từ MinIO về local
        public async Task<string> DownloadVideo(string userId, string videoId, string fileName, string bucketName)
        {
            string localFolder = Path.Combine(webHostEnvironment.WebRootPath, userId, videoId);
            if(!Directory.Exists(localFolder))
            {
                Directory.CreateDirectory(localFolder);
            }
            string localPath = Path.Combine(localFolder, fileName);
            var args = new GetObjectArgs()
                .WithBucket(bucketName) // tên bucket
                .WithObject($"{userId}/{videoId}/{fileName}") // tên file trên MinIO
                .WithFile(localPath); // đường dẫn lưu file

            await minioClient.GetObjectAsync(args);
            return localPath;
        }

        // Upload cả thư mục chứa HLS chunks lên MinIO
        public async Task UploadDirectory(string localDirPath, string bucketName, string userName, string videoId)
        {
            var allFiles = Directory.GetFiles(localDirPath, "*", SearchOption.AllDirectories);
            var filesWithoutMp4 = allFiles.Where(file => !file.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase)).ToArray();

            foreach (string filePath in filesWithoutMp4)
            {
                var args = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject($"{userName}/{videoId}/{Path.GetFileName(filePath)}") // tên file sau khi up lên
                    .WithFileName(filePath) // đường dẫn file cục bộ trên máy để upload lên
                    .WithContentType(GetMimeType(filePath)); // định nghĩa loại file upload

                await minioClient.PutObjectAsync(args);
            }
        }

        private string GetMimeType(string filePath)
        {
            return Path.GetExtension(filePath) switch
            {
                ".m3u8" => "application/x-mpegURL",
                ".ts" => "video/MP2T",
                ".mp4" => "video/mp4",
                _ => "application/octet-stream"
            };
        }
    }
}
