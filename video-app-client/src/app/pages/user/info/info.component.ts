import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoMetadaService } from '../../home/video-metada.service';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';
import { UserStore } from '../stores/user.store';
import { UserService } from '../user.service';
import { concatMap, switchMap } from 'rxjs';

@Component({
    selector: 'app-info',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
})
export class InfoComponent {
    userStore = inject(UserStore);

    videoList: any = [];
    showEditModal = false;
    editFullName = this.userStore.fullName();
    hubConnection!: signalR.HubConnection;

    showAvatarModal = false;
    userAvatarPresignedUpload: string = '';
    avatarFile: File | null = null;
    selectedImageUrl: any;

    constructor(
        private videoMetadaService: VideoMetadaService,
        private authService: AuthService,
        private userService: UserService
    ) {}

    ngOnInit() {
        const userId = this.authService.getCurrentUserId();
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubUr}/hub/video-update-hub`)
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().then(() => {
            this.hubConnection.invoke(
                'JoinGroup',
                `video_status_update_${userId}`
            );
        });

        this.videoMetadaService.getVideoMetadasOfUser().subscribe({
            next: (res: any) => {
                this.videoList = res;

                this.hubConnection.on('VideoStatusChanged', (data) => {
                    const video = this.videoList.find(
                        (v: any) => v.id === data.videoId
                    );
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

    updateProfile() {
        this.userService
            .updateProfile({ fullName: this.editFullName, id: '' })
            .subscribe({
                next: (res: any) => {
                    this.userStore.updateFullName(this.editFullName);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        this.showEditModal = false;
    }

    openAvatarModal(flag: boolean) {
        this.showAvatarModal = flag;
    }

    onAvatarSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.avatarFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.selectedImageUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    updateAvatar() {
        if (!this.avatarFile) {
            return;
        }

        this.userService
            .initUserAvatarPresignedUpload()
            .pipe(
                switchMap((presignedUrls: any) => {
                    const chunk = this.avatarFile!.slice(
                        0,
                        this.avatarFile!.size
                    );
                    return this.userService.updateUserAvatarOnMinio(
                        chunk!,
                        presignedUrls.userAvatarUploadUrl
                    );
                })
            )
            .subscribe({
                next: () => {
                    this.userStore.updateAvatar(this.selectedImageUrl);
                    this.resetAvatar();
                },
                error: (err) => {
                    console.error('Lỗi khi tải lên:', err);
                },
            });
        this.openAvatarModal(false);
    }

    private resetAvatar() {
        this.userAvatarPresignedUpload = '';
        this.avatarFile = null;
        this.selectedImageUrl = null;
    }

    onDestroy() {
        this.hubConnection.stop();
    }
}
