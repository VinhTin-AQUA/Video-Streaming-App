using API_Gateway.Common.Contants;
using API_Gateway.DTOs.VideoMetata;
using API_Gateway.Hubs;
using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace API_Gateway.Services.KafkaBackgroundServices
{
    public class VideoUpdateStatusBackgroundService : BackgroundService
    {
        private readonly ConsumerConfig config;
        private readonly IConfiguration configuration;
        private readonly IHubContext<UpdateVideoHup> videoHubContext;

        public VideoUpdateStatusBackgroundService(IConfiguration configuration, IHubContext<UpdateVideoHup> videoHubContext)
        {
            this.configuration = configuration;
            this.videoHubContext = videoHubContext;

            config = new()
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"],
                GroupId = configuration["Kafka:NotificationVideoStatusGroupId"],
                AutoOffsetReset = AutoOffsetReset.Earliest
            };
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(async () =>
            {
                using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
                consumer.Subscribe(KafkaContants.VIDEO_STATUS_UPDATED);

                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var cr = consumer.Consume(stoppingToken);

                        var message = cr.Message.Value;
                        var update = JsonSerializer.Deserialize<UpdateVideoStatus>(message);
                        if(update == null)
                        {
                            continue;
                        }

                        await videoHubContext
                                .Clients
                                .Group(update.UserId)
                                .SendAsync("VideoStatusChanged", new
                                {
                                    userId = update.UserId,
                                    videoId = update.VideoId,
                                    status = update.Status,
                                    ThumbnailUrl = update.ThumbnailUrl
                                }, cancellationToken: stoppingToken);
                    }
                }
                catch (OperationCanceledException)
                {
                    consumer.Close();
                }
            }, stoppingToken);
        }

    }
}
