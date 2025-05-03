import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { VideoInfor } from './dtos/video-info.dto';
import { forkJoin, from, Observable, switchMap } from 'rxjs';
import { CompleteUpload } from './dtos/complete-upload.dto';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    constructor(private http: HttpClient) {}

    initUpload(model: VideoInfor) {
        return this.http.post(
            environment.apiUrl + '/uploads/init-upload',
            model,
            {
                headers: {
                    'Content-Type': 'application/json',
                    accept: '*/*',
                },
            }
        );
    }

    uploadChunks(file: File, presignedUrls: string[]) {
        const chunks = this.splitFileIntoChunksByCount(
            file,
            presignedUrls.length
        );

        if (chunks.length !== presignedUrls.length) {
            throw new Error('Số lượng chunks không khớp với số URL presigned!');
        }

        const uploadObservables = chunks.map((chunk, index) => {
            const url = presignedUrls[index];
            return this.http.put(url, chunk, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                reportProgress: true,
                observe: 'events',
                // withCredentials: false
            });
        });

        return forkJoin(uploadObservables);
    }

    completeUpload(
        file: File,
        totalChunks: number,
        videoId: string
    ): Observable<any> {
        return from(this.calculateChecksums(file, totalChunks)).pipe(
            switchMap((checksums) => {
                const model: CompleteUpload = {
                    chunkChecksums: checksums,
                    userId: '',
                    videoId: videoId,
                };

                return this.http.post(
                    environment.apiUrl + '/uploads/complete-upload',
                    model
                );
            })
        );
    }

    private splitFileIntoChunksByCount(
        file: File,
        numberOfChunks: number
    ): Blob[] {
        const chunks: Blob[] = [];
        const chunkSize = Math.ceil(file.size / numberOfChunks);

        for (let i = 0; i < numberOfChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            chunks.push(chunk);
        }

        return chunks;
    }

    async calculateChecksums(
        file: File,
        totalChunks: number
    ): Promise<string[]> {
        const checksums: string[] = [];
        const fileSize = file.size;
        const chunkSize = Math.ceil(fileSize / totalChunks); // chia đều theo số lượng chunk

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, fileSize);
            const chunk = file.slice(start, end);

            const buffer = await this.readChunkAsArrayBuffer(chunk);
            const checksum = await this.computeSha256Hash(buffer);
            checksums.push(checksum);
        }

        return checksums;
    }

    private readChunkAsArrayBuffer(chunk: Blob): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(chunk);
        });
    }

    private async computeSha256Hash(buffer: ArrayBuffer): Promise<string> {
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    }
}
