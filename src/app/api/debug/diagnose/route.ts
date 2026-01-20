import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    const report: any = {
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasProjectId: !!process.env.FB_PROJECT_ID,
            hasClientEmail: !!process.env.FB_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.FB_PRIVATE_KEY,
            privateKeyLength: process.env.FB_PRIVATE_KEY?.length || 0,
        },
        firebase: null,
        error: null,
    };

    try {
        const { app, db, messaging } = getFirebaseAdmin();
        report.firebase = {
            initialized: true,
            appName: app.name,
            messagingAvailable: !!messaging,
            dbAvailable: !!db,
        };

        // Connectivity Check
        try {
            await db.collection('notifications_log').limit(1).get();
            report.firebase.dbConnection = 'success';
        } catch (dbError: any) {
            report.firebase.dbConnection = `failed: ${dbError.message}`;
        }

    } catch (e: any) {
        report.error = {
            message: e.message,
            stack: e.stack,
            name: e.name
        };
    }

    return NextResponse.json(report);
}
