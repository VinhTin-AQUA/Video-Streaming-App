using Microsoft.AspNetCore.Server.Kestrel.Core;
using Minio;
using Videometadata;
using VideoUploadService.Clients;
using VideoUploadService.Interceptors;
using VideoUploadService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc(options =>
{
    options.Interceptors.Add<GrpcExceptionInterceptor>();
    options.EnableDetailedErrors = true;
});

builder.Services.AddSingleton<IMinioClient>(sp =>
{
    var config = builder.Configuration.GetSection("Minio");
    var client = new MinioClient()
                .WithEndpoint(config["Endpoint"])
                .WithCredentials(config["AccessKey"], config["SecretKey"])
                .Build();

    return client;
});

builder.Services.AddSingleton<MinioService>();
builder.Services.AddSingleton<VideoMetadataClient>();
builder.Services.AddSingleton<KafkaProducerService>();
//builder.Services.AddHostedService<KafkaConsumerBackgroundService>();



// Configure gRPC channel
builder.Services.AddGrpcClient<VideoMetadataGRPC.VideoMetadataGRPCClient>(options =>
{
    options.Address = new Uri(builder.Configuration["MetadataService:Url"]!);
});



var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<VideoService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

// Đảm bảo bucket tồn tại
using (var scope = app.Services.CreateScope())
{
    var minioService = scope.ServiceProvider.GetRequiredService<MinioService>();
    await minioService.Init();
}

app.Run();
