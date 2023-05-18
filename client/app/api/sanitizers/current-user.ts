import { CurrentUser } from '@/app/interfaces/user';

interface User {
    currentUser: CurrentUser;
}

export const sanitizeCurrentUserFromBackend = (data: User) => {
    return {
        id: data.currentUser.id,
        email: data.currentUser.email,
        iat: data.currentUser.iat,
    };
};
