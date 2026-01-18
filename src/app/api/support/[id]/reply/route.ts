import { NextResponse } from 'next/server';
import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { reply } = body;

        if (!reply) {
            return NextResponse.json(
                { error: 'Reply content is required' },
                { status: 400 }
            );
        }

        const { db } = getFirebaseAdmin();

        // チケットの更新
        await db.collection(COLLECTIONS.SUPPORT_TICKETS).doc(id).update({
            status: 'replied', // 返信済みに変更（open -> replied -> closed）
            lastReplyAt: new Date(),
            replies: FieldValue.arrayUnion({
                content: reply,
                createdAt: new Date(),
                isAdmin: true,
            }),
            updatedAt: new Date(),
        });

        // ここで実際のメール送信ロジックなどを呼び出す
        // await sendEmail(...)

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to reply to support ticket:', error);
        return NextResponse.json(
            { error: 'Failed to process reply' },
            { status: 500 }
        );
    }
}
