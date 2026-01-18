import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import ReportsClient, { Report } from './ReportsClient';

async function getReports(): Promise<Report[]> {
    try {
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection(COLLECTIONS.REPORTS)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                reporterId: data.reporterId || '',
                reporterName: data.reporterName || 'Unknown User',
                reportedUserId: data.reportedUserId || '',
                reportedUserName: data.reportedUserName || 'Unknown User',
                reportedPostId: data.reportedPostId,
                reason: data.reason || 'other',
                details: data.details || '',
                status: data.status || 'pending',
                action: data.action,
                actionNote: data.actionNote,
                // Firestore Timestamp to string
                createdAt: data.createdAt?.toDate?.()?.toISOString() ||
                    (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
            };
        });
    } catch (error) {
        console.error('Failed to fetch reports:', error);
        return [];
    }
}

export default async function ReportsPage() {
    const reports = await getReports();

    return <ReportsClient initialReports={reports} />;
}
