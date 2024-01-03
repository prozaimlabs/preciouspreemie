import { BackendCurrentUser, CurrentUser } from '@/app/interfaces/user';

export const sanitizeCurrentUserFromBackend = (
    data: BackendCurrentUser
): CurrentUser => {
    return {
        id: data.currentUser.id,
        email: data.currentUser.email,
        iat: data.currentUser.iat,
    };
};
