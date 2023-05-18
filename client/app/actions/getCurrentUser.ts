import { getSession } from './getSession';
import buildRequest from './buildRequest';
import { sanitizeCurrentUserFromBackend } from '../api/sanitizers/current-user';

export default async function getCurrentUser() {
    try {
        // const session = await getSession();

        // if (!session?.user?.email) {
        //     return null;
        // }

        const response = await buildRequest().get('/api/users/currentuser');
        // const response = await axios.get(
        //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        //     {
        //         headers: {
        //             Host: headersList.get('host'),
        //             Cookie: headersList.get('cookie'),
        //         },
        //     }
        // );

        const currentUser = sanitizeCurrentUserFromBackend(response.data);

        if (!currentUser) {
            return null;
        }

        return { currentUser };
    } catch (error: any) {
        return null;
    }
}
