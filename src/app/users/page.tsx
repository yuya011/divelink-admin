import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import UsersClient, { UserData } from './UsersClient';

async function getUsers(): Promise<UserData[]> {
    try {
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection(COLLECTIONS.USERS)
            .orderBy('createdAt', 'desc')
            .limit(50) // パフォーマンス考慮
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                email: data.email || '',
                name: data.name || data.displayName || '',
                rank: data.rank || '-',
                organization: data.organization || '-',
                totalLogs: data.totalLogs || 0,
                // Firestore Timestamp -> ISO String
                lastLoginAt: data.lastLoginAt?.toDate?.()?.toISOString() ||
                    (typeof data.lastLoginAt === 'string' ? data.lastLoginAt : '-'),
                createdAt: data.createdAt?.toDate?.()?.toISOString() ||
                    (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
                isShopStaff: data.isShopStaff || false,
                isBanned: data.isBanned || false,
            };
        });
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}

export default async function UsersPage() {
    const users = await getUsers();

    return <UsersClient initialUsers={users} />;
}
