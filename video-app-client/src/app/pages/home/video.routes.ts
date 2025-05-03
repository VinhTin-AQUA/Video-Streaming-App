import { Routes } from '@angular/router';
import { VideoViewComponent } from './video-view/video-view.component';
import { HomeComponent } from './home.component';
import { VideoListComponent } from './video-list/video-list.component';
import { UploadComponent } from './upload/upload.component';

export const videoRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: VideoListComponent,
                title: 'Home',
            },
            {
                path: 'video-view',
                component: VideoViewComponent,
                title: 'Video view',
            },
            {
                path: 'upload',
                component: UploadComponent,
                title: 'Upload',
            },
        ],
    },
];
