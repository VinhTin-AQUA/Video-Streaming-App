using Microsoft.Extensions.Hosting;
using Confluent.Kafka;

public class KafkaConsumerBackgroundService : BackgroundService
{
    private readonly ILogger<KafkaConsumerBackgroundService> _logger;
    private readonly string _topic = "your-topic";
    private readonly ConsumerConfig _config = new()
    {
        BootstrapServers = "localhost:9092",
        GroupId = "your-group-id",
        AutoOffsetReset = AutoOffsetReset.Earliest
    };

    public KafkaConsumerBackgroundService(ILogger<KafkaConsumerBackgroundService> logger)
    {
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(() =>
        {
            using var consumer = new ConsumerBuilder<Ignore, string>(_config).Build();
            consumer.Subscribe(_topic);

            _logger.LogInformation("Kafka consumer started...");

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    var cr = consumer.Consume(stoppingToken);
                    _logger.LogInformation($"Received message: {cr.Message.Value}");
                }
            }
            catch (OperationCanceledException)
            {
                consumer.Close();
            }
        }, stoppingToken);
    }
}
