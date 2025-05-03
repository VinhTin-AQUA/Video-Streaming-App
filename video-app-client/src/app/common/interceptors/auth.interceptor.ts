import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../pages/auth/auth.service';
import { environment } from '../../../environments/environment.development';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const skipUrls = ['/api/auth/login', '/api/auth/sign-up'];

    const shouldSkip = skipUrls.some((url) => req.url.includes(url));
    const isPresignedUrl =
        req.url.includes('X-Amz-Algorithm') ||
        req.url.includes(environment.minioUrl);

    if (shouldSkip || isPresignedUrl) {
        return next(req); // Không thêm token
    }

    const token = authService.getToken();
    if (token) {
        // Clone request và thêm Authorization header
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(authReq);
    }

    return next(req); // Nếu không có token, gửi như bình thường
};
