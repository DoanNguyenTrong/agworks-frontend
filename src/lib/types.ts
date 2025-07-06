// Site Manager type
export interface SiteManager {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  customerId: string;
  profileImage: string | null;
  createdAt: string;
}

// User type
export interface User {
  _id: string;
  email: string;
  name: string;
  role: string
  createdAt: string;
  companyName?: string;
  phone?: string;
  address?: string;
  logo?: string;
  profileImage?: string;
  customerId?: string;
  siteId?: string;
  organizationId?: string;
}

// Work Type interface for vineyard work orders management
export interface WorkType {
  _id?: string;
  name: string;
  description: string;
  category: 'pruning' | 'maintenance' | 'harvest' | 'planting' | 'spraying' | 'cultivation';
  paymentType: 'per_task' | 'per_hour' | 'per_acre' | 'per_vine';
  baseRate: number; // Base rate for the payment type
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'year_round';
  skillLevel: 'entry' | 'intermediate' | 'expert';
  equipment: string[];
  createdBy: string; // Customer ID
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Site type
export interface Site {
  _id: string;
  name: string;
  address: string;
  locationType: string;
  description: string;
  customerId: string;
  managerId?: string;
  userIds?: Array<User>;
  createdAt: string;
  organizationId?: string;
}

// Block type
export interface Block {
  _id: string;
  name: string;
  siteId?: Site;
  acres?: number;
  rows?: number;
  vines?: number;
  vinesPerRow?: number;
  createdAt: string;
}

// Work Order type
export interface WorkOrder {
  _id: string;
  ID: string;
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
  status: 'Draft' | 'New' | 'InProgress' | 'Completed' | 'Cancelled';
  createdAt: string;
  createdBy: string;
}

// Worker Application type
export interface WorkerApplication {
  _id: string;
  workerId: string;
  workerName: string;
  orderId: string; // Fixed typo from orderrId to orderId
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Worker Task type
export interface WorkerTask {
  _id: string;
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
