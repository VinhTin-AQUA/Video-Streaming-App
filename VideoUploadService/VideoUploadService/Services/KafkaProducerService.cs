using Confluent.Kafka;
using System.Text.Json;
using VideoUploadService.Contants;
using Confluent.Kafka.Admin;

namespace VideoUploadService.Services
{
    public class KafkaProducerService
    {
        private readonly ProducerConfig _config;
        private readonly IConfiguration configuration;

        public KafkaProducerService(IConfiguration configuration)
        {
            this.configuration = configuration;
            _config = new ProducerConfig
            {
                BootstrapServers = this.configuration["Kafka:BootstrapServers"],
            };
        }

        public async Task Init()
        {
            var adminConfig = new AdminClientConfig { BootstrapServers = this.configuration["Kafka:BootstrapServers"] };
            using var adminClient = new AdminClientBuilder(adminConfig).Build();
            try
            {
                await adminClient.CreateTopicsAsync(new TopicSpecification[]
                {
                    new TopicSpecification { Name = KafakaContants.VIDEO_ENCODING_TASKS_TOPIC, NumPartitions = 1, ReplicationFactor = 1 }
                });
            }
            catch (CreateTopicsException e)
            {
                if (e.Results[0].Error.Code != ErrorCode.TopicAlreadyExists)
                {
                    throw;
                }
            }
        }

        public async Task SendMessageAsync(string topic, object data)
        {
            string jsonMessage = JsonSerializer.Serialize(data);

            using var producer = new ProducerBuilder<Null, string>(_config).Build();
            var result = await producer.ProduceAsync(topic, new Message<Null, string> { Value = jsonMessage });

            Console.WriteLine($"Delivered '{result.Value}' to '{result.TopicPartitionOffset}'");
        }
    }
}
