import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VideoMetadaService } from '../video-metada.service';
import { FormsModule } from '@angular/forms';
import { VideoSearchService } from '../video-search.service';

@Component({
    selector: 'app-video-list',
    imports: [RouterLink],
    templateUrl: './video-list.component.html',
    styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
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

    constructor(
        private videoMetadaService: VideoMetadaService,
        private searchService: VideoSearchService
    ) {}

    ngOnInit() {
        this.searchService.searchTerm$.subscribe((title) => {
            this.searchVideosByTitle(title);
        });
    }

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

    searchVideosByTitle(title: string) {
        this.videoMetadaService.searchVideosByTitle(title).subscribe({
            next: (res: any) => {
                // console.log(res);
                this.videos = res;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
