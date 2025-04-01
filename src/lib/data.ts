
import { User, Site, Block, WorkOrder, WorkerApplication, WorkerTask } from './types';

// Mock Users
export const users: User[] = [
  {
    id: "u1",
    email: "admin@agworks.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "u2",
    email: "customer@vineyard.com",
    name: "Vineyard Owner",
    role: "customer",
    companyName: "Golden Valley Vineyards",
    logo: "/customer-logo-1.png",
    phone: "555-123-4567",
    address: "1234 Vine St, Napa, CA 94558",
    createdAt: "2023-01-02T00:00:00Z"
  },
  {
    id: "u3",
    email: "manager@vineyard.com",
    name: "Site Manager",
    role: "siteManager",
    phone: "555-987-6543",
    createdAt: "2023-01-03T00:00:00Z"
  },
  {
    id: "u4",
    email: "worker1@example.com",
    name: "John Worker",
    role: "worker",
    phone: "555-222-3333",
    createdAt: "2023-01-04T00:00:00Z"
  },
  {
    id: "u5",
    email: "worker2@example.com",
    name: "Jane Worker",
    role: "worker",
    phone: "555-444-5555",
    createdAt: "2023-01-05T00:00:00Z"
  }
];

// Mock Sites
export const sites: Site[] = [
  {
    id: "s1",
    name: "North Hill Vineyard",
    address: "1234 Vine St, Napa, CA 94558",
    customerId: "u2",
    managerId: "u3",
    createdAt: "2023-02-01T00:00:00Z"
  },
  {
    id: "s2",
    name: "South Valley Estate",
    address: "5678 Grape Rd, Sonoma, CA 95476",
    customerId: "u2",
    createdAt: "2023-02-02T00:00:00Z"
  }
];

// Mock Blocks
export const blocks: Block[] = [
  {
    id: "b1",
    name: "Block A - Cabernet",
    siteId: "s1",
    acres: 5.2,
    rows: 52,
    vines: 2080,
    createdAt: "2023-03-01T00:00:00Z"
  },
  {
    id: "b2",
    name: "Block B - Merlot",
    siteId: "s1",
    acres: 3.8,
    rows: 38,
    vines: 1520,
    createdAt: "2023-03-02T00:00:00Z"
  },
  {
    id: "b3",
    name: "Block C - Chardonnay",
    siteId: "s2",
    acres: 4.5,
    rows: 45,
    vines: 1800,
    createdAt: "2023-03-03T00:00:00Z"
  }
];

// Mock Work Orders
export const workOrders: WorkOrder[] = [
  {
    id: "wo1",
    siteId: "s1",
    blockId: "b1",
    address: "1234 Vine St, Napa, CA 94558",
    startDate: "2023-06-01T08:00:00Z",
    endDate: "2023-06-03T17:00:00Z",
    workType: "pruning",
    neededWorkers: 5,
    expectedHours: 24,
    payRate: 0.75,
    acres: 5.2,
    rows: 52,
    vines: 2080,
    vinesPerRow: 40,
    notes: "Focus on southern exposure rows first",
    status: "completed",
    createdAt: "2023-05-20T00:00:00Z",
    createdBy: "u3"
  },
  {
    id: "wo2",
    siteId: "s1",
    blockId: "b2",
    address: "1234 Vine St, Napa, CA 94558",
    startDate: "2023-06-05T08:00:00Z",
    endDate: "2023-06-07T17:00:00Z",
    workType: "shootThinning",
    neededWorkers: 4,
    expectedHours: 18,
    payRate: 0.65,
    acres: 3.8,
    rows: 38,
    vines: 1520,
    vinesPerRow: 40,
    status: "inProgress",
    createdAt: "2023-05-25T00:00:00Z",
    createdBy: "u3"
  }
];

// Mock Worker Applications
export const workerApplications: WorkerApplication[] = [
  {
    id: "wa1",
    workerId: "u4",
    workerName: "John Worker",
    orderrId: "wo2",
    status: "approved",
    createdAt: "2023-05-26T00:00:00Z"
  },
  {
    id: "wa2",
    workerId: "u5",
    workerName: "Jane Worker",
    orderrId: "wo2",
    status: "approved",
    createdAt: "2023-05-27T00:00:00Z"
  }
];

// Mock Worker Tasks
export const workerTasks: WorkerTask[] = [
  {
    id: "wt1",
    workerId: "u4",
    workerName: "John Worker",
    orderId: "wo1",
    imageUrl: "/task-image-1.jpg",
    completedAt: "2023-06-01T10:15:00Z",
    status: "approved"
  },
  {
    id: "wt2",
    workerId: "u4",
    workerName: "John Worker",
    orderId: "wo1",
    imageUrl: "/task-image-2.jpg",
    completedAt: "2023-06-01T11:30:00Z",
    status: "approved"
  },
  {
    id: "wt3",
    workerId: "u5",
    workerName: "Jane Worker",
    orderId: "wo1",
    imageUrl: "/task-image-3.jpg",
    completedAt: "2023-06-01T10:45:00Z",
    status: "approved"
  },
  {
    id: "wt4",
    workerId: "u5",
    workerName: "Jane Worker",
    orderId: "wo1", 
    imageUrl: "/task-image-4.jpg",
    completedAt: "2023-06-01T12:15:00Z",
    status: "approved"
  }
];

// Get payment calculations
export const getPaymentCalculations = (orderId: string): PaymentCalculation[] => {
  const tasks = workerTasks.filter(task => task.orderId === orderId && task.status === "approved");
  const order = workOrders.find(order => order.id === orderId);
  
  if (!order) return [];
  
  const workerIds = [...new Set(tasks.map(task => task.workerId))];
  
  return workerIds.map(workerId => {
    const workerTasks = tasks.filter(task => task.workerId === workerId);
    const worker = users.find(user => user.id === workerId);
    
    return {
      workerId,
      workerName: worker?.name || "Unknown Worker",
      taskCount: workerTasks.length,
      totalAmount: workerTasks.length * order.payRate
    };
  });
};
