import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VideoSearchService {
    private searchTerm = new BehaviorSubject<string>('');
    searchTerm$ = this.searchTerm.asObservable();

    setSearchTerm(term: string) {
        this.searchTerm.next(term);
    }
}
