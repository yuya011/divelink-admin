// 管理者を追加するスクリプト
const admin = require('firebase-admin');

// 環境変数から認証情報を読み込み
require('dotenv').config({ path: '.env.local' });

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function addAdmin() {
    const uid = 'hlk1OdpUVWOMa1oD453XozK4jUx2';

    try {
        // Firebase Authからユーザー情報を取得
        const userRecord = await admin.auth().getUser(uid);
        console.log('ユーザー情報:', userRecord.email);

        // adminsコレクションに追加
        await db.collection('admins').doc(uid).set({
            email: userRecord.email,
            role: 'super_admin',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log('✓ 管理者を追加しました:', userRecord.email);
        console.log('  UID:', uid);
        console.log('  Role: super_admin');

    } catch (error) {
        console.error('エラー:', error.message);
    }

    process.exit(0);
}

addAdmin();
