namespace API_Gateway.Common.Response
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}
