import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthAdmin, getFirestoreAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!sessionCookie) {
            return NextResponse.json(
                { message: '認証されていません' },
                { status: 401 }
            );
        }

        const auth = getAuthAdmin();

        let decodedToken;
        try {
            // カスタムトークンの検証を試みる
            decodedToken = await auth.verifyIdToken(sessionCookie);
        } catch {
            // セッションCookieとして検証
            try {
                decodedToken = await auth.verifySessionCookie(sessionCookie);
            } catch {
                return NextResponse.json(
                    { message: 'セッションの有効期限が切れました' },
                    { status: 401 }
                );
            }
        }

        const db = getFirestoreAdmin();
        const adminDoc = await db.collection(COLLECTIONS.ADMINS).doc(decodedToken.uid).get();

        if (!adminDoc.exists) {
            return NextResponse.json(
                { message: '管理者権限がありません' },
                { status: 403 }
            );
        }

        const adminData = adminDoc.data();

        return NextResponse.json({
            admin: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                role: adminData?.role || 'moderator',
            },
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { message: '認証エラー' },
            { status: 500 }
        );
    }
}
