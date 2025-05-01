using Grpc.Core;
using System.Net;

namespace API_Gateway.Middleware
{
    public class GrpcExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GrpcExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (RpcException ex)
            {
                await HandleRpcExceptionAsync(context, ex);
            }
        }

        private static Task HandleRpcExceptionAsync(HttpContext context, RpcException exception)
        {
            var statusCode = exception.StatusCode switch
            {
                StatusCode.OK => HttpStatusCode.OK,
                StatusCode.Cancelled => HttpStatusCode.RequestTimeout,
                StatusCode.Unknown => HttpStatusCode.InternalServerError,
                StatusCode.InvalidArgument => HttpStatusCode.BadRequest,
                StatusCode.DeadlineExceeded => HttpStatusCode.GatewayTimeout,
                StatusCode.NotFound => HttpStatusCode.NotFound,
                StatusCode.AlreadyExists => HttpStatusCode.Conflict,
                StatusCode.PermissionDenied => HttpStatusCode.Forbidden,
                StatusCode.ResourceExhausted => HttpStatusCode.TooManyRequests,
                StatusCode.FailedPrecondition => HttpStatusCode.PreconditionFailed,
                StatusCode.Aborted => HttpStatusCode.Conflict,
                StatusCode.OutOfRange => HttpStatusCode.BadRequest,
                StatusCode.Unimplemented => HttpStatusCode.NotImplemented,
                StatusCode.Internal => HttpStatusCode.InternalServerError,
                StatusCode.Unavailable => HttpStatusCode.ServiceUnavailable,
                StatusCode.DataLoss => HttpStatusCode.InternalServerError,
                StatusCode.Unauthenticated => HttpStatusCode.Unauthorized,
                _ => HttpStatusCode.InternalServerError
            };

            context.Response.StatusCode = (int)statusCode;
            return context.Response.WriteAsJsonAsync(new { Error = exception.Status.Detail, stackTrace = exception.StackTrace });
        }
    }
}
