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

    // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',

    return axios.create({
        baseURL: 'http://www.zubairabubakar.co/',
        headers: {
            Host: headersList.get('host'),
            Cookie: cookie,
        },
    });
};
