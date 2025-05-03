import { Routes } from '@angular/router';
import { AuthGuard } from './pages/auth/guards/auth.guard';
import { GuestGuard } from './common/guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        canActivate: [GuestGuard],
        loadChildren: () =>
            import('./pages/auth/auth.routes').then((r) => r.authRoutes),
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./pages/home/video.routes').then((r) => r.videoRoutes),
    },
    {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./pages/user/user.routes').then((r) => r.userRoutes),
    },
];
