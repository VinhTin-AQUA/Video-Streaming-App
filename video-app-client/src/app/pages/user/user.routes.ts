import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { InfoComponent } from './info/info.component';

export const userRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            { path: 'info', component: InfoComponent, title: 'Info' },
        ],
    },
];
