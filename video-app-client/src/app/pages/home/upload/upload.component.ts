import { Component } from '@angular/core';
import { UploadService } from '../upload.service';
import { VideoInfor } from '../dtos/video-info.dto';
import { concatMap, switchMap } from 'rxjs';
import { CompleteUpload } from '../dtos/complete-upload.dto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-upload',
    imports: [FormsModule],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss',
})
export class UploadComponent {
    selectedFile: File | null = null;
    videoThumbnail: string | null = null;
    description: string = '';
    duration: number = 0;
    fileName: string = '';
    formatName: string = '';
    size: number = 0;
    title: string = '';

    constructor(private uploadService: UploadService, private router: Router) {}

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.generateThumbnail(this.selectedFile);
            const file = this.selectedFile;
            const videoURL = URL.createObjectURL(file);
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';
            videoElement.src = videoURL;

            this.title = this.selectedFile.name;

            videoElement.onloadedmetadata = () => {
                this.duration = videoElement.duration;
                this.fileName = file.name;
                this.formatName = file.type;
                this.size = file.size;

                URL.revokeObjectURL(videoURL);
            };
        }
    }

    generateThumbnail(file: File) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;

        video.addEventListener('loadeddata', () => {
            video.currentTime = 1;
        });

        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 180;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                this.videoThumbnail = canvas.toDataURL('image/png');
            }

            URL.revokeObjectURL(video.src);
        });
    }

    initUpload() {
        const model: VideoInfor = {
            description: this.description,
            duration: this.duration,
            fileName: this.fileName,
            formatName: this.formatName,
            size: this.size,
            title: this.title,
            userId: '',
        };
        let videoId = '';
        let totalChunks = 0;

        this.uploadService
            .initUpload(model)
            .pipe(
                concatMap((initUploadResult: any) => {
                    videoId = initUploadResult.videoId;
                    totalChunks = initUploadResult.urls.length;

                    return this.uploadService.uploadChunks(
                        this.selectedFile!,
                        initUploadResult.urls
                    );
                }),
                concatMap(() => {
                    return this.uploadService.completeUpload(
                        this.selectedFile!,
                        totalChunks,
                        videoId
                    );
                })
            )
            .subscribe({
                next: () => {
                    console.log('Tất cả các bước upload hoàn tất!');
                    this.router.navigateByUrl('/user/info')
                },
                error: (err) => {
                    console.error('Có lỗi xảy ra trong quá trình upload:', err);
                },
            });
    }
}
