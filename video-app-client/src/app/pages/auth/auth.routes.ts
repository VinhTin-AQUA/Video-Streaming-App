import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
                title: 'Login',
            },
            {
                path: 'register',
                component: RegisterComponent,
                title: 'Register',
            },
        ],
    },
];
