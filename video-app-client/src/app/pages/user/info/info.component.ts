import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoMetadaService } from '../../home/video-metada.service';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-info',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
})
export class InfoComponent {
    user = {
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        photos: [
            'https://picsum.photos/seed/1/200',
            'https://picsum.photos/seed/2/200',
            'https://picsum.photos/seed/3/200',
            'https://picsum.photos/seed/4/200',
            'https://picsum.photos/seed/5/200',
        ],
    };

    videoList: any = [];
    showEditModal = false;
    editFullName = this.user.fullName;
    editEmail = this.user.email;
    hubConnection!: signalR.HubConnection;

    constructor(
        private videoMetadaService: VideoMetadaService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        const userId = this.authService.getCurrentUserId();
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubUr}/hub/video-update-hub`)
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().then(() => {
            this.hubConnection.invoke('JoinGroup', `video_status_update_${userId}`);
        });

        this.videoMetadaService.getVideoMetadasOfUser().subscribe({
            next: (res: any) => {
                this.videoList = res;

                this.hubConnection.on('VideoStatusChanged', (data) => {
                    const video = this.videoList.find((v: any) => v.id === data.videoId);
                    if (video) {
                        video.status = data.status;
                        video.thumbnailUrl = data.thumbnailUrl;
                    }
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    saveChanges() {
        this.user.fullName = this.editFullName;
        this.user.email = this.editEmail;
        this.showEditModal = false;
    }

    onDestroy() {
        this.hubConnection.stop();
    }
}
