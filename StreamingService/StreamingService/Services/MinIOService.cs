using Minio;
using Minio.DataModel.Args;

namespace StreamingService.Services
{
    public class MinIOService
    {
        private readonly IMinioClient minioClient;

        public MinIOService(IMinioClient minioClient)
        {
            this.minioClient = minioClient;
        }

        public async Task<string> GetManifestContent(string bucketName, string objectName)
        {
            // Kiểm tra object tồn tại
            var statArgs = new StatObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName);
            await minioClient.StatObjectAsync(statArgs);

            // Lấy manifest content
            var memoryStream = new MemoryStream();
            var getArgs = new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream));

            await minioClient.GetObjectAsync(getArgs);

            memoryStream.Position = 0;
            var content = await new StreamReader(memoryStream).ReadToEndAsync();

            return content;
        }

        public async Task<byte[]> GetFileBytes(string bucketName, string objectName)
        {
            // Kiểm tra object tồn tại
            var statArgs = new StatObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName);
            await minioClient.StatObjectAsync(statArgs);

            // Lấy manifest content
            var memoryStream = new MemoryStream();
            var getArgs = new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream));
            await minioClient.GetObjectAsync(getArgs);
            memoryStream.Position = 0;

            return memoryStream.ToArray();
        }
    }
}
