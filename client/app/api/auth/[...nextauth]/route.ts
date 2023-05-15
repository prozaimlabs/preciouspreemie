import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import { headers } from 'next/headers';
import buildRequest from '@/app/actions/buildRequest';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                console.log('++++++ Credentials: ', credentials);

                // const response = await axios.post(
                //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/signin',
                //     credentials
                // );
                let user = null;
                await buildRequest()
                    .post('/api/users/signin', credentials)
                    .then((response) => {
                        user = response.data;
                        console.log('######### SIGNIN RESPONSE: ', response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                console.log('++++++ Signed in User: ', user);

                if (!user) {
                    throw new Error('Invalid credentials');
                }

                return user;
            },
        }),
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
