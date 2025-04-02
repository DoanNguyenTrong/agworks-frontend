// Import supabase API helpers
import { 
  supabase,
  profilesApi,
  sitesApi,
  blocksApi,
  workOrdersApi,
  workerApplicationsApi,
  workerTasksApi
} from "@/integrations/supabase/client";
import { User, Site, Block, WorkOrder, WorkerApplication, WorkerTask, PaymentCalculation } from "@/lib/types";

// Fetch all users with a specific role
export async function fetchUsers(role?: string): Promise<User[]> {
  try {
    let query = supabase.from('profiles').select('*');
    
    if (role) {
      query = query.eq('role', role);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${role || 'all'} users:`, error);
      throw error;
    }
    
    if (!data) return [];
    
    // Map the Supabase data to our User type
    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role as "admin" | "customer" | "siteManager" | "worker",
      createdAt: profile.created_at,
      profileImage: profile.profile_image,
      phone: profile.phone,
      address: profile.address,
      companyName: profile.company_name,
      logo: profile.logo,
    }));
  } catch (error) {
    console.error(`Error in fetchUsers(${role || 'all'}):`, error);
    return [];
  }
}

// Fetch a single user by ID
export async function fetchUserById(userId: string): Promise<User | null> {
  try {
    const profile = await profilesApi.getProfile(userId);
    
    if (!profile) return null;
    
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role as "admin" | "customer" | "siteManager" | "worker",
      createdAt: profile.created_at,
      profileImage: profile.profile_image,
      phone: profile.phone,
      address: profile.address,
      companyName: profile.company_name,
      logo: profile.logo,
    };
  } catch (error) {
    console.error(`Error in fetchUserById(${userId}):`, error);
    return null;
  }
}

// Update a user profile
export async function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  try {
    // Map our User type to the Supabase profile structure
    const updates = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      profile_image: userData.profileImage,
      phone: userData.phone,
      address: userData.address,
      company_name: userData.companyName,
      logo: userData.logo,
    };
    
    const profile = await profilesApi.updateProfile(userId, updates);
    
    if (!profile) return null;
    
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role as "admin" | "customer" | "siteManager" | "worker",
      createdAt: profile.created_at,
      profileImage: profile.profile_image,
      phone: profile.phone,
      address: profile.address,
      companyName: profile.company_name,
      logo: profile.logo,
    };
  } catch (error) {
    console.error(`Error in updateUser(${userId}):`, error);
    return null;
  }
}

// Fetch sites with optional filtering by customer ID
export async function fetchSites(customerId?: string): Promise<Site[]> {
  try {
    const sites = await sitesApi.getSites(customerId);
    
    return sites.map(site => ({
      id: site.id,
      name: site.name,
      address: site.address,
      customerId: site.customer_id,
      managerId: site.manager_id,
      createdAt: site.created_at,
    }));
  } catch (error) {
    console.error("Error in fetchSites:", error);
    return [];
  }
}

// Fetch a single site by ID
export async function fetchSiteById(siteId: string): Promise<Site | null> {
  try {
    const site = await sitesApi.getSiteById(siteId);
    
    if (!site) return null;
    
    return {
      id: site.id,
      name: site.name,
      address: site.address,
      customerId: site.customer_id,
      managerId: site.manager_id,
      createdAt: site.created_at,
    };
  } catch (error) {
    console.error(`Error in fetchSiteById(${siteId}):`, error);
    return null;
  }
}

// Create a new site
export async function createSite(siteData: Omit<Site, "id" | "createdAt">): Promise<Site | null> {
  try {
    const site = await sitesApi.createSite({
      name: siteData.name,
      address: siteData.address,
      customer_id: siteData.customerId,
      manager_id: siteData.managerId,
    });
    
    if (!site) return null;
    
    return {
      id: site.id,
      name: site.name,
      address: site.address,
      customerId: site.customer_id,
      managerId: site.manager_id,
      createdAt: site.created_at,
    };
  } catch (error) {
    console.error("Error in createSite:", error);
    return null;
  }
}

// Update an existing site
export async function updateSite(siteId: string, siteData: Partial<Site>): Promise<Site | null> {
  try {
    const site = await sitesApi.updateSite(siteId, {
      name: siteData.name,
      address: siteData.address,
      manager_id: siteData.managerId,
    });
    
    if (!site) return null;
    
    return {
      id: site.id,
      name: site.name,
      address: site.address,
      customerId: site.customer_id,
      managerId: site.manager_id,
      createdAt: site.created_at,
    };
  } catch (error) {
    console.error(`Error in updateSite(${siteId}):`, error);
    return null;
  }
}

// Delete a site
export async function deleteSite(siteId: string): Promise<boolean> {
  try {
    return await sitesApi.deleteSite(siteId);
  } catch (error) {
    console.error(`Error in deleteSite(${siteId}):`, error);
    return false;
  }
}

// Fetch blocks with optional filtering by site ID
export async function fetchBlocks(siteId?: string): Promise<Block[]> {
  try {
    const blocks = await blocksApi.getBlocks(siteId);
    
    return blocks.map(block => ({
      id: block.id,
      name: block.name,
      siteId: block.site_id,
      acres: block.acres,
      rows: block.rows,
      vines: block.vines,
      createdAt: block.created_at,
    }));
  } catch (error) {
    console.error("Error in fetchBlocks:", error);
    return [];
  }
}

// Fetch a single block by ID
export async function fetchBlockById(blockId: string): Promise<Block | null> {
  try {
    const block = await blocksApi.getBlockById(blockId);
    
    if (!block) return null;
    
    return {
      id: block.id,
      name: block.name,
      siteId: block.site_id,
      acres: block.acres,
      rows: block.rows,
      vines: block.vines,
      createdAt: block.created_at,
    };
  } catch (error) {
    console.error(`Error in fetchBlockById(${blockId}):`, error);
    return null;
  }
}

// Create a new block
export async function createBlock(blockData: Omit<Block, "id" | "createdAt">): Promise<Block | null> {
  try {
    const block = await blocksApi.createBlock({
      name: blockData.name,
      site_id: blockData.siteId,
      acres: blockData.acres,
      rows: blockData.rows,
      vines: blockData.vines,
    });
    
    if (!block) return null;
    
    return {
      id: block.id,
      name: block.name,
      siteId: block.site_id,
      acres: block.acres,
      rows: block.rows,
      vines: block.vines,
      createdAt: block.created_at,
    };
  } catch (error) {
    console.error("Error in createBlock:", error);
    return null;
  }
}

// Update an existing block
export async function updateBlock(blockId: string, blockData: Partial<Block>): Promise<Block | null> {
  try {
    const block = await blocksApi.updateBlock(blockId, {
      name: blockData.name,
      acres: blockData.acres,
      rows: blockData.rows,
      vines: blockData.vines,
    });
    
    if (!block) return null;
    
    return {
      id: block.id,
      name: block.name,
      siteId: block.site_id,
      acres: block.acres,
      rows: block.rows,
      vines: block.vines,
      createdAt: block.created_at,
    };
  } catch (error) {
    console.error(`Error in updateBlock(${blockId}):`, error);
    return null;
  }
}

// Delete a block
export async function deleteBlock(blockId: string): Promise<boolean> {
  try {
    return await blocksApi.deleteBlock(blockId);
  } catch (error) {
    console.error(`Error in deleteBlock(${blockId}):`, error);
    return false;
  }
}

// Fetch work orders with optional filtering
export async function fetchWorkOrders(filters?: {
  siteId?: string;
  blockId?: string;
  status?: string;
  createdBy?: string;
}): Promise<WorkOrder[]> {
  try {
    const orders = await workOrdersApi.getWorkOrders(filters);
    
    return orders.map(order => ({
      id: order.id,
      siteId: order.site_id,
      blockId: order.block_id,
      address: order.address,
      startDate: order.start_date,
      endDate: order.end_date,
      workType: order.work_type as "pruning" | "shootThinning" | "other",
      neededWorkers: order.needed_workers,
      expectedHours: order.expected_hours,
      payRate: order.pay_rate,
      acres: order.acres,
      rows: order.rows,
      vines: order.vines,
      vinesPerRow: order.vines_per_row,
      notes: order.notes,
      status: order.status as "draft" | "published" | "inProgress" | "completed" | "cancelled",
      createdAt: order.created_at,
      createdBy: order.created_by,
    }));
  } catch (error) {
    console.error("Error in fetchWorkOrders:", error);
    return [];
  }
}

// Fetch a single work order by ID
export async function fetchWorkOrderById(orderId: string): Promise<WorkOrder | null> {
  try {
    const order = await workOrdersApi.getWorkOrderById(orderId);
    
    if (!order) return null;
    
    return {
      id: order.id,
      siteId: order.site_id,
      blockId: order.block_id,
      address: order.address,
      startDate: order.start_date,
      endDate: order.end_date,
      workType: order.work_type as "pruning" | "shootThinning" | "other",
      neededWorkers: order.needed_workers,
      expectedHours: order.expected_hours,
      payRate: order.pay_rate,
      acres: order.acres,
      rows: order.rows,
      vines: order.vines,
      vinesPerRow: order.vines_per_row,
      notes: order.notes,
      status: order.status as "draft" | "published" | "inProgress" | "completed" | "cancelled",
      createdAt: order.created_at,
      createdBy: order.created_by,
    };
  } catch (error) {
    console.error(`Error in fetchWorkOrderById(${orderId}):`, error);
    return null;
  }
}

// Create a new work order
export async function createWorkOrder(orderData: Omit<WorkOrder, "id" | "createdAt">): Promise<WorkOrder | null> {
  try {
    const order = await workOrdersApi.createWorkOrder({
      site_id: orderData.siteId,
      block_id: orderData.blockId,
      address: orderData.address,
      start_date: orderData.startDate,
      end_date: orderData.endDate,
      work_type: orderData.workType,
      needed_workers: orderData.neededWorkers,
      expected_hours: orderData.expectedHours,
      pay_rate: orderData.payRate,
      acres: orderData.acres,
      rows: orderData.rows,
      vines: orderData.vines,
      vines_per_row: orderData.vinesPerRow,
      notes: orderData.notes,
      status: orderData.status,
      created_by: orderData.createdBy,
    });
    
    if (!order) return null;
    
    return {
      id: order.id,
      siteId: order.site_id,
      blockId: order.block_id,
      address: order.address,
      startDate: order.startDate,
      endDate: order.endDate,
      workType: order.work_type as "pruning" | "shootThinning" | "other",
      neededWorkers: order.neededWorkers,
      expectedHours: order.expectedHours,
      payRate: order.payRate,
      acres: order.acres,
      rows: order.rows,
      vines: order.vines,
      vinesPerRow: order.vines_per_row,
      notes: order.notes,
      status: order.status as "draft" | "published" | "inProgress" | "completed" | "cancelled",
      createdAt: order.created_at,
      createdBy: order.created_by,
    };
  } catch (error) {
    console.error("Error in createWorkOrder:", error);
    return null;
  }
}

// Update an existing work order
export async function updateWorkOrder(orderId: string, orderData: Partial<WorkOrder>): Promise<WorkOrder | null> {
  try {
    const order = await workOrdersApi.updateWorkOrder(orderId, {
      start_date: orderData.startDate,
      end_date: orderData.endDate,
      needed_workers: orderData.neededWorkers,
      status: orderData.status,
      notes: orderData.notes,
    });
    
    if (!order) return null;
    
    return {
      id: order.id,
      siteId: order.site_id,
      blockId: order.block_id,
      address: order.address,
      startDate: order.startDate,
      endDate: order.endDate,
      workType: order.work_type as "pruning" | "shootThinning" | "other",
      neededWorkers: order.neededWorkers,
      expectedHours: order.expectedHours,
      payRate: order.payRate,
      acres: order.acres,
      rows: order.rows,
      vines: order.vines,
      vinesPerRow: order.vines_per_row,
      notes: order.notes,
      status: order.status as "draft" | "published" | "inProgress" | "completed" | "cancelled",
      createdAt: order.created_at,
      createdBy: order.created_by,
    };
  } catch (error) {
    console.error(`Error in updateWorkOrder(${orderId}):`, error);
    return null;
  }
}

// Delete a work order
export async function deleteWorkOrder(orderId: string): Promise<boolean> {
  try {
    return await workOrdersApi.deleteWorkOrder(orderId);
  } catch (error) {
    console.error(`Error in deleteWorkOrder(${orderId}):`, error);
    return false;
  }
}

// Fetch worker applications with optional filtering
export async function fetchWorkerApplications(filters?: {
  workerId?: string;
  orderId?: string;
  status?: string;
}): Promise<WorkerApplication[]> {
  try {
    const applications = await workerApplicationsApi.getApplications(filters);
    
    // We need to join with profiles to get worker names
    const workerIds = applications.map(app => app.worker_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', workerIds);
    
    const workerMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        workerMap.set(profile.id, profile.name);
      });
    }
    
    return applications.map(app => ({
      id: app.id,
      workerId: app.worker_id,
      workerName: workerMap.get(app.worker_id) || 'Unknown Worker',
      orderrId: app.order_id,
      status: app.status as "pending" | "approved" | "rejected",
      createdAt: app.created_at,
    }));
  } catch (error) {
    console.error("Error in fetchWorkerApplications:", error);
    return [];
  }
}

// Create a new worker application
export async function createWorkerApplication(applicationData: {
  workerId: string;
  orderId: string;
}): Promise<WorkerApplication | null> {
  try {
    const application = await workerApplicationsApi.createApplication({
      worker_id: applicationData.workerId,
      order_id: applicationData.orderId,
      status: 'pending',
    });
    
    if (!application) return null;
    
    // Get worker name
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', application.worker_id)
      .single();
    
    return {
      id: application.id,
      workerId: application.worker_id,
      workerName: profile?.name || 'Unknown Worker',
      orderrId: application.order_id,
      status: application.status as "pending" | "approved" | "rejected",
      createdAt: application.created_at,
    };
  } catch (error) {
    console.error("Error in createWorkerApplication:", error);
    return null;
  }
}

// Update a worker application status
export async function updateWorkerApplicationStatus(
  applicationId: string,
  status: "pending" | "approved" | "rejected"
): Promise<WorkerApplication | null> {
  try {
    const application = await workerApplicationsApi.updateApplicationStatus(applicationId, status);
    
    if (!application) return null;
    
    // Get worker name
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', application.worker_id)
      .single();
    
    return {
      id: application.id,
      workerId: application.worker_id,
      workerName: profile?.name || 'Unknown Worker',
      orderrId: application.order_id,
      status: application.status as "pending" | "approved" | "rejected",
      createdAt: application.created_at,
    };
  } catch (error) {
    console.error(`Error in updateWorkerApplicationStatus(${applicationId}):`, error);
    return null;
  }
}

// Fetch worker tasks with optional filtering
export async function fetchWorkerTasks(orderId?: string | {
  workerId?: string;
  orderId?: string;
  status?: string;
}): Promise<WorkerTask[]> {
  try {
    let filters: {
      workerId?: string;
      orderId?: string;
      status?: string;
    } = {};
    
    // Handle the case where orderId is a string (for backward compatibility)
    if (typeof orderId === 'string') {
      filters = { orderId: orderId };
    } 
    // Handle the case where orderId is actually a filters object
    else if (orderId && typeof orderId === 'object') {
      filters = orderId;
    }
    
    const tasks = await workerTasksApi.getTasks(filters);
    
    // We need to join with profiles to get worker names
    const workerIds = tasks.map(task => task.worker_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', workerIds);
    
    const workerMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        workerMap.set(profile.id, profile.name);
      });
    }
    
    return tasks.map(task => ({
      id: task.id,
      workerId: task.worker_id,
      workerName: workerMap.get(task.worker_id) || 'Unknown Worker',
      orderId: task.order_id,
      imageUrl: task.photo_url,
      photoUrls: task.photo_urls as string[] || [],
      completedAt: task.completed_at,
      status: task.status as "pending" | "approved" | "rejected",
    }));
  } catch (error) {
    console.error("Error in fetchWorkerTasks:", error);
    return [];
  }
}

// Create a new worker task
export async function createWorkerTask(taskData: {
  workerId: string;
  orderId: string;
  imageUrl?: string;
  photoUrls?: string[];
}): Promise<WorkerTask | null> {
  try {
    const task = await workerTasksApi.createTask({
      worker_id: taskData.workerId,
      order_id: taskData.orderId,
      status: 'pending',
      photo_url: taskData.imageUrl,
      photo_urls: taskData.photoUrls,
    });
    
    if (!task) return null;
    
    // Get worker name
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', task.worker_id)
      .single();
    
    return {
      id: task.id,
      workerId: task.worker_id,
      workerName: profile?.name || 'Unknown Worker',
      orderId: task.order_id,
      imageUrl: task.photo_url,
      photoUrls: task.photo_urls as string[] || [],
      completedAt: task.completed_at,
      status: task.status as "pending" | "approved" | "rejected",
    };
  } catch (error) {
    console.error("Error in createWorkerTask:", error);
    return null;
  }
}

// Update a worker task status and/or photos
export async function updateWorkerTask(
  taskId: string,
  updates: Partial<{
    status: "pending" | "approved" | "rejected";
    imageUrl: string;
    photoUrls: string[];
  }>
): Promise<WorkerTask | null> {
  try {
    const task = await workerTasksApi.updateTask(taskId, {
      status: updates.status,
      photo_url: updates.imageUrl,
      photo_urls: updates.photoUrls,
    });
    
    if (!task) return null;
    
    // Get worker name
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', task.worker_id)
      .single();
    
    return {
      id: task.id,
      workerId: task.worker_id,
      workerName: profile?.name || 'Unknown Worker',
      orderId: task.order_id,
      imageUrl: task.photo_url,
      photoUrls: task.photo_urls as string[] || [],
      completedAt: task.completed_at,
      status: task.status as "pending" | "approved" | "rejected",
    };
  } catch (error) {
    console.error(`Error in updateWorkerTask(${taskId}):`, error);
    return null;
  }
}

// Calculate payment for workers
export async function calculateWorkerPayments(orderId: string): Promise<PaymentCalculation[]> {
  try {
    // Fetch the completed tasks for the work order
    const tasks = await workerTasksApi.getTasks({
      orderId,
      status: 'approved'
    });
    
    // Fetch the work order details
    const order = await workOrdersApi.getWorkOrderById(orderId);
    
    if (!order) {
      throw new Error('Work order not found');
    }
    
    // Group tasks by worker
    const workerTasksMap = new Map();
    tasks.forEach(task => {
      if (!workerTasksMap.has(task.worker_id)) {
        workerTasksMap.set(task.worker_id, []);
      }
      workerTasksMap.get(task.worker_id).push(task);
    });
    
    // We need to get worker names
    const workerIds = Array.from(workerTasksMap.keys());
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', workerIds);
    
    const workerMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        workerMap.set(profile.id, profile.name);
      });
    }
    
    // Calculate payment for each worker
    const payments: PaymentCalculation[] = [];
    
    workerTasksMap.forEach((workerTasks, workerId) => {
      const taskCount = workerTasks.length;
      const totalAmount = taskCount * order.pay_rate;
      
      payments.push({
        workerId,
        workerName: workerMap.get(workerId) || 'Unknown Worker',
        taskCount,
        totalAmount,
      });
    });
    
    return payments;
  } catch (error) {
    console.error(`Error in calculateWorkerPayments(${orderId}):`, error);
    return [];
  }
}
