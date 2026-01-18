import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';
import ShopsClient, { ShopApplication } from './ShopsClient';

async function getShopApplications(): Promise<ShopApplication[]> {
    try {
        const { db } = getFirebaseAdmin();
        const snapshot = await db.collection(COLLECTIONS.SHOP_APPLICATIONS)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId || '',
                userName: data.userName || '',
                userEmail: data.userEmail || '',
                shopName: data.shopName || '',
                address: data.address || '',
                region: data.region || '',
                description: data.description || '',
                status: data.status || 'pending',
                // Firestore Timestamp to string
                createdAt: data.createdAt?.toDate?.()?.toISOString() ||
                    (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
            };
        });
    } catch (error) {
        console.error('Failed to fetch shop applications:', error);
        return [];
    }
}

export default async function ShopsPage() {
    const applications = await getShopApplications();

    return <ShopsClient initialApplications={applications} />;
}
