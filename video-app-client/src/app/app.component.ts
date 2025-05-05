import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './shared/services/loading.service';
import { CommonModule } from '@angular/common';
import { UserService } from './pages/user/user.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoadingComponent, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'video-app-client';
    constructor(public loadingService: LoadingService, private userService: UserService) {}

    ngOnInit() {
        this.userService.initUser();
    }
}
