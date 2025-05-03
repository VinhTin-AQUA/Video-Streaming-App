import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm: FormGroup;
    loginError: string | null = null;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    signIn() {
        this.loginError = null;
        this.authService.signIn(this.loginForm.value).subscribe({
            next: (res: any) => {
                this.authService.saveJwtToken(res.data.jwt);
                this.router.navigateByUrl('/home');
            },
            error: (err) => {
                // console.log(err);
                this.loginError = 'Incorrect account or password';
            },
        });
    }
}
