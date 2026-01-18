import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection('shop_applications')
            .orderBy('createdAt', 'desc')
            .get();

        const applications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Firestore Timestamp to string conversion if needed
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        }));

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Failed to fetch shop applications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shop applications' },
            { status: 500 }
        );
    }
}
