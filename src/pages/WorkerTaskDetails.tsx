
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { workerTasks, workOrders, blocks, sites } from "@/lib/data";
import { WorkerTask, WorkOrder, Block, Site } from "@/lib/types";
import { format } from "date-fns";

export default function WorkerTaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<WorkerTask | null>(null);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [block, setBlock] = useState<Block | null>(null);
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    if (taskId) {
      // Find the task
      const foundTask = workerTasks.find(task => task.id === taskId);
      setTask(foundTask || null);

      if (foundTask) {
        // Find related work order
        const foundOrder = workOrders.find(order => order.id === foundTask.orderId);
        setWorkOrder(foundOrder || null);

        if (foundOrder) {
          // Find related block
          const foundBlock = blocks.find(block => block.id === foundOrder.blockId);
          setBlock(foundBlock || null);

          // Find related site
          const foundSite = sites.find(site => site.id === foundOrder.siteId);
          setSite(foundSite || null);
        }
      }
    }
  }, [taskId]);

  if (!task) {
    return (
      <MainLayout pageTitle="Task Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-4">Task not found</h2>
          <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate("/worker/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-agworks-green">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout pageTitle="Task Details">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/worker/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">Task {task.id}</CardTitle>
                  <div className="mt-2">{getStatusBadge(task.status)}</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Completed on</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{format(new Date(task.completedAt), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Task Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {task.photoUrls.length > 0 ? (
                  task.photoUrls.map((url, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden">
                      <img src={url} alt={`Task photo ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 text-muted-foreground">
                    No photos uploaded
                  </div>
                )}
              </div>
              
              {workOrder && (
                <>
                  <Separator className="my-6" />
                  <h3 className="font-medium mb-4">Work Order Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-agworks-green" />
                      <div>
                        <p className="font-medium">Work Type</p>
                        <p className="text-muted-foreground">
                          {workOrder.workType.charAt(0).toUpperCase() + workOrder.workType.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 mt-0.5 text-agworks-green" />
                      <div>
                        <p className="font-medium">Schedule</p>
                        <p className="text-muted-foreground">
                          {format(new Date(workOrder.startDate), "MMM d")} - {format(new Date(workOrder.endDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5 text-agworks-green" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{workOrder.address}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {site && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vineyard</p>
                    <p className="font-medium">{site.name}</p>
                  </div>
                )}
                
                {block && (
                  <div>
                    <p className="text-sm text-muted-foreground">Block</p>
                    <p className="font-medium">{block.name}</p>
                  </div>
                )}
                
                {workOrder && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Pay Rate</p>
                      <p className="font-medium">${workOrder.payRate.toFixed(2)}/hour</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Hours</p>
                      <p className="font-medium">{workOrder.expectedHours} hours</p>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground">Worker</p>
                  <p className="font-medium">{task.workerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
