import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import SupportClient, { Ticket } from './SupportClient';

async function getSupportTickets(): Promise<Ticket[]> {
    try {
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection(COLLECTIONS.SUPPORT_TICKETS)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId || '',
                userName: data.userName || '',
                userEmail: data.userEmail || '',
                subject: data.subject || '',
                status: data.status || 'open',
                priority: data.priority || 'low',
                category: data.category || 'general',
                content: data.content || '',
                replies: data.replies?.map((r: any) => ({
                    content: r.content,
                    createdAt: r.createdAt?.toDate?.()?.toISOString() ||
                        (typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString()),
                    isAdmin: r.isAdmin
                })) || [],
                lastReplyAt: data.lastReplyAt?.toDate?.()?.toISOString(),
                // Firestore Timestamp to string
                createdAt: data.createdAt?.toDate?.()?.toISOString() ||
                    (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
            };
        });
    } catch (error) {
        console.error('Failed to fetch support tickets:', error);
        return [];
    }
}

export default async function SupportPage() {
    const tickets = await getSupportTickets();

    return <SupportClient initialTickets={tickets} />;
}
