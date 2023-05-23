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
                        console.log(
                            '********** SIGNIN RESPONSE: ',
                            response.data
                        );
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                if (!user) {
                    throw new Error('Invalid credentials');
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    },
    events: {
        async signOut({ token, session }) {
            // const router = useRouter();
            // await buildRequest()
            //     .post('/api/users/signout')
            //     .then(() => {
            //         token = {};
            //         session = { expires: '' };
            //         console.log('Routing to home page');
            //         router.push('/');
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
            // token = {};
            // session = { expires: '' };
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
