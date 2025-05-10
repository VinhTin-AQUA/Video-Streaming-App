using Minio;
using Minio.DataModel.Args;

namespace TranscodingService.Services
{
    public class ExternalMinIOService
    {
        private readonly IMinioClient minioClient;
        private readonly IWebHostEnvironment webHostEnvironment;

        public ExternalMinIOService(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            this.minioClient = new MinioClient()
                .WithEndpoint(configuration["Minio:ExternalEndpoint"])
                .WithCredentials(configuration["Minio:AccessKey"], configuration["Minio:SecretKey"])
                .Build();
            this.webHostEnvironment = webHostEnvironment;
        }

        public async Task<string> GenGetPresignedUrl(string bucketName, string objectName)
        {
            var args = new PresignedGetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(3600); // 1 hour expiry
            string signedUrl = await minioClient.PresignedGetObjectAsync(args);
            return signedUrl;
        }
    }
}
