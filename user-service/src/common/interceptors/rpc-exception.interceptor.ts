import { status } from '@grpc/grpc-js';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class GrpcExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                return throwError(() => this.handleError(err));
            }),
        );
    }

    private handleError(error: any) {
        // console.log(error);
        
        // Nếu đã là RpcException thì không cần xử lý thêm
        if (error instanceof RpcException) {
            return error;
        }

        // Xác định gRPC status code
        let grpcStatusCode = status.UNKNOWN; // Mặc định là UNKNOWN (2)
        let message = error.message || 'Internal server error';

        // Nếu error có status code HTTP
        if (error.status) {
            grpcStatusCode = this.mapHttpToGrpc(error.status);
        }

        // Nếu error có code gRPC
        else if (error.code && typeof error.code === 'number') {
            grpcStatusCode = error.code;
        }

        // Xử lý các trường hợp đặc biệt
        if (error.name === 'EntityNotFoundError') {
            grpcStatusCode = status.NOT_FOUND;
            message = 'Resource not found';
        }

        // Tạo RpcException mới với thông tin đã xử lý
        return new RpcException({
            code: grpcStatusCode,
            message: message,
            details: {
                originalError: error.name || 'Error',
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                timestamp: new Date().toISOString(),
            },
        });
    }

    private mapHttpToGrpc(httpStatus: number): number {
        const mapping: Record<number, number> = {
            200: status.OK,
            400: status.INVALID_ARGUMENT,
            401: status.UNAUTHENTICATED,
            403: status.PERMISSION_DENIED,
            404: status.NOT_FOUND,
            408: status.CANCELLED,
            409: status.ALREADY_EXISTS,
            429: status.RESOURCE_EXHAUSTED,
            500: status.INTERNAL,
            501: status.UNIMPLEMENTED,
            503: status.UNAVAILABLE,
            504: status.DEADLINE_EXCEEDED,
        };

        return mapping[httpStatus] || status.UNKNOWN;
    }
}