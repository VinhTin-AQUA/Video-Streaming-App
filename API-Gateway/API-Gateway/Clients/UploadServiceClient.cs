﻿using API_Gateway.DTOs.UploadVideo;
using Auth;
using Grpc.Net.Client;
using VideoUploadService;

namespace API_Gateway.Clients
{
    public class UploadServiceClient
    {
        private readonly VideoUploadGrpc.VideoUploadGrpcClient client;
        private readonly IConfiguration configuration;

        public UploadServiceClient(
            IConfiguration configuration)
        {
            this.configuration = configuration;

            var videoUploadServiceUrl = configuration["VideoUploadService:Url"];
            var channel = GrpcChannel.ForAddress(videoUploadServiceUrl!);
            client = new VideoUploadGrpc.VideoUploadGrpcClient(channel);
        }

        public async Task<InitUploadVideoResponseto> InitUploadVideo(InitUploadVideoDto model)
        {
            InitUploadRequest request = new()
            {
                Description = model.Description,
                Duration = model.Duration,
                FileName = model.Filename,
                FormatName = model.FormatName,
                Size = model.Size,
                Title = model.Title,
                UserId = model.UserId,
            };

            InitUploadResponse response = await client.InitUploadAsync(request);
            return new InitUploadVideoResponseto()
            {
                Urls = response.ChunkUrls.Select(r => r).ToList(),
                VideoId = response.VideoId
            };
        }

        public async Task<CompleteUploadResponseDto> CompleteUpload(CompleteUploaDto model)
        {
            CompleteUploadRequest request = new()
            {
                VideoId = model.VideoId,
                UserId = model.UserId,
            };
            request.ChunkChecksums.Add(model.ChunkChecksums);

            CompleteUploadResponse response = await client.CompleteUploadAsync(request);

            return new()
            {
                VideoId = response.VideoId,
                Status = response.Status,
            };
        }
    }
}
