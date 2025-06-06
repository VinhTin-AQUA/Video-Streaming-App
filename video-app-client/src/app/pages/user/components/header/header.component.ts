import { Component, inject } from '@angular/core';
import { ClickOutsideDirective } from '../../../../common/directives/click-outside.directive';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { UserStore } from '../../stores/user.store';

export const slideDownAnimation = trigger('slideDown', [
    transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateY(-10px)',
            height: '0px',
            overflow: 'hidden',
        }),
        animate(
            '200ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)', height: '82px' })
        ),
    ]),
    transition(':leave', [
        style({
            overflow: 'hidden',
        }),
        animate(
            '200ms ease-out',
            style({
                opacity: 0,
                // transform: 'translateY(-10px)',
                height: '0px',
            })
        ),
    ]),
]);

@Component({
    selector: 'app-header',
    imports: [ClickOutsideDirective, RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    animations: [slideDownAnimation],
})
export class HeaderComponent {
    menuOpen = false;
    userStore = inject(UserStore);

    constructor(private router: Router, private authService: AuthService) {}

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/auth/login');
    }
}
