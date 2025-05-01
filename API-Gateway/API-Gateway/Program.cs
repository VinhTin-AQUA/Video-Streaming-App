using API_Gateway.Clients;
using API_Gateway.Middleware;
using Auth;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using StreamingService;
using VideoUploadService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure HTTP/2 for gRPC
//builder.Services.Configure<KestrelServerOptions>(options =>
//{
//    options.ConfigureEndpointDefaults(lo => lo.Protocols = HttpProtocols.Http1AndHttp2);
//});

#region Configure gRPC channel

builder.Services.AddGrpcClient<VideoStreaming.VideoStreamingClient>(options =>
{
    options.Address = new Uri(builder.Configuration["StreamingService:Url"]!);
});

builder.Services.AddGrpcClient<AuthGRPC.AuthGRPCClient>(options =>
{
    options.Address = new Uri(builder.Configuration["AuthService:Url"]!);
});

builder.Services.AddGrpcClient<VideoUploadGrpc.VideoUploadGrpcClient>(options =>
{
    options.Address = new Uri(builder.Configuration["VideoUploadService:Url"]!);
});

builder.Services.AddSingleton<VideoStreamingClient>();
builder.Services.AddSingleton<AuthServiceClient>();
builder.Services.AddSingleton<UploadServiceClient>();

#endregion

// enable cors
builder.Services.AddCors(c =>
{
    c.AddPolicy("AllowOrigin", option => option.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors(option => option.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.UseMiddleware<GrpcExceptionMiddleware>();

app.Run();
