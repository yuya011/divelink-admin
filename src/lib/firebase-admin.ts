import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

let app: App | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let messaging: Messaging | undefined;

function getFirebaseApp(): App {
    if (app) return app;

    const apps = getApps();
    if (apps.length > 0) {
        app = apps[0];
        return app;
    }

    const projectId = process.env.FB_PROJECT_ID;
    const clientEmail = process.env.FB_CLIENT_EMAIL;
    // 秘密鍵の改行コード処理を改善
    let privateKey = process.env.FB_PRIVATE_KEY;

    if (privateKey) {
        // Base64エンコードされているかチェック（-----BEGINで始まらない、かつ改行がない場合など）
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            try {
                const decoded = Buffer.from(privateKey, 'base64').toString('utf-8');
                if (decoded.includes('-----BEGIN PRIVATE KEY-----')) {
                    privateKey = decoded;
                }
            } catch (e) {
                console.warn('Failed to decode private key as base64', e);
            }
        }

        // ダブルクォートで囲まれている場合を考慮
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
        // リテラルな \n を実際の改行に変換
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!projectId || !clientEmail || !privateKey) {
        console.error('Firebase Credentials Error:', {
            hasProjectId: !!projectId,
            hasClientEmail: !!clientEmail,
            hasPrivateKey: !!privateKey
        });
        throw new Error(
            'Missing Firebase credentials. Please check environment variables.'
        );
    }

    try {
        app = initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log('Firebase Admin Initialized successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
        throw error;
    }

    return app;
}

export function getFirestoreAdmin(): Firestore {
    if (db) return db;
    getFirebaseApp();
    db = getFirestore();
    return db;
}

export function getAuthAdmin(): Auth {
    if (auth) return auth;
    getFirebaseApp();
    auth = getAuth();
    return auth;
}

export function getMessagingAdmin(): Messaging {
    if (messaging) return messaging;
    getFirebaseApp();
    messaging = getMessaging();
    return messaging;
}

// コレクション名定数
export const COLLECTIONS = {
    USERS: 'users',
    ADMINS: 'admins',
    SHOP_APPLICATIONS: 'shop_applications',
    REPORTS: 'reports',
    SUPPORT_TICKETS: 'support_tickets',
    NOTIFICATIONS_LOG: 'notifications_log',
    ADMIN_AUDIT_LOG: 'admin_audit_log',
    DIVE_LOGS: 'diveLogs',
    SHOPS: 'shops',
} as const;
