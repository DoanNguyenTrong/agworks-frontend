import { User } from "@/lib/types";
// ['Admin', 'Customer', 'SiteManager', 'Worker']
export const MAP_ROLE = {
    ADMIN: "Admin",
    CUSTOMER: "Customer",
    SITE_MANAGER: "SiteManager",
    WORKER: "Worker",
    EMPLOYEE: "Employee"
}

export const PERMISSION_EMPLOYEE = {
    VIEW_SITES: "view_sites",
    MANAGE_SITES: "manage_sites",
    CREATE_WORK_ORDERS: "create_work_orders",
    MANAGE_WORK_ORDERS: "manage_work_orders",
    VIEW_EMPLOYEES: "view_employees",
    MANAGE_EMPLOYEES: "manage_employees",
    VIEW_TASKS: "view_tasks",
    COMPLETE_TASKS: "complete_tasks",
    ASSIGN_TASKS: "assign_tasks",
    APPROVE_WORK: "approve_work",
    VIEW_REPORTS: "view_reports",
    MANAGE_CALENDAR: "manage_calendar",
    UPLOAD_PHOTOS: "upload_photos",
    LOG_TIME: "log_time",
    MANAGE_TEAM: "manage_team",
    VIEW_CALENDAR: "view_calendar",
}

export const checkRoleInPermissions = (permissions: string[], roles: string[]) => {
    for (let index = 0; index < permissions.length; index++) {
        if (roles.includes(permissions[index])) return true;
    }
    return false;
}

export const isPermissionCustomerOrEmployee = (currentUser: User, permissions: string[], keyPermission: string) => {
    if ([MAP_ROLE.CUSTOMER, MAP_ROLE.ADMIN].includes(currentUser.role)) return true;
    return currentUser.role == MAP_ROLE.EMPLOYEE && permissions.includes(keyPermission);
}