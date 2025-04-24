
interface Empty {}

interface Auth {
    id: string
    password: string
    email: string
}

interface RegisterRequest {
    password: string
    email: string
}

interface RegisterResponse {
    message: string
}

interface LoginRequest {
    password: string
    email: string
}

interface LoginResponse {
    message: string
    jwt: string
}

interface ForgotPasswordRequest {
    email: string
}

interface ForgotPasswordResponse {
    message: string
}

interface ChangePasswordRequest {
    email: string
    oldPassword: string
    newPassword: string
}

interface ChangePasswordResponse {
    message: string
}

