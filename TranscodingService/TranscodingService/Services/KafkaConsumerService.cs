using Confluent.Kafka;

namespace VideoUploadService.Services
{
    public class KafkaConsumerService
    {
        private readonly ConsumerConfig _config;
        private readonly IConfiguration configuration;

        public KafkaConsumerService(IConfiguration configuration)
        {
            this.configuration = configuration;

            _config = new ConsumerConfig
            {
                BootstrapServers = this.configuration["Kafka:BootstrapServers"],
                GroupId = this.configuration["Kafka:GroupId"],
                AutoOffsetReset = AutoOffsetReset.Earliest
            };
        }

        public void StartConsuming(string topic)
        {
            using var consumer = new ConsumerBuilder<Ignore, string>(_config).Build();
            consumer.Subscribe(topic);

            Console.WriteLine("Listening for messages...");

            while (true)
            {
                var result = consumer.Consume();
                Console.WriteLine($"Received: {result.Message.Value}");
            }
        }
    }
}
