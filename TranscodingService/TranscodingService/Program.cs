using Microsoft.AspNetCore.Server.Kestrel.Core;
using Minio;
using TranscodingService.BackgroundServices;
using TranscodingService.Clients;
using TranscodingService.Services;
using Videometadata;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddHostedService<KafkaConsumerBackgroundService>();
builder.Services.AddSingleton<IMinioClient>(sp =>
{
    var config = builder.Configuration.GetSection("Minio");
    var client = new MinioClient()
                .WithEndpoint(config["Endpoint"])
                .WithCredentials(config["AccessKey"], config["SecretKey"])
                .Build();

    return client;
});
builder.Services.AddSingleton<MinIOService>();

// Configure gRPC client
builder.Services.AddSingleton<VideoUploadClientService>();

// Configure gRPC channel
builder.Services.AddGrpcClient<VideoMetadataGRPC.VideoMetadataGRPCClient>(options =>
{
    options.Address = new Uri(builder.Configuration["MetadataService:Url"]!);
});

builder.Services.AddSingleton<VideoProcessor>();

var app = builder.Build();

app.UseStaticFiles();

// Configure the HTTP request pipeline.
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
