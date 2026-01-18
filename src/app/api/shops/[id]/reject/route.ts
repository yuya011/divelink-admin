import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { reason } = body;

        const { db } = getFirebaseAdmin();

        await db.collection('shop_applications').doc(id).update({
            status: 'rejected',
            rejectReason: reason,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to reject shop:', error);
        return NextResponse.json(
            { error: 'Failed to reject shop' },
            { status: 500 }
        );
    }
}
