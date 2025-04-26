using Minio.DataModel.Args;
using Minio;
using VideoUploadService.Contants;
using Minio.DataModel;
using Grpc.Core;

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

        public async Task<bool> ComebineChunks(string uploadId, string bucketName, string finalObjectName)
        {
            // Kiểm tra bucket tồn tại
            bool found = await minioClient.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(bucketName)
            );

            if (!found)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Bucket {bucketName} không tồn tại"));
            }

            // Lấy danh sách các chunks
            var listArgs = new ListObjectsArgs()
                .WithBucket(bucketName)
                .WithPrefix($"{uploadId}/")
                .WithRecursive(true);

            var chunks = new List<Item>();
            var observable = minioClient.ListObjectsEnumAsync(listArgs);

            await foreach (var item in observable)
            {
                chunks.Add(item);
            }

            // Sắp xếp các chunks theo thứ tự
            chunks = chunks.OrderBy(c => c.Key).ToList();

            // Tạo một file tạm để hợp nhất
            var tempFile = Path.GetTempFileName();

            try
            {
                using (var tempStream = new FileStream(tempFile, FileMode.Create, FileAccess.Write))
                {
                    // Tải từng chunk và ghi vào file tạm
                    foreach (var chunk in chunks)
                    {
                        var getArgs = new GetObjectArgs()
                            .WithBucket(bucketName)
                            .WithObject(chunk.Key)
                            .WithCallbackStream(stream =>
                            {
                                stream.CopyTo(tempStream);
                            });

                        await minioClient.GetObjectAsync(getArgs);
                    }
                }

                // Tải file tạm lên MinIO như object cuối cùng
                using (var fileStream = new FileStream(tempFile, FileMode.Open, FileAccess.Read))
                {
                    var putArgs = new PutObjectArgs()
                        .WithBucket(bucketName)
                        .WithObject($"{uploadId}/{finalObjectName}")
                        .WithStreamData(fileStream)
                        .WithObjectSize(fileStream.Length)
                        .WithContentType("application/octet-stream");

                    await minioClient.PutObjectAsync(putArgs);
                }

                // Xóa các chunks sau khi hợp nhất thành công
                foreach (var chunk in chunks)
                {
                    var removeArgs = new RemoveObjectArgs()
                        .WithBucket(bucketName)
                        .WithObject(chunk.Key);

                    await minioClient.RemoveObjectAsync(removeArgs);
                }

            }
            catch (Exception ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            finally
            {
                // Xóa file tạm
                if (File.Exists(tempFile))
                {
                    File.Delete(tempFile);
                }
            }
            return true;
        }
    }
}
