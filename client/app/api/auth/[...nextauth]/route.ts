import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import buildRequest from '@/app/actions/buildRequest';
import { sanitizeCurrentUserFromBackend } from '../../sanitizers/current-user';
import { useRouter } from 'next/navigation';

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

                let user = null;
                await buildRequest()
                    .post('/api/users/signin', credentials)
                    .then((response) => {
                        user = response.data;
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                if (!user) {
                    throw new Error('Invalid credentials');
                }

                return sanitizeCurrentUserFromBackend(user);
            },
        }),
    ],
    events: {
        async signOut() {
            const router = useRouter();
            await buildRequest()
                .post('/api/users/signout')
                .then(() => {
                    router.push('/');
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
