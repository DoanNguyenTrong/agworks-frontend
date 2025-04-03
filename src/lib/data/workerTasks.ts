
import { WorkerTask } from "@/lib/types";

export const workerTasks: WorkerTask[] = [
  {
    id: "task-1",
    workerId: "user-4",
    workerName: "John Worker",
    orderId: "order-1",
    photoUrls: ["/placeholder.svg", "/placeholder.svg"],
    imageUrl: "/placeholder.svg",
    completedAt: "2023-06-17T15:00:00Z",
    status: "approved"
  },
  {
    id: "task-2",
    workerId: "user-5",
    workerName: "Jane Worker",
    orderId: "order-1",
    photoUrls: ["/placeholder.svg"],
    imageUrl: "/placeholder.svg",
    completedAt: "2023-06-18T14:00:00Z",
    status: "approved"
  },
  {
    id: "task-3",
    workerId: "user-4",
    workerName: "John Worker",
    orderId: "order-2",
    photoUrls: ["/placeholder.svg"],
    imageUrl: "/placeholder.svg",
    completedAt: "2023-07-02T16:00:00Z",
    status: "pending"
  },
  {
    id: "task-4",
    workerId: "user-5",
    workerName: "Jane Worker",
    orderId: "order-2",
    photoUrls: [],
    imageUrl: "/placeholder.svg",
    completedAt: "2023-07-03T15:00:00Z",
    status: "rejected"
  }
];
