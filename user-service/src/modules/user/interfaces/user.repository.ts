interface Empty {}

interface UserInterface {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string;
}

interface AddUserRequest {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string;
}

interface UpdateUserRequest {
    id: string;
    fullName: string;
}

interface GetUserByIdRequest {
    userId: string;
}

interface InitUserAvatarUploadRequest {
    userId: string;
}

interface InitUserAvatarUploadResponse {
    userAvatarUploadUrl: string;
}
