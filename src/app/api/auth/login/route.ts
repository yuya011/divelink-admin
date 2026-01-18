import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin, getFirestoreAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import { createSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'メールアドレスとパスワードを入力してください' },
                { status: 400 }
            );
        }

        // Firebase Authでユーザーを検証（Admin SDKでは直接パスワード認証できないため、
        // クライアントからIDトークンを受け取る形式に変更が必要）
        // ここでは簡易的にユーザーの存在確認とadmin権限確認のみ行う
        const auth = getAuthAdmin();

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch {
            return NextResponse.json(
                { message: 'ユーザーが見つかりません' },
                { status: 401 }
            );
        }

        // 管理者コレクションでの権限確認
        const db = getFirestoreAdmin();
        const adminDoc = await db.collection(COLLECTIONS.ADMINS).doc(userRecord.uid).get();

        if (!adminDoc.exists) {
            return NextResponse.json(
                { message: '管理者権限がありません' },
                { status: 403 }
            );
        }

        const adminData = adminDoc.data();

        // カスタムトークンを作成してセッションCookieを生成
        const customToken = await auth.createCustomToken(userRecord.uid);

        // 注意: 本番環境ではクライアントからidTokenを受け取る形式に変更してください
        // ここでは開発用に簡易的な実装としています

        const response = NextResponse.json({
            admin: {
                uid: userRecord.uid,
                email: userRecord.email,
                role: adminData?.role || 'moderator',
            },
        });

        // 開発用のセッションCookie設定（本番ではidTokenベースに変更）
        response.cookies.set(SESSION_COOKIE_NAME, customToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 5, // 5日間
            path: '/',
        });

        // 最終ログイン時刻を更新
        await db.collection(COLLECTIONS.ADMINS).doc(userRecord.uid).update({
            lastLoginAt: new Date(),
        });

        return response;
    } catch (error: any) {
        console.error('Login error details:', error);

        // エラー詳細を返す（開発/デバッグ用）
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;

        return NextResponse.json(
            {
                message: 'ログイン処理中にエラーが発生しました',
                error: errorMessage,
                details: errorStack
            },
            { status: 500 }
        );
    }
}
