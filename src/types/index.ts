// TypeScript型定義
import { Timestamp } from 'firebase-admin/firestore';

// 管理者
export interface Admin {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

// ユーザー
export interface User {
  uid: string;
  email: string;
  name: string;
  rank?: string;
  organization?: string;
  isShopStaff?: boolean;
  isBanned?: boolean;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// ショップ申請
export interface ShopApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  shopName: string;
  address: string;
  region: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
}

// 報告
export interface Report {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedPostId?: string;
  reason: 'spam' | 'impersonation' | 'harassment' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  action?: 'warning' | 'delete_content' | 'ban_user' | 'dismissed';
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  notes?: string;
}

// サポートチケット
export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  messages: SupportMessage[];
}

export interface SupportMessage {
  senderId: string;
  senderType: 'user' | 'admin';
  message: string;
  timestamp: Timestamp;
}

// 通知
export interface Notification {
  id: string;
  title: string;
  body: string;
  target: 'all' | 'segment';
  segmentFilters?: {
    rank?: string[];
    region?: string[];
  };
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Timestamp;
  sentAt?: Timestamp;
  createdBy: string;
  createdAt: Timestamp;
  openRate?: number;
  recipientCount?: number;
}

// 監査ログ
export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'shop' | 'report' | 'notification' | 'system';
  targetId?: string;
  details?: string;
  timestamp: Timestamp;
}

// ダッシュボード統計
export interface DashboardStats {
  activeUsersDaily: number;
  activeUsersWeekly: number;
  activeUsersMonthly: number;
  newUsersLast7Days: number;
  totalLogs: number;
  logsToday: number;
  totalShops: number;
  pendingShopApplications: number;
  pendingReports: number;
  openSupportTickets: number;
}

// チャートデータ
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface UserGrowthData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}
