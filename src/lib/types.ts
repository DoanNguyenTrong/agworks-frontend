// Site Manager type
export interface SiteManager {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  customerId: string;
  profileImage: string | null;
  createdAt: string;
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'siteManager' | 'worker';
  createdAt: string;
  companyName?: string;
  phone?: string;
  address?: string;
  logo?: string;
  profileImage?: string;
  customerId?: string; // Added this property for site managers
}

// Site type
export interface Site {
  id: string;
  name: string;
  address: string;
  customerId: string;
  managerId?: string;
  createdAt: string;
}

// Block type
export interface Block {
  id: string;
  name: string;
  siteId: string;
  acres?: number;
  rows?: number;
  vines?: number;
  vinesPerRow?: number;
  createdAt: string;
}

// Work Order type
export interface WorkOrder {
  id: string;
  siteId: string;
  blockId: string;
  address: string;
  startDate: string;
  endDate: string;
  workType: 'pruning' | 'shootThinning' | 'other';
  neededWorkers: number;
  expectedHours: number;
  payRate: number;
  acres?: number;
  rows?: number;
  vines?: number;
  vinesPerRow?: number;
  notes?: string;
  status: 'draft' | 'published' | 'inProgress' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
}

// Worker Application type
export interface WorkerApplication {
  id: string;
  workerId: string;
  workerName: string;
  orderId: string; // Fixed typo from orderrId to orderId
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Worker Task type
export interface WorkerTask {
  id: string;
  workerId: string;
  workerName: string;
  orderId: string;
  photoUrls: string[];
  imageUrl: string;
  completedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// User Settings type
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Settings type
export interface AdminSettings {
  general: {
    systemName: string;
    supportEmail: string;
    logoUrl: string;
    enablePublicRegistration: boolean;
    enableWorkerSelfRegistration: boolean;
  };
  email: {
    smtpServer: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    senderEmail: string;
    senderName: string;
  };
  security: {
    twoFactorAuth: boolean;
    passwordExpiration: boolean;
    accountLockout: boolean;
  };
  integrations: Record<string, any>;
}
