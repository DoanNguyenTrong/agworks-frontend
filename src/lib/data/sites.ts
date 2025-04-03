
import { Site } from "@/lib/types";

export const sites: Site[] = [
  {
    id: "site-1",
    name: "North Hill Vineyard",
    address: "1234 North Hill Rd, Napa, CA 94558",
    customerId: "user-2",
    managerId: "user-3",
    createdAt: "2023-05-01T09:00:00Z"
  },
  {
    id: "site-2",
    name: "South Valley Vineyard",
    address: "5678 South Valley Ave, Sonoma, CA 95476",
    customerId: "user-2",
    createdAt: "2023-05-15T10:00:00Z"
  },
  {
    id: "site-3",
    name: "East Ridge Vineyard",
    address: "9012 East Ridge Dr, Calistoga, CA 94515",
    customerId: "user-2",
    createdAt: "2023-06-01T11:00:00Z"
  }
];
