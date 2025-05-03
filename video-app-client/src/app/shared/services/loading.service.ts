import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    private count = 0;

    show() {
        this.count++;
        queueMicrotask(() => {
            this.loadingSubject.next(true);
        });
    }

    hide() {
        this.count = Math.max(this.count - 1, 0);
        if (this.count === 0) {
            this.loadingSubject.next(false);
        }
    }
}
