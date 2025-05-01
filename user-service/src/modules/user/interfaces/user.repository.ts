interface Empty {}

interface UserInterface {
    id: string;
    fulleName: string;
    email: string;
    avatartUrl: string;
}

interface AddUserRequest {
    id: string;
    fulleName: string;
    email: string;
    avatartUrl: string;
}

interface UpdateUserRequest {
    id: string;
    fulleName: string;
    email: string;
    avatartUrl: string;
}
