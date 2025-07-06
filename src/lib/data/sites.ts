
import { Site } from "@/lib/types";

export const sites: Site[] = [
  {
    _id: "site-1",
    name: "North Hill Vineyard",
    address: "151 First St W, Sonoma, CA  95476",
    customerId: "customer-1",
    managerId: "manager-1", // Jane Smith
    locationType: "vineyard",
    description: "Premium wine grape vineyard with excellent soil conditions",
    createdAt: "2023-05-01T09:00:00Z"
  },
  {
    _id: "site-2",
    name: "South Valley Vineyard",
    address: "5678 South Valley Ave, Sonoma, CA 95476",
    customerId: "customer-1",
    managerId: "manager-2", // Robert Johnson
    locationType: "vineyard",
    description: "Family-owned vineyard specializing in Chardonnay and Pinot Noir",
    createdAt: "2023-05-15T10:00:00Z"
  },
  {
    _id: "site-3",
    name: "East Ridge Vineyard",
    address: "9012 East Ridge Dr, Calistoga, CA 94515",
    customerId: "customer-1",
    managerId: "manager-3", // Michelle Davis
    locationType: "vineyard",
    description: "High-altitude vineyard with panoramic valley views",
    createdAt: "2023-06-01T11:00:00Z"
  },
  {
    _id: "site-4",
    name: "Corporate Office",
    address: "123 Business Park Dr, Napa, CA 94559",
    customerId: "customer-1",
    locationType: "office",
    description: "Main administrative office and tasting room",
    createdAt: "2023-04-15T08:00:00Z"
  }
];
