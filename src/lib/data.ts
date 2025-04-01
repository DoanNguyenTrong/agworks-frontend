
import { User, Site, Block, WorkOrder, WorkerApplication, WorkerTask, PaymentCalculation } from './types';

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
  },
  // Additional mock users
  {
    id: "u6",
    email: "customer2@winery.com",
    name: "Robert Harris",
    role: "customer",
    companyName: "Sunstone Winery",
    logo: "/customer-logo-2.png",
    phone: "555-777-8888",
    address: "789 Oak Hill Rd, Sonoma, CA 95476",
    createdAt: "2023-01-10T00:00:00Z"
  },
  {
    id: "u7",
    email: "customer3@vineyard.com",
    name: "Sarah Miller",
    role: "customer",
    companyName: "Blue Ridge Vineyards",
    logo: "/customer-logo-3.png",
    phone: "555-999-0000",
    address: "456 Mountain View Dr, Napa, CA 94559",
    createdAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "u8",
    email: "manager2@winery.com",
    name: "David Chen",
    role: "siteManager",
    phone: "555-111-2222",
    createdAt: "2023-01-20T00:00:00Z"
  },
  {
    id: "u9",
    email: "manager3@vineyard.com",
    name: "Maria Rodriguez",
    role: "siteManager",
    phone: "555-333-4444",
    createdAt: "2023-01-25T00:00:00Z"
  },
  {
    id: "u10",
    email: "worker3@example.com",
    name: "Michael Johnson",
    role: "worker",
    phone: "555-555-6666",
    createdAt: "2023-02-01T00:00:00Z"
  },
  {
    id: "u11",
    email: "worker4@example.com",
    name: "Emily Williams",
    role: "worker",
    phone: "555-666-7777",
    createdAt: "2023-02-05T00:00:00Z"
  },
  {
    id: "u12",
    email: "worker5@example.com",
    name: "Carlos Sanchez",
    role: "worker",
    phone: "555-777-9999",
    createdAt: "2023-02-10T00:00:00Z"
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
  },
  // Additional mock sites
  {
    id: "s3",
    name: "Eastside Terraces",
    address: "910 Ridge Rd, Napa, CA 94558",
    customerId: "u2",
    managerId: "u9",
    createdAt: "2023-02-05T00:00:00Z"
  },
  {
    id: "s4",
    name: "Oakhill Vineyards",
    address: "123 Oak St, Sonoma, CA 95476",
    customerId: "u6",
    managerId: "u8",
    createdAt: "2023-02-10T00:00:00Z"
  },
  {
    id: "s5",
    name: "Ridgeline Estate",
    address: "456 Ridge Way, Sonoma, CA 95476",
    customerId: "u6",
    createdAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "s6",
    name: "Mountain View Vineyard",
    address: "789 Mountain Rd, Napa, CA 94559",
    customerId: "u7",
    managerId: "u9",
    createdAt: "2023-02-20T00:00:00Z"
  },
  {
    id: "s7",
    name: "Sunstone West",
    address: "321 Sunset Dr, Sonoma, CA 95476",
    customerId: "u7",
    createdAt: "2023-02-25T00:00:00Z"
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
  },
  // Additional mock blocks
  {
    id: "b4",
    name: "Block D - Pinot Noir",
    siteId: "s2",
    acres: 6.1,
    rows: 61,
    vines: 2440,
    createdAt: "2023-03-05T00:00:00Z"
  },
  {
    id: "b5",
    name: "Block E - Syrah",
    siteId: "s3",
    acres: 3.5,
    rows: 35,
    vines: 1400,
    createdAt: "2023-03-10T00:00:00Z"
  },
  {
    id: "b6",
    name: "Block F - Zinfandel",
    siteId: "s3",
    acres: 4.0,
    rows: 40,
    vines: 1600,
    createdAt: "2023-03-15T00:00:00Z"
  },
  {
    id: "b7",
    name: "Block G - Sauvignon Blanc",
    siteId: "s4",
    acres: 5.0,
    rows: 50,
    vines: 2000,
    createdAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "b8",
    name: "Block H - Cabernet Franc",
    siteId: "s5",
    acres: 4.2,
    rows: 42,
    vines: 1680,
    createdAt: "2023-03-25T00:00:00Z"
  },
  {
    id: "b9",
    name: "Block I - Malbec",
    siteId: "s6",
    acres: 3.0,
    rows: 30,
    vines: 1200,
    createdAt: "2023-04-01T00:00:00Z"
  },
  {
    id: "b10",
    name: "Block J - Petit Verdot",
    siteId: "s7",
    acres: 2.5,
    rows: 25,
    vines: 1000,
    createdAt: "2023-04-05T00:00:00Z"
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
    endDate: "2023-06-01T17:00:00Z",
    workType: "pruning",
    neededWorkers: 5,
    expectedHours: 8,
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
    endDate: "2023-06-05T17:00:00Z",
    workType: "shootThinning",
    neededWorkers: 4,
    expectedHours: 8,
    payRate: 0.65,
    acres: 3.8,
    rows: 38,
    vines: 1520,
    vinesPerRow: 40,
    status: "inProgress",
    createdAt: "2023-05-25T00:00:00Z",
    createdBy: "u3"
  },
  // Additional mock work orders
  {
    id: "wo3",
    siteId: "s2",
    blockId: "b3",
    address: "5678 Grape Rd, Sonoma, CA 95476",
    startDate: "2023-06-10T08:00:00Z",
    endDate: "2023-06-10T17:00:00Z",
    workType: "pruning",
    neededWorkers: 5,
    expectedHours: 8,
    payRate: 0.70,
    acres: 4.5,
    rows: 45,
    vines: 1800,
    vinesPerRow: 40,
    status: "published",
    createdAt: "2023-06-01T00:00:00Z",
    createdBy: "u8"
  },
  {
    id: "wo4",
    siteId: "s3",
    blockId: "b5",
    address: "910 Ridge Rd, Napa, CA 94558",
    startDate: "2023-06-15T09:00:00Z",
    endDate: "2023-06-15T18:00:00Z",
    workType: "other",
    neededWorkers: 6,
    expectedHours: 8,
    payRate: 0.85,
    acres: 3.5,
    rows: 35,
    vines: 1400,
    vinesPerRow: 40,
    notes: "Leaf removal for improved airflow",
    status: "published",
    createdAt: "2023-06-05T00:00:00Z",
    createdBy: "u9"
  },
  {
    id: "wo5",
    siteId: "s4",
    blockId: "b7",
    address: "123 Oak St, Sonoma, CA 95476",
    startDate: "2023-06-20T07:30:00Z",
    endDate: "2023-06-20T16:30:00Z",
    workType: "shootThinning",
    neededWorkers: 7,
    expectedHours: 8,
    payRate: 0.60,
    acres: 5.0,
    rows: 50,
    vines: 2000,
    vinesPerRow: 40,
    status: "draft",
    createdAt: "2023-06-10T00:00:00Z",
    createdBy: "u8"
  },
  {
    id: "wo6",
    siteId: "s5",
    blockId: "b8",
    address: "456 Ridge Way, Sonoma, CA 95476",
    startDate: "2023-06-25T08:00:00Z",
    endDate: "2023-06-25T17:00:00Z",
    workType: "pruning",
    neededWorkers: 5,
    expectedHours: 8,
    payRate: 0.75,
    acres: 4.2,
    rows: 42,
    vines: 1680,
    vinesPerRow: 40,
    status: "published",
    createdAt: "2023-06-15T00:00:00Z",
    createdBy: "u8"
  },
  {
    id: "wo7",
    siteId: "s6",
    blockId: "b9",
    address: "789 Mountain Rd, Napa, CA 94559",
    startDate: "2023-07-01T08:00:00Z",
    endDate: "2023-07-01T17:00:00Z",
    workType: "shootThinning",
    neededWorkers: 4,
    expectedHours: 8,
    payRate: 0.70,
    acres: 3.0,
    rows: 30,
    vines: 1200,
    vinesPerRow: 40,
    status: "published",
    createdAt: "2023-06-20T00:00:00Z",
    createdBy: "u9"
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
  },
  // Additional mock worker applications
  {
    id: "wa3",
    workerId: "u10",
    workerName: "Michael Johnson",
    orderrId: "wo2",
    status: "approved",
    createdAt: "2023-05-28T00:00:00Z"
  },
  {
    id: "wa4",
    workerId: "u11",
    workerName: "Emily Williams",
    orderrId: "wo2",
    status: "pending",
    createdAt: "2023-05-29T00:00:00Z"
  },
  {
    id: "wa5",
    workerId: "u12",
    workerName: "Carlos Sanchez",
    orderrId: "wo2",
    status: "rejected",
    createdAt: "2023-05-30T00:00:00Z"
  },
  {
    id: "wa6",
    workerId: "u4",
    workerName: "John Worker",
    orderrId: "wo3",
    status: "approved",
    createdAt: "2023-06-02T00:00:00Z"
  },
  {
    id: "wa7",
    workerId: "u5",
    workerName: "Jane Worker",
    orderrId: "wo3",
    status: "approved",
    createdAt: "2023-06-03T00:00:00Z"
  },
  {
    id: "wa8",
    workerId: "u10",
    workerName: "Michael Johnson",
    orderrId: "wo3",
    status: "pending",
    createdAt: "2023-06-04T00:00:00Z"
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
  },
  // Additional mock worker tasks
  {
    id: "wt5",
    workerId: "u10",
    workerName: "Michael Johnson",
    orderId: "wo1",
    imageUrl: "/task-image-5.jpg",
    completedAt: "2023-06-01T09:45:00Z",
    status: "approved"
  },
  {
    id: "wt6",
    workerId: "u10",
    workerName: "Michael Johnson",
    orderId: "wo1",
    imageUrl: "/task-image-6.jpg",
    completedAt: "2023-06-01T10:30:00Z",
    status: "approved"
  },
  {
    id: "wt7",
    workerId: "u4",
    workerName: "John Worker",
    orderId: "wo1",
    imageUrl: "/task-image-7.jpg",
    completedAt: "2023-06-01T13:15:00Z",
    status: "approved"
  },
  {
    id: "wt8",
    workerId: "u5",
    workerName: "Jane Worker",
    orderId: "wo1",
    imageUrl: "/task-image-8.jpg",
    completedAt: "2023-06-01T14:00:00Z",
    status: "approved"
  },
  {
    id: "wt9",
    workerId: "u4",
    workerName: "John Worker",
    orderId: "wo2",
    imageUrl: "/task-image-9.jpg",
    completedAt: "2023-06-05T09:30:00Z",
    status: "approved"
  },
  {
    id: "wt10",
    workerId: "u5",
    workerName: "Jane Worker",
    orderId: "wo2",
    imageUrl: "/task-image-10.jpg",
    completedAt: "2023-06-05T10:15:00Z",
    status: "approved"
  },
  {
    id: "wt11",
    workerId: "u10",
    workerName: "Michael Johnson",
    orderId: "wo2",
    imageUrl: "/task-image-11.jpg",
    completedAt: "2023-06-05T11:00:00Z",
    status: "pending"
  },
  {
    id: "wt12",
    workerId: "u4",
    workerName: "John Worker",
    orderId: "wo2",
    imageUrl: "/task-image-12.jpg",
    completedAt: "2023-06-05T11:45:00Z",
    status: "pending"
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
