
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { workerTasks, workOrders } from "@/lib/data";
import { format } from "date-fns";

export default function WorkerTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find task and related work order
    const foundTask = workerTasks.find(task => task.id === id);
    
    if (foundTask) {
      setTask(foundTask);
      const foundOrder = workOrders.find(order => order.id === foundTask.orderId);
      if (foundOrder) {
        setWorkOrder(foundOrder);
      }
    }
    
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout pageTitle="Task Details">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!task || !workOrder) {
    return (
      <MainLayout pageTitle="Task Details">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Task not found</p>
          <Button onClick={() => navigate("/worker/tasks")}>
            Back to Tasks
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Verify this task belongs to the current worker
  if (task.workerId !== currentUser?.id) {
    return (
      <MainLayout pageTitle="Task Details">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">You don't have permission to view this task</p>
          <Button onClick={() => navigate("/worker/tasks")}>
            Back to Tasks
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Task Details">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/worker/tasks")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">
                {workOrder.workType} - {format(new Date(workOrder.startDate), "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{workOrder.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Work Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(workOrder.startDate), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Work Hours</p>
                  <p className="text-muted-foreground">
                    {format(new Date(workOrder.startDate), "h:mm a")} to {format(new Date(workOrder.endDate), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Pay Rate</p>
                  <p className="text-muted-foreground">${workOrder.payRate.toFixed(2)} per row/vine (depending on work type)</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Task Completion</p>
                <div className="flex items-center gap-2">
                  <p>Status:</p>
                  <Badge 
                    variant={task.status === "approved" ? "success" : 
                            task.status === "pending" ? "outline" : "secondary"}
                  >
                    {task.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2">
                  Completed at: {format(new Date(task.completedAt), "MMMM d, yyyy h:mm a")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Task Photo</CardTitle>
            </CardHeader>
            <CardContent>
              {task.imageUrl ? (
                <div className="overflow-hidden rounded-md">
                  <img 
                    src={task.imageUrl} 
                    alt="Task completion evidence" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No image available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
