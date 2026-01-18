import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = {
        hasFbProjectId: !!process.env.FB_PROJECT_ID,
        hasFbClientEmail: !!process.env.FB_CLIENT_EMAIL,
        hasFbPrivateKey: !!process.env.FB_PRIVATE_KEY,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        fbProjectIdValue: process.env.FB_PROJECT_ID, // Project IDは公開しても比較的安全
        nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json(envVars);
}
