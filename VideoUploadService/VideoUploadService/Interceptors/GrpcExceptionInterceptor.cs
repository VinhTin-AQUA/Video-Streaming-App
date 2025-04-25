using Grpc.Core;
using Grpc.Core.Interceptors;
using System.Security;

namespace VideoUploadService.Interceptors
{
    public class GrpcExceptionInterceptor : Interceptor
    {
        public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(
        TRequest request,
        ServerCallContext context,
        UnaryServerMethod<TRequest, TResponse> continuation)
        {
            try
            {
                return await continuation(request, context);
            }
            catch (RpcException rpcEx)
            {
                Console.WriteLine($"gRPC Error: {rpcEx.Status.Detail}");
                throw; // Giữ nguyên exception
            }
            catch (Exception ex)
            {
                // Chuyển đổi exception thường thành RpcException
                var statusCode = MapExceptionToStatusCode(ex);
                var metadata = new Metadata
                {
                    { "stack-trace", ex.StackTrace ?? "" },
                    { "timestamp", DateTime.UtcNow.ToString("o") }
                };

                throw new RpcException(new Status(statusCode, ex.Message), metadata);
            }
        }

        private static StatusCode MapExceptionToStatusCode(Exception ex)
        {
            return ex switch
            {
                // Ánh xạ chi tiết
                TaskCanceledException _ => StatusCode.Cancelled,
                ArgumentException _ => StatusCode.InvalidArgument,
                TimeoutException _ => StatusCode.DeadlineExceeded,
                KeyNotFoundException _ => StatusCode.NotFound,
                FileNotFoundException _ => StatusCode.NotFound,
                InvalidOperationException _ when ex.Message.Contains("already exists")
                    => StatusCode.AlreadyExists,
                UnauthorizedAccessException _ => StatusCode.PermissionDenied,
                OutOfMemoryException _ => StatusCode.ResourceExhausted,
                IndexOutOfRangeException _ => StatusCode.OutOfRange,
                NotImplementedException _ => StatusCode.Unimplemented,
                HttpRequestException _ => StatusCode.Unavailable,
                IOException _ => StatusCode.DataLoss,
                SecurityException _ => StatusCode.Unauthenticated,

                // Mặc định
                _ => ex is OperationCanceledException ? StatusCode.Aborted
                     : StatusCode.Internal
            };
        }
    }
}
