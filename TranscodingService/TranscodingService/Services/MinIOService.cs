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
        public async Task<string> DownloadVideo(string videoId, string fileName)
        {
            string localFolder = Path.Combine(webHostEnvironment.WebRootPath, videoId);
            if(!Directory.Exists(localFolder))
            {
                Directory.CreateDirectory(localFolder);
            }
            string localPath = Path.Combine(localFolder, fileName);
            var args = new GetObjectArgs()
                .WithBucket("raw-videos") // tên bucket
                .WithObject($"{videoId}/{fileName}") // tên file trên MinIO
                .WithFile(localPath); // đường dẫn lưu file

            await minioClient.GetObjectAsync(args);
            return localPath;
        }

        // Upload cả thư mục chứa HLS chunks lên MinIO
        public async Task UploadDirectory(string localDirPath, string bucketName, string videoId)
        {
            foreach (string filePath in Directory.GetFiles(localDirPath, "*", SearchOption.AllDirectories))
            {
                var args = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject($"{videoId}/{Path.GetFileName(filePath)}") // tên file sau khi up lên
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
