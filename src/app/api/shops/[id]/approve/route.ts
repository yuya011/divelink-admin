import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Next.js 15+ compatible params handling
) {
    try {
        const { id } = await params;
        const { db } = getFirebaseAdmin();

        // 1. Update application status
        await db.collection('shop_applications').doc(id).update({
            status: 'approved',
            updatedAt: new Date(),
        });

        // 2. Create actual shop document (optional: depending on data structure)
        // const appDoc = await db.collection('shop_applications').doc(id).get();
        // const appData = appDoc.data();
        // await db.collection('shops').doc(appData.shopId || id).set({ ... });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to approve shop:', error);
        return NextResponse.json(
            { error: 'Failed to approve shop' },
            { status: 500 }
        );
    }
}
