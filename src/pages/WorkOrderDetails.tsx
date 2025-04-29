import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import WorkOrderTabs from "@/components/WorkOrderTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, AlertTriangle } from "lucide-react";
import {
  workOrders,
  blocks,
  sites,
  workerTasks,
  getPaymentCalculations,
} from "@/lib/data";
import { WorkOrder, WorkerTask } from "@/lib/types";
import { apiGetWorkOderById } from "@/api/workOrder";
import { get } from "lodash";

export default function WorkOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  console.log("workOrder => ", workOrder);
  useEffect(() => {
    // Get work order data

    const getWorkOder = async () => {
      const { data } = await apiGetWorkOderById({ id });
      setWorkOrder(get(data, "metaData", {}));
    };

    getWorkOder();
  }, [id]);

  if (!workOrder) {
    return (
      <MainLayout pageTitle="Work Order Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Work Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The work order you're looking for doesn't exist or you don't have
              permission to view it.
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
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      case "Published":
        return <Badge variant="secondary">Published</Badge>;
      case "InProgress":
        return <Badge>In Progress</Badge>;
      case "Completed":
        return <Badge className="bg-agworks-green">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            className="p-0 mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Work Order Details</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {workOrder.workType.charAt(0).toUpperCase() +
                  workOrder.workType.slice(1)}{" "}
                - {workOrder.blockId["name"]}
              </h2>
              {getStatusBadge(workOrder.status)}
            </div>
            <p className="text-muted-foreground">
              {workOrder.siteId["name"]} • Order #{workOrder._id}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="mr-2">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button>
              {workOrder.status === "Draft"
                ? "Publish"
                : workOrder.status === "Published"
                ? "Start Work"
                : workOrder.status === "InProgress"
                ? "Complete"
                : "Reopen"}
            </Button>
          </div>
        </div>
      </div>

      <WorkOrderTabs workOrder={workOrder} tasks={tasks} />
    </MainLayout>
  );
}
