import axios from 'axios';
import { headers } from 'next/headers';

export default () => {
    const headersList = headers();

    const cookie = headersList
        .get('cookie')
        ?.split(';')
        .find((cookie: string) => {
            return cookie.includes('session=');
        });

    return axios.create({
        baseURL:
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: {
            Host: headersList.get('host'),
            Cookie: cookie,
        },
    });
};
