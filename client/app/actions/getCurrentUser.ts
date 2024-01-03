import { getSession } from './getSession';
import buildRequest from './buildRequest';
import { headers, cookies } from 'next/headers';
import { sanitizeCurrentUserFromBackend } from '../api/sanitizers/current-user';
import axios from 'axios';

export default async function getCurrentUser() {
    try {
        const session = await getSession();

        // if (!session?.user?.email) {
        //     return null;
        // }

        console.log('SESSION: ', session);

        const response = await buildRequest().get('/api/users/currentuser');

        console.log('Current user*******: ', response.data);
        const currentUser = sanitizeCurrentUserFromBackend(response.data);

        if (!currentUser) {
            return null;
        }

        console.log('BACKEND user0000000: ', currentUser);

        return currentUser;
    } catch (error: any) {
        return null;
    }
}
