
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  Camera,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { workerApplications, workOrders, workerTasks, sites, blocks } from "@/lib/data";
import { format } from "date-fns";

export default function WorkerDashboard() {
  const { currentUser } = useAuth();

  // Get worker applications
  const applications = currentUser
    ? workerApplications.filter(app => app.workerId === currentUser.id)
    : [];
  
  // Get approved jobs
  const approvedJobs = applications.filter(app => app.status === "approved");
  const approvedOrderIds = approvedJobs.map(job => job.orderrId);
  const workerOrders = workOrders.filter(order => 
    approvedOrderIds.includes(order.id) && 
    order.status === "inProgress"
  );

  // Get completed tasks
  const completedTasks = currentUser
    ? workerTasks.filter(task => task.workerId === currentUser.id)
    : [];

  // Calculate earnings
  const earnings = completedTasks.reduce((total, task) => {
    const order = workOrders.find(o => o.id === task.orderId);
    if (order && task.status === "approved") {
      return total + order.payRate;
    }
    return total;
  }, 0);

  return (
    <MainLayout pageTitle="Worker Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently assigned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With photo evidence
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From approved tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-6">My Active Jobs</h2>
      
      <div className="space-y-6">
        {workerOrders.length > 0 ? (
          workerOrders.map(order => {
            const site = sites.find(site => site.id === order.siteId);
            const block = blocks.find(block => block.id === order.blockId);
            
            return (
              <Card key={order.id} className="overflow-hidden">
                <div className="p-1 bg-primary/10 border-b"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)} - {block?.name || ""}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {site?.name || ""} • Job #{order.id}
                      </p>
                    </div>
                    <Badge className="w-fit mt-2 md:mt-0">In Progress</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Dates</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Expected Hours</p>
                        <p className="text-sm text-muted-foreground">{order.expectedHours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Pay Rate</p>
                        <p className="text-sm text-muted-foreground">${order.payRate.toFixed(2)} per piece</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="sm:flex-1">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Task Photo
                    </Button>
                    <Button variant="outline" className="sm:flex-1">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      View My Tasks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Jobs</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any active jobs assigned at the moment
            </p>
            <Button>
              Browse Available Jobs
            </Button>
          </div>
        )}
      </div>

      {applications.filter(app => app.status === "pending").length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-6 mt-10">Pending Applications</h2>
          <div className="space-y-4">
            {applications
              .filter(app => app.status === "pending")
              .map(app => {
                const order = workOrders.find(o => o.id === app.orderrId);
                if (!order) return null;
                
                const site = sites.find(site => site.id === order.siteId);
                
                return (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium">
                            {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)} Job
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {site?.name || ""} • Applied on {format(new Date(app.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge variant="outline" className="w-fit mt-2 md:mt-0">
                          Pending Review
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </>
      )}

      {completedTasks.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-6 mt-10">Recent Task Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {completedTasks.slice(0, 8).map(task => (
              <div key={task.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-square relative bg-muted">
                  <div className="absolute top-2 right-2">
                    <Badge variant={task.status === "approved" ? "default" : task.status === "rejected" ? "destructive" : "secondary"}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                  <img
                    src={task.imageUrl || "/placeholder.svg"}
                    alt="Task completion"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">Task #{task.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(task.completedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {completedTasks.length > 8 && (
            <div className="text-center mt-4">
              <Button variant="outline">View All Task Photos</Button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
