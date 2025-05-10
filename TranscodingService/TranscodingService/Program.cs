using Microsoft.AspNetCore.Server.Kestrel.Core;
using Minio;
using TranscodingService.Clients;
using TranscodingService.Services;
using TranscodingService.Services.Kafka;
using TranscodingService.Services.KafkaBackgroundServices;
using Videometadata;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();

#region minio

builder.Services.AddSingleton<InternalMinIOService>();
builder.Services.AddSingleton<ExternalMinIOService>();

#endregion

#region services

builder.Services.AddSingleton<VideoMetadataClientService>();

#endregion

#region grpc

builder.Services.AddGrpcClient<VideoMetadataGRPC.VideoMetadataGRPCClient>(options =>
{
    options.Address = new Uri(builder.Configuration["MetadataService:Url"]!);
});

builder.Services.AddSingleton<VideoProcessor>();

#endregion

#region kafka

builder.Services.AddSingleton<KafkaProducerService>();
builder.Services.AddHostedService<KafkaConsumerBackgroundService>();

#endregion

builder.Services.AddHostedService<KafkaConsumerBackgroundService>();

var app = builder.Build();

app.UseStaticFiles();

// Configure the HTTP request pipeline.
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
