import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { HeaderComponent } from '../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment.development';

@Component({
    selector: 'app-video-view',
    imports: [HeaderComponent],
    templateUrl: './video-view.component.html',
    styleUrl: './video-view.component.scss',
})
export class VideoViewComponent {
    @ViewChild('videoPlayer', { static: true }) videoElementRef!: ElementRef;
    player!: any;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((res: any) => {
            // fileName
            // userId
            // videoId
            this.player = videojs(this.videoElementRef.nativeElement, {
                techOrder: ['dash', 'html5'],
                controls: true,
                autoplay: false,
                preload: 'auto',
                fluid: true,
                sources: [{
                  src: `${environment.apiUrl}/videostreamings/dash/${res.userId}/${res.videoId}/${res.fileName}`, // link API bạn cung cấp
                  type: 'application/dash+xml'
                }]
              }, () => {
                console.log('Player is ready');
              });
        });
    }
    
    ngOnDestroy(): void {
        if (this.player) {
            this.player.dispose();
        }
    }
}
