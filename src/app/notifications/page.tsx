import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import NotificationsClient, { NotificationLog } from './NotificationsClient';

async function getNotificationHistory(): Promise<NotificationLog[]> {
    try {
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection(COLLECTIONS.NOTIFICATIONS_LOG)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || '',
                body: data.body || '',
                target: data.target || 'all',
                segment: data.segment || undefined,
                status: (['sent', 'scheduled', 'failed'].includes(data.status) ? data.status : 'sent') as any,
                sentAt: data.sentAt?.toDate?.()?.toISOString() ||
                    (typeof data.sentAt === 'string' ? data.sentAt : undefined),
                scheduledAt: data.scheduledAt?.toDate?.()?.toISOString() ||
                    (typeof data.scheduledAt === 'string' ? data.scheduledAt : undefined),
                recipientCount: data.recipientCount || undefined,
                openRate: data.openRate || undefined,
            };
        });
    } catch (error) {
        console.error('Failed to fetch notification history:', error);
        return [];
    }
}

export default async function NotificationsPage() {
    const history = await getNotificationHistory();

    return <NotificationsClient initialHistory={history} />;
}
