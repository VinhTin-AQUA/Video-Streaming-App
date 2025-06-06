import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoadingInterceptor } from './common/interceptors/loading.interceptor';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withViewTransitions()),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([LoadingInterceptor, AuthInterceptor])
        ),
    ],
};
