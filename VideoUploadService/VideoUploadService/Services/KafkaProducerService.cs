using Confluent.Kafka;
using System.Text.Json;

namespace VideoUploadService.Services
{
    public class KafkaProducerService
    {
        private readonly ProducerConfig _config;
        private readonly IConfiguration configuration;

        public KafkaProducerService(IConfiguration configuration)
        {
            this.configuration = configuration;
            _config = new ProducerConfig { BootstrapServers = this.configuration["Kafka:BootstrapServers"] };
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
