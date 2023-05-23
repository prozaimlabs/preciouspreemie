import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';

export async function getSession() {
    return await getServerSession(authOptions);
}
