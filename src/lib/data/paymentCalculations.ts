
import { WorkerTask } from "@/lib/types";
import { workOrders } from "./workOrders";
import { workerTasks } from "./workerTasks";

interface PaymentCalculation {
  workerId: string;
  workerName: string;
  taskCount: number;
  totalAmount: number;
}

export const getPaymentCalculations = (orderId: string): PaymentCalculation[] => {
  // Filter tasks for the specified work order
  const orderTasks = workerTasks.filter(task => task.orderId === orderId && task.status === "approved");
  
  // Group tasks by worker
  const workerMap = new Map<string, { name: string, tasks: number }>();
  
  orderTasks.forEach(task => {
    if (!workerMap.has(task.workerId)) {
      workerMap.set(task.workerId, {
        name: task.workerName,
        tasks: 0
      });
    }
    
    const workerData = workerMap.get(task.workerId)!;
    workerData.tasks += 1;
  });
  
  // Find the work order to get the pay rate
  const workOrder = workOrders.find(order => order.id === orderId);
  const payRate = workOrder?.payRate || 0;
  
  // Calculate payment for each worker
  const payments: PaymentCalculation[] = [];
  
  workerMap.forEach((data, workerId) => {
    payments.push({
      workerId,
      workerName: data.name,
      taskCount: data.tasks,
      totalAmount: data.tasks * payRate
    });
  });
  
  return payments;
};
