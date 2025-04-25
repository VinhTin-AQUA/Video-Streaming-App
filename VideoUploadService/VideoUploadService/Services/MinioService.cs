using Minio.DataModel.Args;
using Minio;
using VideoUploadService.Contants;

namespace VideoUploadService.Services
{
    public class MinioService
    {
        private readonly IMinioClient minioClient;

        public MinioService(IMinioClient minioClient)
        {
            this.minioClient = minioClient;
        }


        public async Task Init()
        {
            bool found = await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(MinIOContants.RAW_VIDEOS_BUCKET_NAME));
            if (!found)
            {
                await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(MinIOContants.RAW_VIDEOS_BUCKET_NAME));
            }
        }

        public async Task<string> GeneratePresignedUrl(string objectName, string bucketName)
        {
            var args = new PresignedPutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(3600); // 1 hour expiry
            string signedUrl = await minioClient.PresignedPutObjectAsync(args);

            return signedUrl;
        }

        public async Task<bool> VerifyChunks(string uploadId, int expectedChunks, string bucketName)
        {
            var args = new ListObjectsArgs()
                .WithBucket(bucketName)
                .WithPrefix($"{uploadId}/chunk-");

            int actualChunks = 0;
            var observable = minioClient.ListObjectsEnumAsync(args);

            var cancellationToken = new CancellationTokenSource();
            try
            {
                await foreach (var item in observable.WithCancellation(cancellationToken.Token))
                {
                    actualChunks++;
                    if (actualChunks >= expectedChunks)
                    {
                        cancellationToken.Cancel(); // Dừng sớm nếu đủ chunks
                        break;
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Expected khi hủy sớm
            }

            return actualChunks == expectedChunks;
        }
    }
}
