import buildRequest from './buildRequest';
import { sanitizeCurrentUserFromBackend } from '../api/sanitizers/current-user';

export default async function getCurrentUser() {
    try {
        const response = await buildRequest().get('/api/users/currentuser');

        const currentUser = sanitizeCurrentUserFromBackend(response.data);

        if (!currentUser) {
            return null;
        }

        return currentUser;
    } catch (error: any) {
        return null;
    }
}
