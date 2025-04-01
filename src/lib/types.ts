
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer" | "siteManager" | "worker";
  createdAt: string;
  companyName?: string;
  logo?: string;
  phone?: string;
  address?: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  customerId: string;
  managerId?: string;
  createdAt: string;
}

export interface Block {
  id: string;
  name: string;
  siteId: string;
  acres?: number;
  rows?: number;
  vines?: number;
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  siteId: string;
  blockId: string;
  address: string;
  startDate: string;
  endDate: string;
  workType: "pruning" | "shootThinning" | "other";
  neededWorkers: number;
  expectedHours: number;
  payRate: number;
  acres?: number;
  rows?: number;
  vines?: number;
  vinesPerRow?: number;
  notes?: string;
  status: "draft" | "published" | "inProgress" | "completed" | "cancelled";
  createdAt: string;
  createdBy: string;
}

export interface WorkerApplication {
  id: string;
  workerId: string;
  workerName: string;
  orderrId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface WorkerTask {
  id: string;
  workerId: string;
  workerName: string;
  orderId: string;
  imageUrl: string;
  completedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface PaymentCalculation {
  workerId: string;
  workerName: string;
  taskCount: number;
  totalAmount: number;
}
