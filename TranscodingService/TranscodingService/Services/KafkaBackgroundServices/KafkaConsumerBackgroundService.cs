﻿using Confluent.Kafka;
using System.Text.Json;
using TranscodingService.Common.Contants;
using TranscodingService.Models;
using TranscodingService.Services;

namespace TranscodingService.Services.KafkaBackgroundServices
{
    public class KafkaConsumerBackgroundService : BackgroundService
    {
        private readonly ConsumerConfig _config;
        private readonly IConfiguration configuration;
        private readonly VideoProcessor videoProcessor;

        public KafkaConsumerBackgroundService(VideoProcessor videoProcessor, IConfiguration configuration)
        {
            this.videoProcessor = videoProcessor;
            this.configuration = configuration;

            _config = new ConsumerConfig
            {
                BootstrapServers = this.configuration["Kafka:BootstrapServers"],
                GroupId = this.configuration["Kafka:GroupId"],
                AutoOffsetReset = AutoOffsetReset.Earliest
            };
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Run(async () =>
            {
                using var consumer = new ConsumerBuilder<Ignore, string>(_config).Build();
                consumer.Subscribe(KafkaContants.VIDEO_ENCODING_TASKS_TOPIC);
                try
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var message = consumer.Consume(stoppingToken);
                        var task = JsonSerializer.Deserialize<VideoMetadataMessage>(message.Message.Value);
                        Console.WriteLine($"message from {KafkaContants.VIDEO_ENCODING_TASKS_TOPIC} topic: {task!.VideoId}");

                        await videoProcessor.ProcessVideoAsync(task);
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
