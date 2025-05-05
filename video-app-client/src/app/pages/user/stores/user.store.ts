import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type UserState = {
    id: string;
    fullName: string;
    avatarUrl: any;
    email: string;
};

const initialState: UserState = {
    avatarUrl: 'http://localhost:4200/logo.jpg',
    email: '',
    fullName: '',
    id: '',
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        updateFullName(
            fullName: string,
        ): void {
            patchState(store, (state) => ({
                fullName: fullName,
            }));
        },
        updateEmail(
            email: string,
        ): void {
            patchState(store, (state) => ({
                email: email,
            }));
        },
        updateAvatar(
            avatarUrl: string
        ): void {
            patchState(store, (state) => ({
                avatarUrl: avatarUrl,
            }));
        },
    }))
);
