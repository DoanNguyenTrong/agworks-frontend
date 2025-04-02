
import { supabase, localStorageApi } from "@/integrations/supabase/client";
import { User, Site, Block, WorkOrder, WorkerApplication, WorkerTask, PaymentCalculation } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'agw_users',
  SITES: 'agw_sites',
  BLOCKS: 'agw_blocks',
  WORK_ORDERS: 'agw_workorders',
  APPLICATIONS: 'agw_applications',
  TASKS: 'agw_tasks'
};

// Initialize local storage with sample data if needed
const initializeLocalStorage = () => {
  // Create sample users if none exist
  if (!localStorageApi.getItem(STORAGE_KEYS.USERS)) {
    const sampleUsers: User[] = [
      {
        id: "admin1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "customer1",
        email: "customer@example.com",
        name: "Customer User",
        role: "customer",
        companyName: "Sample Vineyard",
        createdAt: new Date().toISOString()
      },
      {
        id: "manager1",
        email: "manager@example.com",
        name: "Manager User",
        role: "siteManager",
        createdAt: new Date().toISOString()
      },
      {
        id: "worker1",
        email: "worker@example.com",
        name: "Worker User",
        role: "worker",
        createdAt: new Date().toISOString()
      }
    ];
    localStorageApi.setItem(STORAGE_KEYS.USERS, sampleUsers);
  }

  // Initialize other empty collections if needed
  if (!localStorageApi.getItem(STORAGE_KEYS.SITES)) {
    localStorageApi.setItem(STORAGE_KEYS.SITES, []);
  }
  if (!localStorageApi.getItem(STORAGE_KEYS.BLOCKS)) {
    localStorageApi.setItem(STORAGE_KEYS.BLOCKS, []);
  }
  if (!localStorageApi.getItem(STORAGE_KEYS.WORK_ORDERS)) {
    localStorageApi.setItem(STORAGE_KEYS.WORK_ORDERS, []);
  }
  if (!localStorageApi.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorageApi.setItem(STORAGE_KEYS.APPLICATIONS, []);
  }
  if (!localStorageApi.getItem(STORAGE_KEYS.TASKS)) {
    localStorageApi.setItem(STORAGE_KEYS.TASKS, []);
  }
};

// Initialize on first import
initializeLocalStorage();

// User API functions
export const fetchUsers = async (role?: string): Promise<User[]> => {
  const users = localStorageApi.getItem(STORAGE_KEYS.USERS) || [];
  
  if (role) {
    return users.filter((user: User) => user.role === role);
  }
  
  return users;
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  const users = localStorageApi.getItem(STORAGE_KEYS.USERS) || [];
  return users.find((user: User) => user.id === id) || null;
};

export const updateUserProfile = async (id: string, userData: Partial<User>): Promise<User> => {
  const users = localStorageApi.getItem(STORAGE_KEYS.USERS) || [];
  const userIndex = users.findIndex((user: User) => user.id === id);
  
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  const updatedUser = { ...users[userIndex], ...userData };
  users[userIndex] = updatedUser;
  
  localStorageApi.setItem(STORAGE_KEYS.USERS, users);
  return updatedUser;
};

// Sites API functions
export const fetchSites = async (customerId?: string): Promise<Site[]> => {
  const sites = localStorageApi.getItem(STORAGE_KEYS.SITES) || [];
  
  if (customerId) {
    return sites.filter((site: Site) => site.customerId === customerId);
  }
  
  return sites;
};

export const fetchSiteById = async (id: string): Promise<Site | null> => {
  const sites = localStorageApi.getItem(STORAGE_KEYS.SITES) || [];
  return sites.find((site: Site) => site.id === id) || null;
};

export const createSite = async (siteData: Omit<Site, 'id' | 'createdAt'>): Promise<Site> => {
  const sites = localStorageApi.getItem(STORAGE_KEYS.SITES) || [];
  
  const newSite: Site = {
    id: uuidv4(),
    ...siteData,
    createdAt: new Date().toISOString()
  };
  
  sites.push(newSite);
  localStorageApi.setItem(STORAGE_KEYS.SITES, sites);
  
  return newSite;
};

export const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site> => {
  const sites = localStorageApi.getItem(STORAGE_KEYS.SITES) || [];
  const siteIndex = sites.findIndex((site: Site) => site.id === id);
  
  if (siteIndex === -1) {
    throw new Error("Site not found");
  }
  
  const updatedSite = { ...sites[siteIndex], ...siteData };
  sites[siteIndex] = updatedSite;
  
  localStorageApi.setItem(STORAGE_KEYS.SITES, sites);
  return updatedSite;
};

export const deleteSite = async (id: string): Promise<void> => {
  const sites = localStorageApi.getItem(STORAGE_KEYS.SITES) || [];
  const updatedSites = sites.filter((site: Site) => site.id !== id);
  
  localStorageApi.setItem(STORAGE_KEYS.SITES, updatedSites);
};

// Blocks API functions
export const fetchBlocks = async (siteId?: string): Promise<Block[]> => {
  const blocks = localStorageApi.getItem(STORAGE_KEYS.BLOCKS) || [];
  
  if (siteId) {
    return blocks.filter((block: Block) => block.siteId === siteId);
  }
  
  return blocks;
};

export const fetchBlockById = async (id: string): Promise<Block | null> => {
  const blocks = localStorageApi.getItem(STORAGE_KEYS.BLOCKS) || [];
  return blocks.find((block: Block) => block.id === id) || null;
};

export const createBlock = async (blockData: Omit<Block, 'id' | 'createdAt'>): Promise<Block> => {
  const blocks = localStorageApi.getItem(STORAGE_KEYS.BLOCKS) || [];
  
  const newBlock: Block = {
    id: uuidv4(),
    ...blockData,
    createdAt: new Date().toISOString()
  };
  
  blocks.push(newBlock);
  localStorageApi.setItem(STORAGE_KEYS.BLOCKS, blocks);
  
  return newBlock;
};

export const updateBlock = async (id: string, blockData: Partial<Block>): Promise<Block> => {
  const blocks = localStorageApi.getItem(STORAGE_KEYS.BLOCKS) || [];
  const blockIndex = blocks.findIndex((block: Block) => block.id === id);
  
  if (blockIndex === -1) {
    throw new Error("Block not found");
  }
  
  const updatedBlock = { ...blocks[blockIndex], ...blockData };
  blocks[blockIndex] = updatedBlock;
  
  localStorageApi.setItem(STORAGE_KEYS.BLOCKS, blocks);
  return updatedBlock;
};

export const deleteBlock = async (id: string): Promise<void> => {
  const blocks = localStorageApi.getItem(STORAGE_KEYS.BLOCKS) || [];
  const updatedBlocks = blocks.filter((block: Block) => block.id !== id);
  
  localStorageApi.setItem(STORAGE_KEYS.BLOCKS, updatedBlocks);
};

// Work Order API functions
export const fetchWorkOrders = async (siteId?: string, status?: string): Promise<WorkOrder[]> => {
  const workOrders = localStorageApi.getItem(STORAGE_KEYS.WORK_ORDERS) || [];
  
  return workOrders.filter((order: WorkOrder) => {
    if (siteId && order.siteId !== siteId) return false;
    if (status && order.status !== status) return false;
    return true;
  });
};

export const fetchWorkOrderById = async (id: string): Promise<WorkOrder | null> => {
  const workOrders = localStorageApi.getItem(STORAGE_KEYS.WORK_ORDERS) || [];
  return workOrders.find((order: WorkOrder) => order.id === id) || null;
};

export const createWorkOrder = async (orderData: Omit<WorkOrder, 'id' | 'createdAt'>): Promise<WorkOrder> => {
  const workOrders = localStorageApi.getItem(STORAGE_KEYS.WORK_ORDERS) || [];
  
  const newOrder: WorkOrder = {
    id: uuidv4(),
    ...orderData,
    createdAt: new Date().toISOString()
  };
  
  workOrders.push(newOrder);
  localStorageApi.setItem(STORAGE_KEYS.WORK_ORDERS, workOrders);
  
  return newOrder;
};

export const updateWorkOrder = async (id: string, orderData: Partial<WorkOrder>): Promise<WorkOrder> => {
  const workOrders = localStorageApi.getItem(STORAGE_KEYS.WORK_ORDERS) || [];
  const orderIndex = workOrders.findIndex((order: WorkOrder) => order.id === id);
  
  if (orderIndex === -1) {
    throw new Error("Work order not found");
  }
  
  const updatedOrder = { ...workOrders[orderIndex], ...orderData };
  workOrders[orderIndex] = updatedOrder;
  
  localStorageApi.setItem(STORAGE_KEYS.WORK_ORDERS, workOrders);
  return updatedOrder;
};

export const deleteWorkOrder = async (id: string): Promise<void> => {
  const workOrders = localStorageApi.getItem(STORAGE_KEYS.WORK_ORDERS) || [];
  const updatedOrders = workOrders.filter((order: WorkOrder) => order.id !== id);
  
  localStorageApi.setItem(STORAGE_KEYS.WORK_ORDERS, updatedOrders);
};

// Worker Applications API
export const fetchWorkerApplications = async (orderId?: string, workerId?: string): Promise<WorkerApplication[]> => {
  const applications = localStorageApi.getItem(STORAGE_KEYS.APPLICATIONS) || [];
  
  return applications.filter((app: WorkerApplication) => {
    if (orderId && app.orderrId !== orderId) return false;
    if (workerId && app.workerId !== workerId) return false;
    return true;
  });
};

export const createWorkerApplication = async (applicationData: Omit<WorkerApplication, 'id' | 'workerName' | 'createdAt'>): Promise<void> => {
  const applications = localStorageApi.getItem(STORAGE_KEYS.APPLICATIONS) || [];
  const users = localStorageApi.getItem(STORAGE_KEYS.USERS) || [];
  
  const worker = users.find((user: User) => user.id === applicationData.workerId);
  const workerName = worker ? worker.name : 'Unknown Worker';
  
  const newApplication: WorkerApplication = {
    id: uuidv4(),
    ...applicationData,
    workerName,
    createdAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  localStorageApi.setItem(STORAGE_KEYS.APPLICATIONS, applications);
};

export const updateWorkerApplication = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  const applications = localStorageApi.getItem(STORAGE_KEYS.APPLICATIONS) || [];
  const appIndex = applications.findIndex((app: WorkerApplication) => app.id === id);
  
  if (appIndex === -1) {
    throw new Error("Application not found");
  }
  
  applications[appIndex].status = status;
  localStorageApi.setItem(STORAGE_KEYS.APPLICATIONS, applications);
};

// Worker Tasks API
export const fetchWorkerTasks = async (orderId?: string, workerId?: string): Promise<WorkerTask[]> => {
  const tasks = localStorageApi.getItem(STORAGE_KEYS.TASKS) || [];
  
  return tasks.filter((task: WorkerTask) => {
    if (orderId && task.orderId !== orderId) return false;
    if (workerId && task.workerId !== workerId) return false;
    return true;
  });
};

export const createWorkerTask = async (taskData: Partial<WorkerTask>): Promise<string> => {
  const tasks = localStorageApi.getItem(STORAGE_KEYS.TASKS) || [];
  const users = localStorageApi.getItem(STORAGE_KEYS.USERS) || [];
  
  const worker = users.find((user: User) => user.id === taskData.workerId);
  const workerName = worker ? worker.name : 'Unknown Worker';
  
  const newTask: WorkerTask = {
    id: uuidv4(),
    workerId: taskData.workerId || '',
    workerName,
    orderId: taskData.orderId || '',
    imageUrl: taskData.imageUrl || '',
    photoUrls: taskData.photoUrls || [],
    completedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  tasks.push(newTask);
  localStorageApi.setItem(STORAGE_KEYS.TASKS, tasks);
  
  return newTask.id;
};

export const updateWorkerTask = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  const tasks = localStorageApi.getItem(STORAGE_KEYS.TASKS) || [];
  const taskIndex = tasks.findIndex((task: WorkerTask) => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error("Task not found");
  }
  
  tasks[taskIndex].status = status;
  
  // If approving, update completed date
  if (status === 'approved') {
    tasks[taskIndex].completedAt = new Date().toISOString();
  }
  
  localStorageApi.setItem(STORAGE_KEYS.TASKS, tasks);
};

export const addTaskPhoto = async (taskId: string, photoUrl: string): Promise<void> => {
  const tasks = localStorageApi.getItem(STORAGE_KEYS.TASKS) || [];
  const taskIndex = tasks.findIndex((task: WorkerTask) => task.id === taskId);
  
  if (taskIndex === -1) {
    throw new Error("Task not found");
  }
  
  if (!tasks[taskIndex].photoUrls) {
    tasks[taskIndex].photoUrls = [];
  }
  
  tasks[taskIndex].photoUrls.push(photoUrl);
  
  // Set first photo as main image if none exists
  if (!tasks[taskIndex].imageUrl) {
    tasks[taskIndex].imageUrl = photoUrl;
  }
  
  localStorageApi.setItem(STORAGE_KEYS.TASKS, tasks);
};
