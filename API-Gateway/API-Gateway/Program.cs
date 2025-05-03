using API_Gateway.Clients;
using API_Gateway.Middleware;
using Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.IdentityModel.Tokens;
using StreamingService;
using System.Text;
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

builder.Services.AddGrpcClient<VideoUploadGrpc.VideoUploadGrpcClient>(options =>
{
    options.Address = new Uri(builder.Configuration["VideoMetadataService:Url"]!);
});


builder.Services.AddSingleton<VideoStreamingClient>();
builder.Services.AddSingleton<AuthServiceClient>();
builder.Services.AddSingleton<UploadServiceClient>();
builder.Services.AddSingleton<VideoMetadataClient>();

#endregion

#region JWT

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = true;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        // validate the issuer (who ever is issuing the JWT)
        ValidateIssuer = true,
        ValidateIssuerSigningKey = true, // validate token based on the key we have provided in appsetting.json

        // don't validate audience (angular side)
        ValidateAudience = false,

        //ValidAudience = builder.Configuration.GetSection("JWT:ValidAudience").Value,
        // the issuer which in here is the api project url
        ValidIssuer = builder.Configuration.GetSection("JWT:Issuer").Value,

        // the issuer signin key based on JWT:Key
        IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT:Key").Value!))
    };
});


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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseMiddleware<GrpcExceptionMiddleware>();

app.Run();
