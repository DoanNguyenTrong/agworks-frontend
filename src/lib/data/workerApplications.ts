
import { WorkerApplication } from "@/lib/types";

export const workerApplications: WorkerApplication[] = [
  {
    id: "app-1",
    workerId: "user-4",
    workerName: "John Worker",
    orderId: "order-2", // Fixed from orderrId to orderId
    status: "approved",
    createdAt: "2023-06-26T09:00:00Z"
  },
  {
    id: "app-2",
    workerId: "user-5",
    workerName: "Jane Worker",
    orderId: "order-2", // Fixed from orderrId to orderId
    status: "approved",
    createdAt: "2023-06-26T10:00:00Z"
  },
  {
    id: "app-3",
    workerId: "user-4",
    workerName: "John Worker",
    orderId: "order-3", // Fixed from orderrId to orderId
    status: "pending",
    createdAt: "2023-07-02T09:00:00Z"
  },
  {
    id: "app-4",
    workerId: "user-5",
    workerName: "Jane Worker",
    orderId: "order-3", // Fixed from orderrId to orderId
    status: "pending",
    createdAt: "2023-07-02T10:00:00Z"
  }
];
