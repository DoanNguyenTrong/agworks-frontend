
import { WorkerApplication } from "@/lib/types";

export const workerApplications: WorkerApplication[] = [
  {
    id: "app-1",
    workerId: "user-4",
    workerName: "John Worker",
    orderId: "order-2",
    serviceCompanyId: "user-6", // Adding missing serviceCompanyId
    status: "approved",
    createdAt: "2023-06-26T09:00:00Z"
  },
  {
    id: "app-2",
    workerId: "user-5",
    workerName: "Jane Worker",
    orderId: "order-2",
    serviceCompanyId: "user-6", // Adding missing serviceCompanyId
    status: "approved",
    createdAt: "2023-06-26T10:00:00Z"
  },
  {
    id: "app-3",
    workerId: "user-4",
    workerName: "John Worker",
    orderId: "order-3",
    serviceCompanyId: "user-6", // Adding missing serviceCompanyId
    status: "pending",
    createdAt: "2023-07-02T09:00:00Z"
  },
  {
    id: "app-4",
    workerId: "user-5",
    workerName: "Jane Worker",
    orderId: "order-3",
    serviceCompanyId: "user-7", // Adding missing serviceCompanyId (different service company)
    status: "pending",
    createdAt: "2023-07-02T10:00:00Z"
  }
];
