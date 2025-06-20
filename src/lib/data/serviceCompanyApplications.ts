
import { ServiceCompanyApplication } from "@/lib/types";

export const serviceCompanyApplications: ServiceCompanyApplication[] = [
  {
    id: "sca-1",
    serviceCompanyId: "user-6",
    serviceCompanyName: "Valley Agricultural Services",
    orderId: "order-3",
    status: "pending",
    createdAt: "2023-07-02T08:00:00Z",
    notes: "We have experienced pruning crew available for this date range."
  },
  {
    id: "sca-2", 
    serviceCompanyId: "user-7",
    serviceCompanyName: "Premium Vineyard Services",
    orderId: "order-3",
    status: "accepted",
    createdAt: "2023-07-02T09:00:00Z",
    notes: "Accepted - will assign our best crew for this premium job."
  },
  {
    id: "sca-3",
    serviceCompanyId: "user-6",
    serviceCompanyName: "Valley Agricultural Services", 
    orderId: "order-4",
    status: "rejected",
    createdAt: "2023-07-06T10:00:00Z",
    notes: "Cannot accommodate due to scheduling conflicts."
  }
];
