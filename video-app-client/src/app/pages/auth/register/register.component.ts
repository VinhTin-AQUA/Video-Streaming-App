import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent {
    registerForm: FormGroup;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.registerForm = this.fb.group(
            {
                email: ['', [Validators.required, Validators.email]],
                fullName: ['', [Validators.required, Validators.minLength(3)]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', [Validators.required]],
            },
            {
                validators: this.passwordsMatchValidator as ValidatorFn,
            }
        );
    }

    passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        return password === confirmPassword ? null : { mismatch: true };
    }

    register() {
        this.authService.signUp(this.registerForm.value).subscribe({
            next: (res: any) => {
                console.log(res);
                this.router.navigateByUrl('/home');
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
