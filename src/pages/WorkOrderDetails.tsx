
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import WorkOrderTabs from "@/components/WorkOrderTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, AlertTriangle } from "lucide-react";
import { workOrders, blocks, sites, workerTasks, getPaymentCalculations } from "@/lib/data";
import { WorkOrder, WorkerTask } from "@/lib/types";

export default function WorkOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [blockName, setBlockName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [payments, setPayments] = useState<any[]>([]);
  
  useEffect(() => {
    // Get work order data
    const order = workOrders.find(o => o.id === id);
    if (order) {
      setWorkOrder(order);
      
      // Get block and site names
      const block = blocks.find(b => b.id === order.blockId);
      if (block) {
        setBlockName(block.name);
      }
      
      const site = sites.find(s => s.id === order.siteId);
      if (site) {
        setSiteName(site.name);
      }
      
      // Get tasks for this work order
      const orderTasks = workerTasks.filter(t => t.orderId === order.id);
      setTasks(orderTasks);
      
      // Get payment calculations
      if (id) {
        const paymentData = getPaymentCalculations(id);
        setPayments(paymentData);
      }
    }
  }, [id]);
  
  if (!workOrder) {
    return (
      <MainLayout pageTitle="Work Order Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Work Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The work order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: WorkOrder["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "published":
        return <Badge variant="secondary">Published</Badge>;
      case "inProgress":
        return <Badge>In Progress</Badge>;
      case "completed":
        return <Badge className="bg-agworks-green">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Work Order Details</h1>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {workOrder.workType.charAt(0).toUpperCase() + workOrder.workType.slice(1)} - {blockName}
              </h2>
              {getStatusBadge(workOrder.status)}
            </div>
            <p className="text-muted-foreground">
              {siteName} • Order #{workOrder.id}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="mr-2">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button>
              {workOrder.status === "draft" ? "Publish" : 
               workOrder.status === "published" ? "Start Work" : 
               workOrder.status === "inProgress" ? "Complete" : "Reopen"}
            </Button>
          </div>
        </div>
      </div>
      
      <WorkOrderTabs workOrder={workOrder} tasks={tasks} payments={payments} />
    </MainLayout>
  );
}
