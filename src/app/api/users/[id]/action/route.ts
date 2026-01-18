import { NextResponse } from 'next/server';
import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        if (!action) {
            return NextResponse.json(
                { error: 'Action is required' },
                { status: 400 }
            );
        }

        const { db, auth } = getFirebaseAdmin();

        if (action === 'ban' || action === 'unban') {
            const isBanned = action === 'ban';

            // Firestore更新
            await db.collection(COLLECTIONS.USERS).doc(id).update({
                isBanned: isBanned,
                updatedAt: new Date(),
            });

            // Firebase Auth更新 (アカウント無効化)
            try {
                await auth.updateUser(id, {
                    disabled: isBanned
                });
            } catch (authError) {
                console.warn('Failed to update Auth status (user might not exist in Auth):', authError);
                // AuthにユーザーがいなくてもDB更新は成功とする（整合性のため）
            }
        } else if (action === 'warn') {
            // 警告ロジック（通知ログへの追加など）
            // 今回はログのみ
            await db.collection(COLLECTIONS.ADMIN_AUDIT_LOG).add({
                action: 'user_warning',
                targetUserId: id,
                timestamp: new Date(),
                details: 'Admin sent a warning',
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update user status:', error);
        return NextResponse.json(
            { error: 'Failed to process user action' },
            { status: 500 }
        );
    }
}
