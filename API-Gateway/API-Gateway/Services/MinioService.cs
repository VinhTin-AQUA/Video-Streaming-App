using API_Gateway.Common.Contants;
using Minio;
using Minio.DataModel.Args;

namespace API_Gateway.Services
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
            bool rawVideoFound = await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(MinIOContants.RAW_VIDEOS_BUCKET_NAME));
            if (!rawVideoFound)
            {
                await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(MinIOContants.RAW_VIDEOS_BUCKET_NAME));
            }

            bool assetsFound = await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(MinIOContants.ASSET_BUCKET_NAME));
            if (!assetsFound)
            {
                await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(MinIOContants.ASSET_BUCKET_NAME));
            }


            bool userAvatarFound = await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(MinIOContants.USER_AVATAR_BUCKET));
            if (!userAvatarFound)
            {
                await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(MinIOContants.USER_AVATAR_BUCKET));
            }
        }
    }
}
