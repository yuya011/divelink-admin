# DiveLink 管理者ダッシュボード 実装計画書

本ドキュメントは、DiveLinkアプリケーションの管理者向けWebダッシュボードの実装計画を記載したものです。
AIエディターがこの計画書を元にコードを実装します。

---

## 1. プロジェクト概要

### 目的
DiveLinkアプリの運営チームが、ユーザー管理、コンテンツ監視、統計分析、サポート対応を効率的に行うためのWeb管理画面を構築する。

### 技術スタック
| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| 認証 | Firebase Admin SDK |
| データベース | Firebase Firestore (本番環境と同一) |
| ホスティング | Vercel または Firebase Hosting |
| 通知 | Firebase Cloud Messaging (FCM) |

### Firebase接続
既存のDiveLinkプロジェクト（`divelink02`）のFirebaseに接続します。
- 環境変数で `FIREBASE_SERVICE_ACCOUNT_KEY` を設定
- Admin SDK経由でのアクセス（クライアントSDKではない）

---

## 2. 機能一覧

### 2.1 ダッシュボード (トップページ)
アプリ全体の健全性を一目で把握できるサマリー画面。

| 指標 | 説明 |
|------|------|
| アクティブユーザー数 | 日/週/月単位 |
| 新規登録数 | 過去7日間 |
| ログ作成数 | 日/週/月トレンド |
| ショップ登録数 | 合計・承認待ち |
| 未対応報告数 | 赤バッジ表示 |

**チャート**:
- ユーザー成長グラフ（折れ線）
- ログ投稿数推移（棒グラフ）
- 地域別アクティビティ（ヒートマップ or 棒グラフ）

---

### 2.2 統計・分析 (`/analytics`)
詳細なデータ分析画面。

#### 2.2.1 ユーザー分析
- 登録ユーザー総数
- アクティブユーザー率
- ランク別分布（OWD, AOW, REDなど）
- 所属団体別分布（PADI, NAUI, SSIなど）
- AI分析機能の有効化率

#### 2.2.2 コンテンツ分析
- ダイブログ総数
- 月別・週別ログ作成数
- 人気ポイントランキング
- 平均ダイブ深度/時間

#### 2.2.3 ショップ分析
- 登録ショップ数
- ショップごとの投稿数/人気度
- 地域分布

---

### 2.3 通知配信 (`/notifications`)
プッシュ通知とアプリ内お知らせを管理。

#### 機能
- **全体通知**: 全ユーザーへ一斉送信
- **セグメント通知**: 条件（ランク、地域、アクティビティ等）で絞り込み
- **スケジュール配信**: 日時指定
- **通知履歴**: 過去の通知一覧と開封率

#### UI
```
[新しい通知を作成]
┌──────────────────────────────────────┐
│ タイトル: [                        ] │
│ 本文:     [                        ] │
│ 対象:     ◯全員 ◯セグメント        │
│ 配信日時: [即時/スケジュール]        │
│                        [送信] [下書き保存] │
└──────────────────────────────────────┘
```

---

### 2.4 ショップ管理 (`/shops`)
ショップアカウントの承認・管理。

#### ショップ申請承認ワークフロー
1. ユーザーがアプリからショップ登録を申請
2. Firestoreの `shop_applications` コレクションに保存
3. 管理画面で申請一覧を表示
4. 管理者が内容を確認し、「承認」または「却下」
5. 承認後、ユーザーの `isShopStaff` フラグを `true` に更新

#### 表示項目
- 申請者名
- ショップ名
- 住所/地域
- 申請日時
- ステータス（保留中/承認/却下）

#### アクション
- [詳細を見る] - 申請内容の詳細表示
- [承認] - ショップとして登録
- [却下] - 理由を記載して却下

---

### 2.5 報告対応 (`/reports`)
ユーザーからの問題報告を管理。

#### 報告種類
- スパム/不適切コンテンツ
- なりすまし
- ハラスメント
- その他

#### Firestoreコレクション: `reports`
```typescript
interface Report {
  id: string;
  reporterId: string;        // 報告者
  reportedUserId?: string;   // 報告対象ユーザー
  reportedPostId?: string;   // 報告対象投稿
  reason: string;            // 報告理由
  details: string;           // 詳細
  status: 'pending' | 'reviewed' | 'resolved';
  action?: 'warning' | 'delete_content' | 'ban_user' | 'dismissed';
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;       // 対応した管理者ID
  notes?: string;            // 管理者メモ
}
```

#### 対応アクション
- **内容を確認**: 報告対象のコンテンツを表示
- **警告を送信**: ユーザーに警告メッセージを送信
- **コンテンツ削除**: 投稿を非表示/削除
- **アカウント停止**: ユーザーを一時停止またはBAN
- **却下**: 報告を無効と判断

---

### 2.6 サポート (`/support`)
ユーザーとの連絡手段を管理。

#### 機能
- **お問い合わせ一覧**: Firestoreの `support_tickets` を表示
- **チケット詳細**: 問い合わせ内容と対応履歴
- **返信機能**: 管理者からユーザーへの返信（アプリ内通知 or メール）
- **ステータス管理**: 未対応/対応中/解決済み

#### Firestoreコレクション: `support_tickets`
```typescript
interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  messages: {
    senderId: string;
    senderType: 'user' | 'admin';
    message: string;
    timestamp: Timestamp;
  }[];
}
```

---

### 2.7 ユーザー管理 (`/users`)
全ユーザーの検索・管理。

#### 機能
- **ユーザー検索**: 名前、メール、UIDで検索
- **ユーザー詳細**: プロフィール情報の閲覧
- **アカウント操作**:
  - 警告を送信
  - アカウントの一時停止
  - アカウントの永久BAN
  - 管理者権限の付与/剥奪

---

### 2.8 システム設定 (`/settings`)

#### 機能
- **管理者アカウント**: 他の管理者の追加/権限管理
- **監査ログ**: 管理者の操作履歴
- **Firebaseルール確認**: 現在のセキュリティルールを表示
- **メンテナンスモード**: アプリを一時停止状態にする

---

## 3. 認証・権限

### 管理者認証フロー
1. 管理者はメール/パスワードでログイン
2. Firestoreの `admins` コレクションで権限を確認
3. 権限がない場合はアクセス拒否

### Firestoreコレクション: `admins`
```typescript
interface Admin {
  uid: string;           // Firebase Auth UID
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

### 権限レベル
| ロール | 権限 |
|--------|------|
| super_admin | 全機能アクセス + 管理者追加/削除 |
| admin | 全機能アクセス |
| moderator | 報告対応・サポートのみ |

---

## 4. ディレクトリ構造

```
admin/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local.example
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # ダッシュボード
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── shops/
│   │   │   ├── page.tsx           # 一覧
│   │   │   └── [id]/page.tsx      # 詳細
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── support/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   └── Charts.tsx
│   │   ├── notifications/
│   │   │   └── NotificationForm.tsx
│   │   └── ui/                    # shadcn/ui コンポーネント
│   ├── lib/
│   │   ├── firebase-admin.ts      # Admin SDK初期化
│   │   ├── auth.ts                # 認証ヘルパー
│   │   └── utils.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   └── types/
│       └── index.ts               # TypeScript型定義
└── README.md
```

---

## 5. Firestoreコレクション追加

管理機能を実現するために、以下のコレクションを追加。

| コレクション | 用途 |
|-------------|------|
| `admins` | 管理者アカウント |
| `shop_applications` | ショップ申請 |
| `reports` | ユーザー報告 |
| `support_tickets` | お問い合わせ |
| `notifications_log` | 通知履歴 |
| `admin_audit_log` | 管理者操作ログ |

---

## 6. セキュリティ考慮事項

1. **Admin SDK使用**: クライアントSDKではなくサーバーサイドでAdmin SDKを使用
2. **環境変数**: サービスアカウントキーは環境変数で管理（絶対にコミットしない）
3. **IP制限**: 可能であればCloudflare Access等でIPホワイトリスト
4. **監査ログ**: 全ての管理者操作を記録
5. **2FA推奨**: 管理者アカウントには2要素認証を推奨

---

## 7. 実装優先順位

### Phase 1 (MVP)
1. 認証・ログイン機能
2. ダッシュボード（基本統計）
3. ショップ承認機能
4. 報告対応機能

### Phase 2
5. 通知配信機能
6. サポートチケット機能
7. ユーザー管理機能

### Phase 3
8. 詳細分析・チャート
9. 監査ログ
10. システム設定

---

## 8. 環境変数 (.env.local)

```
# Firebase Admin SDK
FIREBASE_PROJECT_ID=divelink-xxxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@divelink-xxxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Next.js
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## 9. 次のステップ

AIエディターは以下の順序で実装を進めてください：

1. `npx create-next-app@latest ./` でプロジェクト初期化（TypeScript, Tailwind CSS, App Router）
2. `firebase-admin` パッケージのインストール
3. `shadcn/ui` の初期化
4. 認証・AuthGuardの実装
5. Sidebar + Headerレイアウトの実装
6. 各ページの実装（Phase 1から順に）

---

**ドキュメント作成日**: 2026-01-18
**作成者**: Antigravity AI Assistant
