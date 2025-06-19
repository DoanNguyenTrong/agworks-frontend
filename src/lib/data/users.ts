
import { User } from "@/lib/types";

export const users: User[] = [
  {
    id: "user-1",
    email: "admin@agworks.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2023-04-01T08:00:00Z"
  },
  {
    id: "user-2",
    email: "customer@vineyard.com",
    name: "Vineyard Owner",
    role: "customer",
    createdAt: "2023-04-02T09:00:00Z",
    companyName: "Napa Valley Wines",
    phone: "555-123-4567",
    address: "1234 Vine St, Napa, CA 94558",
    logo: "/placeholder.svg"
  },
  {
    id: "user-3",
    email: "manager@vineyard.com",
    name: "Site Manager",
    role: "siteManager",
    createdAt: "2023-04-03T10:00:00Z",
    phone: "555-987-6543",
    customerId: "user-2"
  },
  {
    id: "user-4",
    email: "worker1@example.com",
    name: "John Worker",
    role: "worker",
    createdAt: "2023-04-04T11:00:00Z",
    phone: "555-111-2222",
    profileImage: "/placeholder.svg"
  },
  {
    id: "user-5",
    email: "worker2@example.com",
    name: "Jane Worker",
    role: "worker",
    createdAt: "2023-04-05T12:00:00Z",
    phone: "555-333-4444"
  },
  // Merge site managers from siteManagers.ts
  {
    id: "manager-1",
    email: "michael.johnson@example.com",
    name: "Michael Johnson",
    role: "siteManager",
    phone: "555-123-4567",
    customerId: "user-2",
    profileImage: null,
    createdAt: "2023-04-01T08:00:00Z"
  },
  {
    id: "manager-2",
    email: "sarah.thompson@example.com",
    name: "Sarah Thompson",
    role: "siteManager",
    phone: "555-987-6543",
    customerId: "user-2",
    profileImage: null,
    createdAt: "2023-04-15T09:00:00Z"
  },
  {
    id: "manager-3",
    email: "david.wilson@example.com",
    name: "David Wilson",
    role: "siteManager",
    phone: "555-246-8101",
    customerId: "user-2",
    profileImage: null,
    createdAt: "2023-05-01T10:00:00Z"
  }
];
