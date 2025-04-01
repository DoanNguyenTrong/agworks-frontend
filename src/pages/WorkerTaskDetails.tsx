
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { workerApplications, workerTasks, workOrders } from "@/lib/data";
import { format } from "date-fns";

export default function WorkerTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find task and related work order
    const foundTask = workerTasks.find(task => task.id === id);
    
    if (foundTask) {
      setTask(foundTask);
      const foundOrder = workOrders.find(order => order.id === foundTask.orderId);
      if (foundOrder) {
        setWorkOrder(foundOrder);
        
        // Find application
        if (currentUser) {
          const foundApplication = workerApplications.find(
            app => app.workerId === currentUser.id && app.orderrId === foundOrder.id
          );
          if (foundApplication) {
            setApplication(foundApplication);
          }
        }
      }
    }
    
    setIsLoading(false);
  }, [id, currentUser]);

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

  // Calculate total earnings
  const photoCount = task.photoUrls ? task.photoUrls.length : 0;
  const totalEarnings = photoCount * workOrder.payRate;
  
  // Get task status
  const getStatus = () => {
    if (!application) return "registered";
    
    if (application.status === "approved") {
      if (workOrder.status === "inProgress") return "working";
      if (workOrder.status === "completed") return "worked";
    }
    
    return application.status;
  };
  
  const status = getStatus();

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
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">
                  {workOrder.workType} - {format(new Date(workOrder.startDate), "MMMM d, yyyy")}
                </CardTitle>
                <Badge 
                  variant={
                    status === "worked" ? "success" : 
                    status === "working" ? "default" :
                    status === "approved" ? "outline" : 
                    "secondary"
                  }
                >
                  {status}
                </Badge>
              </div>
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
                  <p className="text-muted-foreground">${workOrder.payRate.toFixed(2)} per photo</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Task Completion</p>
                <div className="flex items-center justify-between">
                  <p>Completed at: {format(new Date(task.completedAt), "MMMM d, yyyy h:mm a")}</p>
                  <div className="text-right">
                    <p className="font-semibold">Total Earnings</p>
                    <p className="text-xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {photoCount} photos × ${workOrder.payRate.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Task Photos ({photoCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.photoUrls && task.photoUrls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {task.photoUrls.map((url: string, index: number) => (
                    <div key={index} className="overflow-hidden rounded-md border bg-muted/50">
                      <img 
                        src={url} 
                        alt={`Task completion evidence ${index + 1}`} 
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No photos uploaded yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
