import { AfterViewInit, Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { RouterLink } from '@angular/router';
import { VideoMetadaService } from '../video-metada.service';

@Component({
    selector: 'app-video-list',
    imports: [HeaderComponent, RouterLink],
    templateUrl: './video-list.component.html',
    styleUrl: './video-list.component.scss',
})
export class VideoListComponent  {
    categories = [
        { name: 'Trang chủ', icon: 'home' },
        { name: 'Âm nhạc', icon: 'music_note' },
        { name: 'Thể thao', icon: 'sports_soccer' },
        { name: 'Trò chơi', icon: 'sports_esports' },
        { name: 'Tin tức', icon: 'article' },
        { name: 'Giải trí', icon: 'theaters' },
        { name: 'Học tập', icon: 'school' },
    ];

    videos: any = [];

    constructor(private videoMetadaService: VideoMetadaService) {}
    ngAfterViewInit() {
        this.videoMetadaService.getAllVideoMetadas().subscribe({
            next: (res: any) => {
                this.videos = res;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
