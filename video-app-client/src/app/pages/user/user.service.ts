import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpClient } from '@angular/common/http';
import { UserStore } from './stores/user.store';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    userStore = inject(UserStore);

    constructor(private http: HttpClient) {}

    getUserById() {
        return this.http.get(`${environment.apiUrl}/users/get-user-by-id`);
    }

    initUser() {
        this.getUserById().subscribe({
            next: (res: any) => {
                // console.log(res);
                this.userStore.updateFullName(res.fullName);
                this.userStore.updateEmail(res.email);
                this.userStore.updateAvatar(res.avatarUrl);
                console.log(this.userStore.fullName());
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    updateProfile(model: UpdateUserDto) {
        return this.http.put(`${environment.apiUrl}/users/update-user`, model);
    }

    initUserAvatarPresignedUpload() {
        return this.http.get(
            `${environment.apiUrl}/users/init-user-avatar-upload`
        );
    }

    updateUserAvatarOnMinio(file: Blob, uploadUrl: string) {
        return this.http.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
    }
}
