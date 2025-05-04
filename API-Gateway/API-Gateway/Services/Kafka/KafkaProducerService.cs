using API_Gateway.Common.Contants;
using Confluent.Kafka;
using Confluent.Kafka.Admin;
using System.Text.Json;

namespace API_Gateway.Services.Kafka
{
    public class KafkaProducerService
    {
        private readonly ProducerConfig config;
        private readonly IConfiguration configuration;

        public KafkaProducerService(IConfiguration configuration)
        {
            this.configuration = configuration;
            config = new ProducerConfig { BootstrapServers = this.configuration["Kafka:BootstrapServers"] };
        }

        public async Task Init()
        {
            var adminConfig = new AdminClientConfig { BootstrapServers = this.configuration["Kafka:BootstrapServers"] };
            using var adminClient = new AdminClientBuilder(adminConfig).Build();
            try
            {
                await adminClient.CreateTopicsAsync(new TopicSpecification[]
                {
                    new TopicSpecification { Name = KafkaContants.VIDEO_ENCODING_TASKS_TOPIC, NumPartitions = 1, ReplicationFactor = 1 },
                    new TopicSpecification { Name = KafkaContants.VIDEO_STATUS_UPDATED, NumPartitions = 1, ReplicationFactor = 1 },
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

            using var producer = new ProducerBuilder<Null, string>(config).Build();
            var result = await producer.ProduceAsync(topic, new Message<Null, string> { Value = jsonMessage });

            Console.WriteLine($"Delivered '{result.Value}' to '{result.TopicPartitionOffset}'");
        }
    }
}
