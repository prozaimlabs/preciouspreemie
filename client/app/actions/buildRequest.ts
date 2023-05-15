import axios from 'axios';
import { headers } from 'next/headers';

export default () => {
    const headersList = headers();

    return axios.create({
        baseURL:
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: {
            Host: headersList.get('host'),
            Cookie: headersList.get('cookie'),
        },
    });
};
