import { cookies } from 'next/headers';
import { getAuthAdmin, getFirestoreAdmin, COLLECTIONS } from './firebase-admin';
import type { Admin } from '@/types';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRY_DAYS = 5;

export async function createSessionCookie(idToken: string): Promise<string> {
    const auth = getAuthAdmin();
    const expiresIn = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
}

export async function verifySessionCookie(sessionCookie: string): Promise<{ uid: string; email: string } | null> {
    try {
        const auth = getAuthAdmin();
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        return {
            uid: decodedClaims.uid,
            email: decodedClaims.email || '',
        };
    } catch {
        return null;
    }
}

export async function getAdminFromSession(): Promise<Admin | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
        return null;
    }

    const user = await verifySessionCookie(sessionCookie);
    if (!user) {
        return null;
    }

    const db = getFirestoreAdmin();
    const adminDoc = await db.collection(COLLECTIONS.ADMINS).doc(user.uid).get();

    if (!adminDoc.exists) {
        return null;
    }

    return {
        uid: user.uid,
        ...adminDoc.data(),
    } as Admin;
}

export async function isAuthenticated(): Promise<boolean> {
    const admin = await getAdminFromSession();
    return admin !== null;
}

export async function hasPermission(requiredRole: 'super_admin' | 'admin' | 'moderator'): Promise<boolean> {
    const admin = await getAdminFromSession();
    if (!admin) return false;

    const roleHierarchy = {
        'super_admin': 3,
        'admin': 2,
        'moderator': 1,
    };

    return roleHierarchy[admin.role] >= roleHierarchy[requiredRole];
}

export { SESSION_COOKIE_NAME };
