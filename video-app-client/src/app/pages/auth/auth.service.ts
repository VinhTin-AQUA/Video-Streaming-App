import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Signup } from './dtos/sign-up.dto';
import { environment } from '../../../environments/environment.development';
import { Signin } from './dtos/sign-in.dto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly jwtTokenKey = 'video-token';

    constructor(private http: HttpClient) {}

    isLoggedIn() {
        return !!localStorage.getItem(this.jwtTokenKey);
    }

    signUp(model: Signup) {
        return this.http.post(environment.apiUrl + '/auth/sign-up', model);
    }

    signIn(model: Signin) {
        return this.http.post(environment.apiUrl + '/auth/login', model);
    }

    logout(): void {
        localStorage.removeItem(this.jwtTokenKey);
    }

    saveJwtToken(token: string) {
        localStorage.setItem(this.jwtTokenKey, token);
    }

    getToken() {
        return localStorage.getItem(this.jwtTokenKey);
    }

    getCurrentUserId() {
        const token = this.getToken();

        if (!token) {
            return;
        }
        const decoded = jwtDecode(token) as any;
        return decoded.id;
    }
}
