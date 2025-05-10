using Minio;

namespace API_Gateway.Services
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
    }
}
