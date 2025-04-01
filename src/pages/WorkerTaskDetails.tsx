
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, MapPin, Layers, CheckCircle2, 
  XCircle, AlertCircle, ArrowLeft, Download, Camera
} from "lucide-react";
import { workerTasks, workOrders, sites, blocks } from "@/lib/data";
import { format } from "date-fns";

export default function WorkerTaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [site, setSite] = useState<any>(null);
  const [block, setBlock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find task
    const foundTask = workerTasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      
      // Find related work order
      const foundOrder = workOrders.find(o => o.id === foundTask.orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Find related site and block
        const foundSite = sites.find(s => s.id === foundOrder.siteId);
        const foundBlock = blocks.find(b => b.id === foundOrder.blockId);
        
        setSite(foundSite);
        setBlock(foundBlock);
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

  if (!task || !order) {
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

  const getStatusIcon = () => {
    switch (task.status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case "approved":
        return "This task has been approved";
      case "rejected":
        return "This task has been rejected";
      default:
        return "This task is pending review";
    }
  };

  return (
    <MainLayout pageTitle="Task Details">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/worker/tasks")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tasks
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{order.workType.charAt(0).toUpperCase() + order.workType.slice(1)} Task</CardTitle>
                  <CardDescription>
                    Completed on {format(new Date(task.completedAt), "MMMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </div>
                <Badge variant={
                  task.status === "approved" ? "default" : 
                  task.status === "rejected" ? "destructive" : 
                  "secondary"
                } className="ml-2">
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg flex items-center gap-3 mb-6 bg-muted/50">
                {getStatusIcon()}
                <p className="text-sm">{getStatusText()}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.completedAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.completedAt), "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {site?.name} {block ? `- ${block.name}` : ""}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Work Type</p>
                      <p className="text-sm text-muted-foreground">
                        {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-3">Task Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {task.notes || "No notes provided for this task."}
                </p>
              </div>
              
              {task.status === "rejected" && task.rejectionReason && (
                <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-red-700 mb-2">Rejection Reason</h3>
                  <p className="text-sm text-red-700">
                    {task.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/worker/tasks")}>
                Back to Tasks
              </Button>
              {task.status === "approved" && (
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Photo</CardTitle>
              <CardDescription>
                Photo evidence of completed work
              </CardDescription>
            </CardHeader>
            <CardContent>
              {task.imageUrl ? (
                <div className="aspect-square rounded-md overflow-hidden bg-muted relative">
                  <img 
                    src={task.imageUrl} 
                    alt="Task completion" 
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md overflow-hidden bg-muted flex flex-col items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No photo available</p>
                </div>
              )}
            </CardContent>
            {task.imageUrl && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Photo
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                Payment details for this task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base Rate</span>
                  <span className="font-medium">${order.payRate.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-medium">
                  <span>Total Earnings</span>
                  {task.status === "approved" ? (
                    <span className="text-lg">${order.payRate.toFixed(2)}</span>
                  ) : (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {task.status === "approved" 
                    ? "Payment has been approved and processed" 
                    : "Payment will be processed after approval"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
