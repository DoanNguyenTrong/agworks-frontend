import { supabase } from "@/integrations/supabase/client";
import { User, Site, Block, WorkOrder, WorkerApplication, WorkerTask } from "@/lib/types";

// User API functions
export const fetchUsers = async (role?: string): Promise<User[]> => {
  let query = supabase.from('profiles').select('*');
  
  if (role) {
    // Cast role to the correct type expected by Supabase
    query = query.eq('role', role as "admin" | "customer" | "siteManager" | "worker");
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
  
  return data?.map(formatUserResponse) || [];
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
  
  return data ? formatUserResponse(data) : null;
};

export const updateUserProfile = async (id: string, userData: Partial<User>): Promise<User> => {
  // Format the data to match the database column names (snake_case)
  const dbData = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    company_name: userData.companyName,
    logo: userData.logo,
    phone: userData.phone,
    address: userData.address,
    profile_image: userData.profileImage
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }
  
  return formatUserResponse(data);
};

// Helper to format user data from snake_case to camelCase
const formatUserResponse = (data: any): User => ({
  id: data.id,
  email: data.email,
  name: data.name,
  role: data.role,
  createdAt: data.created_at,
  companyName: data.company_name,
  logo: data.logo,
  phone: data.phone,
  address: data.address,
  profileImage: data.profile_image
});

// Sites API functions
export const fetchSites = async (customerId?: string): Promise<Site[]> => {
  let query = supabase.from('sites').select('*');
  
  if (customerId) {
    query = query.eq('customer_id', customerId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching sites:", error);
    throw error;
  }
  
  return data?.map(formatSiteResponse) || [];
};

export const fetchSiteById = async (id: string): Promise<Site | null> => {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching site:", error);
    throw error;
  }
  
  return data ? formatSiteResponse(data) : null;
};

export const createSite = async (siteData: Omit<Site, 'id' | 'createdAt'>): Promise<Site> => {
  const dbData = {
    name: siteData.name,
    address: siteData.address,
    customer_id: siteData.customerId,
    manager_id: siteData.managerId
  };
  
  const { data, error } = await supabase
    .from('sites')
    .insert(dbData)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating site:", error);
    throw error;
  }
  
  return formatSiteResponse(data);
};

export const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site> => {
  const dbData = {
    name: siteData.name,
    address: siteData.address,
    manager_id: siteData.managerId
  };
  
  const { data, error } = await supabase
    .from('sites')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating site:", error);
    throw error;
  }
  
  return formatSiteResponse(data);
};

export const deleteSite = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};

const formatSiteResponse = (data: any): Site => ({
  id: data.id,
  name: data.name,
  address: data.address,
  customerId: data.customer_id,
  managerId: data.manager_id,
  createdAt: data.created_at
});

// Blocks API functions
export const fetchBlocks = async (siteId?: string): Promise<Block[]> => {
  let query = supabase.from('blocks').select('*');
  
  if (siteId) {
    query = query.eq('site_id', siteId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching blocks:", error);
    throw error;
  }
  
  return data?.map(formatBlockResponse) || [];
};

export const fetchBlockById = async (id: string): Promise<Block | null> => {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching block:", error);
    throw error;
  }
  
  return data ? formatBlockResponse(data) : null;
};

export const createBlock = async (blockData: Omit<Block, 'id' | 'createdAt'>): Promise<Block> => {
  const dbData = {
    name: blockData.name,
    site_id: blockData.siteId,
    acres: blockData.acres,
    rows: blockData.rows,
    vines: blockData.vines
  };
  
  const { data, error } = await supabase
    .from('blocks')
    .insert(dbData)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating block:", error);
    throw error;
  }
  
  return formatBlockResponse(data);
};

export const updateBlock = async (id: string, blockData: Partial<Block>): Promise<Block> => {
  const dbData = {
    name: blockData.name,
    acres: blockData.acres,
    rows: blockData.rows,
    vines: blockData.vines
  };
  
  const { data, error } = await supabase
    .from('blocks')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating block:", error);
    throw error;
  }
  
  return formatBlockResponse(data);
};

export const deleteBlock = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting block:", error);
    throw error;
  }
};

const formatBlockResponse = (data: any): Block => ({
  id: data.id,
  name: data.name,
  siteId: data.site_id,
  acres: data.acres,
  rows: data.rows,
  vines: data.vines,
  createdAt: data.created_at
});

// Work Order API functions
export const fetchWorkOrders = async (siteId?: string, status?: string): Promise<WorkOrder[]> => {
  let query = supabase.from('work_orders').select('*');
  
  if (siteId) {
    query = query.eq('site_id', siteId);
  }
  
  if (status) {
    // Cast status to the correct type expected by Supabase
    query = query.eq('status', status as "draft" | "published" | "inProgress" | "completed" | "cancelled");
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching work orders:", error);
    throw error;
  }
  
  return data?.map(formatWorkOrderResponse) || [];
};

export const fetchWorkOrderById = async (id: string): Promise<WorkOrder | null> => {
  const { data, error } = await supabase
    .from('work_orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching work order:", error);
    throw error;
  }
  
  return data ? formatWorkOrderResponse(data) : null;
};

export const createWorkOrder = async (orderData: Omit<WorkOrder, 'id' | 'createdAt'>): Promise<WorkOrder> => {
  const dbData = {
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
    created_by: orderData.createdBy
  };
  
  const { data, error } = await supabase
    .from('work_orders')
    .insert(dbData)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating work order:", error);
    throw error;
  }
  
  return formatWorkOrderResponse(data);
};

export const updateWorkOrder = async (id: string, orderData: Partial<WorkOrder>): Promise<WorkOrder> => {
  const dbData: any = {};
  
  if (orderData.status !== undefined) dbData.status = orderData.status;
  if (orderData.startDate !== undefined) dbData.start_date = orderData.startDate;
  if (orderData.endDate !== undefined) dbData.end_date = orderData.endDate;
  if (orderData.neededWorkers !== undefined) dbData.needed_workers = orderData.neededWorkers;
  if (orderData.expectedHours !== undefined) dbData.expected_hours = orderData.expectedHours;
  if (orderData.payRate !== undefined) dbData.pay_rate = orderData.payRate;
  if (orderData.notes !== undefined) dbData.notes = orderData.notes;
  
  const { data, error } = await supabase
    .from('work_orders')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating work order:", error);
    throw error;
  }
  
  return formatWorkOrderResponse(data);
};

export const deleteWorkOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting work order:", error);
    throw error;
  }
};

const formatWorkOrderResponse = (data: any): WorkOrder => ({
  id: data.id,
  siteId: data.site_id,
  blockId: data.block_id,
  address: data.address,
  startDate: data.start_date,
  endDate: data.end_date,
  workType: data.work_type,
  neededWorkers: data.needed_workers,
  expectedHours: data.expected_hours,
  payRate: data.pay_rate,
  acres: data.acres,
  rows: data.rows,
  vines: data.vines,
  vinesPerRow: data.vines_per_row,
  notes: data.notes,
  status: data.status,
  createdAt: data.created_at,
  createdBy: data.created_by
});

// Worker Applications API
export const fetchWorkerApplications = async (orderId?: string, workerId?: string): Promise<WorkerApplication[]> => {
  let query = supabase.from('worker_applications').select('*');
  
  if (orderId) {
    query = query.eq('order_id', orderId);
  }
  
  if (workerId) {
    query = query.eq('worker_id', workerId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
  
  if (!data) return [];

  const applications = await Promise.all(data.map(async (app) => {
    // Get worker name
    const { data: workerData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', app.worker_id)
      .single();
      
    return {
      id: app.id,
      workerId: app.worker_id,
      workerName: workerData?.name || 'Unknown Worker',
      orderrId: app.order_id,
      status: app.status,
      createdAt: app.created_at
    };
  }));
  
  return applications;
};

export const createWorkerApplication = async (applicationData: Omit<WorkerApplication, 'id' | 'workerName' | 'createdAt'>): Promise<void> => {
  const dbData = {
    worker_id: applicationData.workerId,
    order_id: applicationData.orderrId,
    status: applicationData.status || 'pending'
  };
  
  const { error } = await supabase
    .from('worker_applications')
    .insert(dbData);
  
  if (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

export const updateWorkerApplication = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  const { error } = await supabase
    .from('worker_applications')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

// Worker Tasks API
export const fetchWorkerTasks = async (orderId?: string, workerId?: string): Promise<WorkerTask[]> => {
  let query = supabase.from('worker_tasks').select('*');
  
  if (orderId) {
    query = query.eq('order_id', orderId);
  }
  
  if (workerId) {
    query = query.eq('worker_id', workerId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
  
  if (!data) return [];

  const tasks = await Promise.all(data.map(async (task) => {
    // Get worker name
    const { data: workerData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', task.worker_id)
      .single();
      
    // Get task photos
    const { data: photosData } = await supabase
      .from('task_photos')
      .select('photo_url')
      .eq('task_id', task.id);
      
    // Map the database status to our interface status
    let adaptedStatus: "pending" | "approved" | "rejected";
    switch (task.status) {
      case 'registered':
        adaptedStatus = 'pending';
        break;
      case 'approved':
        adaptedStatus = 'approved';
        break;
      case 'working':
      case 'worked':
      default:
        adaptedStatus = 'approved';
        break;
    }
    
    return {
      id: task.id,
      workerId: task.worker_id,
      workerName: workerData?.name || 'Unknown Worker',
      orderId: task.order_id,
      imageUrl: photosData?.[0]?.photo_url,
      photoUrls: photosData?.map(p => p.photo_url) || [],
      completedAt: task.completed_at || "",
      status: adaptedStatus
    };
  }));
  
  return tasks;
};

export const createWorkerTask = async (taskData: Partial<WorkerTask>): Promise<string> => {
  // Define a valid status value explicitly to avoid type errors
  const dbStatus: "registered" | "approved" | "working" | "worked" = "registered";
  
  const dbData = {
    worker_id: taskData.workerId,
    order_id: taskData.orderId,
    status: dbStatus
  };
  
  const { data, error } = await supabase
    .from('worker_tasks')
    .insert(dbData)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }
  
  if (!data) throw new Error("Failed to create task");
  
  return data.id;
};

export const updateWorkerTask = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  // Convert from our interface status to DB status
  let dbStatus: 'registered' | 'approved' | 'working' | 'worked';
  
  switch (status) {
    case 'pending':
      dbStatus = 'registered';
      break;
    case 'approved':
      dbStatus = 'approved';
      break;
    case 'rejected':
    default:
      dbStatus = 'registered';
      break;
  }
  
  const updateData: any = { status: dbStatus };
  
  // If marking as approved, also set completed_at
  if (status === 'approved') {
    updateData.completed_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('worker_tasks')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const addTaskPhoto = async (taskId: string, photoUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('task_photos')
    .insert({
      task_id: taskId,
      photo_url: photoUrl
    });
  
  if (error) {
    console.error("Error adding task photo:", error);
    throw error;
  }
};
