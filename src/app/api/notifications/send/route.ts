import { NextResponse } from 'next/server';
import { getFirebaseAdmin, COLLECTIONS } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, body: messageBody, target, segment, scheduleType, scheduledAt } = body;

        // バリデーション
        if (!title || !messageBody) {
            return NextResponse.json(
                { error: 'Title and body are required' },
                { status: 400 }
            );
        }

        const { messaging, db } = getFirebaseAdmin();

        // ログ保存用のデータ
        const notificationData = {
            title,
            body: messageBody,
            target,
            segment: target === 'segment' ? segment : null,
            status: scheduleType === 'scheduled' ? 'scheduled' : 'sent',
            scheduledAt: scheduleType === 'scheduled' && scheduledAt ? new Date(scheduledAt) : null,
            sentAt: scheduleType === 'now' ? new Date() : null,
            createdAt: new Date(),
            createdBy: 'admin', // 将来的にはAdminのIDを入れる
        };

        // Firestoreに履歴保存
        const docRef = await db.collection(COLLECTIONS.NOTIFICATIONS_LOG).add(notificationData);

        // 即時配信の場合のみFCM送信
        if (scheduleType === 'now') {
            let condition = "'all_users' in topics";

            // セグメント指定の場合のTopic条件組み立て（簡易実装）
            // 実際にはアプリ側で適切なTopic購読が必要
            if (target === 'segment' && segment) {
                // 例: rank_owd, region_okinawa など
                // ここではシンプルに segment オブジェクトから条件を作る
                const topics: string[] = [];
                if (segment.rank) topics.push(`'rank_${segment.rank}' in topics`);
                if (segment.region) topics.push(`'region_${segment.region}' in topics`);

                if (topics.length > 0) {
                    condition = topics.join(' && ');
                }
            }

            // Note: Admin SDKでのcondition送信は send() メソッドを使用
            // topic送信の場合は send({ topic: '...' })

            // 今回はシンプルに 'all_users' トピックへの送信とする（セグメントは未実装として扱うか、Topic設計が必要）
            // 実装簡略化のため、target='all'ならtopic='all_users'へ送信

            const messagePayload: any = {
                notification: {
                    title,
                    body: messageBody,
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    notificationId: docRef.id,
                }
            };

            if (target === 'all') {
                messagePayload.topic = 'all_users';
            } else {
                // セグメント配信は条件指定
                messagePayload.condition = condition;
            }

            try {
                const response = await messaging.send(messagePayload);
                console.log('Successfully sent message:', response);

                // 成功したらログを更新（messageIdなど）
                await docRef.update({
                    messageId: response,
                    status: 'sent', // 念のため
                });
            } catch (fcmError: any) {
                console.error('Error sending FCM message:', fcmError);
                await docRef.update({
                    status: 'failed',
                    error: fcmError instanceof Error ? fcmError.message : 'Unknown error',
                });

                return NextResponse.json(
                    {
                        error: 'Failed to send notification via FCM',
                        details: fcmError.message || 'Unknown FCM error',
                        code: fcmError.code
                    },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ success: true, id: docRef.id });

    } catch (error: any) {
        console.error('Failed to process notification:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                details: error.message
            },
            { status: 500 }
        );
    }
}
