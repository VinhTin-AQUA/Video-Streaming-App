using Minio;
using Minio.DataModel.Args;

namespace VideoUploadService.Services
{
    public class ExternalMinIOService
    {
        private readonly IMinioClient minioClient;

        public ExternalMinIOService(IConfiguration configuration)
        {
            this.minioClient = new MinioClient()
                .WithEndpoint(configuration["Minio:ExternalEndpoint"])
                .WithCredentials(configuration["Minio:AccessKey"], configuration["Minio:SecretKey"])
                .Build();
        }

        public async Task<string> GenPutPresignedUrl(string bucketName, string objectName)
        {
            var args = new PresignedPutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(3600); // 1 hour expiry
            string signedUrl = await minioClient.PresignedPutObjectAsync(args);

            return signedUrl;
        }
    }
}
