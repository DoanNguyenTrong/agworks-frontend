import { User, WorkOrder, Site, Block, WorkerApplication, WorkerTask, UserSettings, AdminSettings } from "@/lib/types";
import { users, sites, blocks, workOrders, workerApplications, workerTasks, userSettings, adminSettings } from "@/lib/data";

// Function to add a new user
export function addUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser = {
    ...userData,
    id: `user-${users.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would be persisted to a database
  // For now, we'll just return the new user object
  console.log("Added new user:", newUser);
  return newUser;
}

// Function to add a new site
export function addSite(siteData: Omit<Site, 'id' | 'createdAt'>): Site {
  const newSite = {
    ...siteData,
    id: `site-${sites.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  console.log("Added new site:", newSite);
  return newSite;
}

// Function to add a new block
export function addBlock(blockData: Omit<Block, 'id' | 'createdAt'>): Block {
  const newBlock = {
    ...blockData,
    id: `block-${blocks.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  console.log("Added new block:", newBlock);
  return newBlock;
}

// Function to add a new work order
export function addWorkOrder(orderData: Omit<WorkOrder, 'id' | 'createdAt'>): WorkOrder {
  const newOrder = {
    ...orderData,
    id: `order-${workOrders.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  console.log("Added new work order:", newOrder);
  return newOrder;
}

// Function to add a new worker application
export function addWorkerApplication(applicationData: Omit<WorkerApplication, 'id' | 'createdAt'>): WorkerApplication {
  const newApplication = {
    ...applicationData,
    id: `app-${workerApplications.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  console.log("Added new worker application:", newApplication);
  return newApplication;
}

// Function to add a new worker task
export function addWorkerTask(taskData: Omit<WorkerTask, 'id' | 'completedAt'>): WorkerTask {
  const newTask = {
    ...taskData,
    id: `task-${workerTasks.length + 1}`,
    completedAt: new Date().toISOString()
  };
  
  console.log("Added new worker task:", newTask);
  return newTask;
}

// Function to add or update user settings
export function updateUserSettings(userId: string, settingsData: Partial<Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'>>): UserSettings {
  // Check if settings exist for this user
  const existingSettings = userSettings.find(setting => setting.userId === userId);
  
  if (existingSettings) {
    // Update existing settings
    const updatedSettings = {
      ...existingSettings,
      ...settingsData,
      updatedAt: new Date().toISOString()
    };
    
    console.log("Updated user settings:", updatedSettings);
    return updatedSettings;
  } else {
    // Create new settings
    const newSettings: UserSettings = {
      userId,
      theme: settingsData.theme || 'light',
      emailNotifications: settingsData.emailNotifications ?? true,
      smsNotifications: settingsData.smsNotifications ?? false,
      language: settingsData.language || 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log("Added new user settings:", newSettings);
    return newSettings;
  }
}

// Function to update admin settings
export function updateAdminSettings(settingsData: Partial<AdminSettings>): AdminSettings {
  const updatedSettings = {
    ...adminSettings
  };
  
  if (settingsData.general) {
    updatedSettings.general = {
      ...updatedSettings.general,
      ...settingsData.general
    };
  }
  
  if (settingsData.email) {
    updatedSettings.email = {
      ...updatedSettings.email,
      ...settingsData.email
    };
  }
  
  if (settingsData.security) {
    updatedSettings.security = {
      ...updatedSettings.security,
      ...settingsData.security
    };
  }
  
  if (settingsData.integrations) {
    updatedSettings.integrations = {
      ...updatedSettings.integrations,
      ...settingsData.integrations
    };
  }
  
  console.log("Updated admin settings:", updatedSettings);
  return updatedSettings;
}
