
import { SiteManager } from "@/lib/types";

export const siteManagers: SiteManager[] = [
  {
    id: "manager-1",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "555-123-4567",
    customerId: "user-2",
    profileImage: null,
    createdAt: "2023-04-01T08:00:00Z"
  },
  {
    id: "manager-2",
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    phone: "555-987-6543",
    customerId: "user-2",
    profileImage: null,
    createdAt: "2023-04-15T09:00:00Z"
  },
  {
    id: "user-3",
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "555-246-8101",
    customerId: "user-2",
    profileImage: null,
    createdAt: "2023-05-01T10:00:00Z"
  }
];
