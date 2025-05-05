import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { VideoInfor } from '../dtos/video-info.dto';
import { VideoMetadaService } from '../video-metada.service';

@Component({
    selector: 'app-video-view',
    imports: [],
    templateUrl: './video-view.component.html',
    styleUrl: './video-view.component.scss',
})
export class VideoViewComponent {
    @ViewChild('videoPlayer', { static: true }) videoElementRef!: ElementRef;
    player!: any;
    video: VideoInfor = {
        description: '',
        duration: 0,
        fileName: '',
        formatName: '',
        size: 0,
        title: '',
        userId: '',
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private videoMetadataService: VideoMetadaService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((res: any) => {
            // fileName
            // userId
            // videoId

            this.player = videojs(
                this.videoElementRef.nativeElement,
                {
                    techOrder: ['dash', 'html5'],
                    controls: true,
                    autoplay: false,
                    preload: 'auto',
                    fluid: true,
                    sources: [
                        {
                            src: `${environment.apiUrl}/videostreamings/dash/${res.userId}/${res.videoId}/${res.fileName}`, // link API bạn cung cấp
                            type: 'application/dash+xml',
                        },
                    ],
                },
                () => {
                    console.log('Player is ready');
                }
            );

            this.getVideoMetadataById(res.videoId);
        });
    }

    private getVideoMetadataById(videoId: string) {
        this.videoMetadataService.getVideoMetadataById(videoId).subscribe({
            next: (res: any) => {
                this.video.description = res.description;
                this.video.title = res.title;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    ngOnDestroy(): void {
        if (this.player) {
            this.player.dispose();
        }
    }
}
