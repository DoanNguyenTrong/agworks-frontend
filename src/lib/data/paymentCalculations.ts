
import { WorkerTask } from "@/lib/types";
import { workOrders } from "./workOrders";
import { workerTasks } from "./workerTasks";

interface PaymentCalculation {
  workerId: string;
  workerName: string;
  taskCount: number;
  totalAmount: number;
  totalHours: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
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
    // Calculate estimated hours (in a real app, this would come from time tracking)
    const estimatedHoursPerTask = workOrder?.expectedHours ? (workOrder.expectedHours / workOrder.neededWorkers) : 4;
    const totalHours = data.tasks * estimatedHoursPerTask;
    
    payments.push({
      workerId,
      workerName: data.name,
      taskCount: data.tasks,
      totalHours: totalHours, // Add hours worked
      totalAmount: Math.round(totalHours * payRate * 100) / 100, // Round to 2 decimal places
      status: workOrder?.status === 'completed' ? 'paid' : 'pending', // Add payment status
      paymentDate: workOrder?.status === 'completed' ? new Date().toISOString() : undefined
    });
  });
  
  return payments;
};
