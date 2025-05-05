import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class VideoMetadaService {
    constructor(private http: HttpClient) {}

    getAllVideoMetadas() {
        return this.http.get(
            environment.apiUrl + '/videometadatas/get-all-videometadatas'
        );
    }

    getVideoMetadasOfUser() {
        return this.http.get(
            environment.apiUrl +
                '/videometadatas/get-all-videometadatas-of-user'
        );
    }

    getVideoMetadataById(videoId: string) {
        return this.http.get(
            environment.apiUrl +
                `/videometadatas/get-videometadata-by-id/${videoId}`
        );
    }

    searchVideosByTitle(title: string) {
        const params = new HttpParams().set('title', title.trim() ?? '');
        return this.http.get(
            `${environment.apiUrl}/videometadatas/search-videos-by-title`,
            { params }
        );
    }
}
