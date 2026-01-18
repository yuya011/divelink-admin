import { NextResponse } from 'next/server';
import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';

export async function POST() {
    try {
        const { db } = getFirebaseAdmin();

        // ダミーショップ申請
        const shopApplications = [
            {
                userId: 'user_shop_001',
                userName: '田中 ショップ',
                userEmail: 'tanaka.shop@example.com',
                shopName: 'オーシャンダイブ沖縄',
                address: '沖縄県那覇市1-2-3',
                region: '沖縄',
                description: '沖縄本島を中心にガイドを行っています。初心者歓迎！',
                status: 'pending',
                createdAt: new Date(),
            },
            {
                userId: 'user_shop_002',
                userName: '佐藤 海人',
                userEmail: 'kaito.sato@example.com',
                shopName: '伊豆ダイビングセンター',
                address: '静岡県伊東市4-5-6',
                region: '伊豆',
                description: '伊豆の海を知り尽くしたガイドがご案内します。',
                status: 'pending',
                createdAt: new Date(Date.now() - 86400000), // 1日前
            }
        ];

        // ダミーレポート
        const reports = [
            {
                reporterId: 'user_003',
                reporterName: '高橋 ユーザー',
                reportedUserId: 'user_bad_001',
                reportedUserName: '迷惑 太郎',
                reason: 'spam',
                details: '無関係な広告を大量に投稿しています。',
                status: 'pending',
                createdAt: new Date(),
            },
            {
                reporterId: 'user_004',
                reporterName: '鈴木 ダイバー',
                reportedUserId: 'user_fake_001',
                reportedUserName: '偽物 花子',
                reason: 'impersonation',
                details: '有名人の写真を無断使用しています。',
                status: 'reviewed',
                createdAt: new Date(Date.now() - 172800000), // 2日前
            }
        ];

        // ダミーサポートチケット
        const tickets = [
            {
                userId: 'user_005',
                userName: '山田 困った',
                userEmail: 'yamada.help@example.com',
                subject: 'ログインできません',
                category: 'account',
                priority: 'high',
                content: 'パスワードをリセットしてもログインできません。至急対応お願いします。',
                status: 'open',
                createdAt: new Date(),
            },
            {
                userId: 'user_shop_001',
                userName: '田中 ショップ',
                userEmail: 'tanaka.shop@example.com',
                subject: 'ショップ情報の変更について',
                category: 'shop',
                priority: 'medium',
                content: '住所が変わったので変更したいのですが、どこからできますか？',
                status: 'replied',
                replies: [
                    {
                        content: 'お問い合わせありがとうございます。ショップ情報の変更はマイページの設定から行えます。',
                        createdAt: new Date(),
                        isAdmin: true,
                    }
                ],
                lastReplyAt: new Date(),
                createdAt: new Date(Date.now() - 86400000),
            }
        ];

        // データの投入
        const batch = db.batch();

        shopApplications.forEach(data => {
            const ref = db.collection(COLLECTIONS.SHOP_APPLICATIONS).doc();
            batch.set(ref, data);
        });

        reports.forEach(data => {
            const ref = db.collection(COLLECTIONS.REPORTS).doc();
            batch.set(ref, data);
        });

        tickets.forEach(data => {
            const ref = db.collection(COLLECTIONS.SUPPORT_TICKETS).doc();
            batch.set(ref, data);
        });

        await batch.commit();

        return NextResponse.json({ success: true, message: 'Seed data created successfully' });
    } catch (error) {
        console.error('Failed to seed data:', error);
        return NextResponse.json(
            { error: 'Failed to seed data' },
            { status: 500 }
        );
    }
}
