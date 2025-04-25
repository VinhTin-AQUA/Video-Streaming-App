import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import {  RpcException } from '@nestjs/microservices';
import { catchError, Observable, throwError } from 'rxjs';

// 1. HTTP Status Code -> Tên mã
export const HttpStatusCodeNameMap: Record<number, string> = {
    200: 'OK',
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    408: 'REQUEST_TIMEOUT',
    409: 'CONFLICT',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
    501: 'NOT_IMPLEMENTED',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT',
  };
  
  // 2. gRPC Status Code -> Tên mã
  export const GrpcStatusCodeNameMap: Record<number, string> = {
    0: 'OK',
    1: 'CANCELLED',
    2: 'UNKNOWN',
    3: 'INVALID_ARGUMENT',
    4: 'DEADLINE_EXCEEDED',
    5: 'NOT_FOUND',
    6: 'ALREADY_EXISTS',
    7: 'PERMISSION_DENIED',
    8: 'RESOURCE_EXHAUSTED',
    9: 'FAILED_PRECONDITION',
    10: 'ABORTED',
    11: 'OUT_OF_RANGE',
    12: 'UNIMPLEMENTED',
    13: 'INTERNAL',
    14: 'UNAVAILABLE',
    15: 'DATA_LOSS',
    16: 'UNAUTHENTICATED',
  };
  
  // 3. gRPC → HTTP mapping
  export const GrpcToHttpStatusMap: Record<number, number> = {
    0: 200,  // OK
    1: 408,  // CANCELLED → Request Timeout
    2: 500,  // UNKNOWN
    3: 400,  // INVALID_ARGUMENT
    4: 504,  // DEADLINE_EXCEEDED
    5: 404,  // NOT_FOUND
    6: 409,  // ALREADY_EXISTS
    7: 403,  // PERMISSION_DENIED
    8: 429,  // RESOURCE_EXHAUSTED
    9: 400,  // FAILED_PRECONDITION
    10: 409, // ABORTED
    11: 400, // OUT_OF_RANGE
    12: 501, // UNIMPLEMENTED
    13: 500, // INTERNAL
    14: 503, // UNAVAILABLE
    15: 500, // DATA_LOSS
    16: 401, // UNAUTHENTICATED
  };
  
  // 4. HTTP → gRPC mapping (ngược lại)
  export const HttpToGrpcStatusMap: Record<number, number> = {
    200: 0,
    400: 3,
    401: 16,
    403: 7,
    404: 5,
    408: 1,
    409: 6,
    429: 8,
    500: 13,
    501: 12,
    503: 14,
    504: 4,
  };
  

@Injectable()
export class GrpcExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                // Xử lý lỗi ở đây
                return throwError(() => this.handleError(err));
            }),
        );
    }

    private handleError(error: any) {

        /*
        {
            code: 5,
            details: 'Danh mục không tìm thấy',
            metadata: Metadata {
                internalRepr: Map(4) {
                'content-type' => [Array],
                'date' => [Array],
                'server' => [Array],
                'content-length' => [Array]
                },
                options: {}
            }
        }
        
        */
        console.log(error.code);
        console.log(error.stack);
        // console.log(error.code);

        return new RpcException({
            code: error.code,
            message: error.details,
            error: error.details,
            details: {
                stackTrace: error.stack ?? undefined,
                timestamp: new Date().toISOString(),
            },
        });
    }
}