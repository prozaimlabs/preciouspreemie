export interface CurrentUser {
    id: string;
    email: string;
    iat: number;
}

export interface BackendCurrentUser {
    currentUser: {
        id: string;
        email: string;
        iat: number;
    };
}
