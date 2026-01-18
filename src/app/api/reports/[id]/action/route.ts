import { NextResponse } from 'next/server';
import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action, note } = body;

        if (!action) {
            return NextResponse.json(
                { error: 'Action is required' },
                { status: 400 }
            );
        }

        const { db } = getFirebaseAdmin();

        // 報告ドキュメントの更新
        await db.collection(COLLECTIONS.REPORTS).doc(id).update({
            status: action === 'dismissed' ? 'resolved' : 'reviewed', // アクションに応じてステータス変更
            actionTaken: action,
            actionNote: note || '',
            updatedAt: new Date(),
        });

        // アクションに応じた追加処理（例：ユーザーBANなど）はここに記述
        // if (action === 'ban_user') { ... }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to take action on report:', error);
        return NextResponse.json(
            { error: 'Failed to process report action' },
            { status: 500 }
        );
    }
}
