using Microsoft.AspNetCore.Server.Kestrel.Core;
using Minio;
using Videometadata;
using VideoUploadService.Clients;
using VideoUploadService.Common.Interceptors;
using VideoUploadService.Services;
using VideoUploadService.Services.Kafka;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddGrpc(options =>
{
    options.Interceptors.Add<GrpcExceptionInterceptor>();
    options.EnableDetailedErrors = true;
});

#region minio

builder.Services.AddSingleton<IMinioClient>(sp =>
{
    var config = builder.Configuration.GetSection("Minio");
    var client = new MinioClient()
                .WithEndpoint(config["Endpoint"])
                .WithCredentials(config["AccessKey"], config["SecretKey"])
                .Build();

    return client;
});

builder.Services.AddSingleton<InternalMinioService>();

#endregion

#region services

builder.Services.AddSingleton<VideoMetadataClient>();

#endregion

#region kafka

builder.Services.AddSingleton<KafkaProducerService>();
//builder.Services.AddHostedService<KafkaConsumerBackgroundService>();

#endregion

#region grpc

// Configure gRPC channel
builder.Services.AddGrpcClient<VideoMetadataGRPC.VideoMetadataGRPCClient>(options =>
{
    options.Address = new Uri(builder.Configuration["MetadataService:Url"]!);
});

#endregion 


var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<VideoService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
