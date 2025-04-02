
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Pencil, AlertTriangle, Calendar, Users, DollarSign, Timer } from "lucide-react";
import { WorkOrder, WorkerTask, Block, Site } from "@/lib/types";
import { fetchWorkOrderById, fetchWorkerTasks, fetchBlockById, fetchSiteById } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function WorkOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Load work order data
        const orderData = await fetchWorkOrderById(id);
        
        if (orderData) {
          setWorkOrder(orderData);
          
          // Load block and site data
          const blockData = await fetchBlockById(orderData.blockId);
          if (blockData) {
            setBlock(blockData);
          }
          
          const siteData = await fetchSiteById(orderData.siteId);
          if (siteData) {
            setSite(siteData);
          }
          
          // Load tasks for this work order
          // Pass an object with orderId property instead of just a string
          const tasksData = await fetchWorkerTasks({ orderId: orderData.id });
          setTasks(tasksData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load work order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center p-8">
          <p>Loading work order details...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!workOrder || !id) {
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
      <div className="mb-6">
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
                {workOrder.workType.charAt(0).toUpperCase() + workOrder.workType.slice(1)} - {block?.name}
              </h2>
              {getStatusBadge(workOrder.status)}
            </div>
            <p className="text-muted-foreground">
              {site?.name} • Order #{workOrder.id}
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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-muted-foreground">Dates</p>
            </div>
            <div className="mt-2">
              <p>Start: {new Date(workOrder.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(workOrder.endDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-muted-foreground">Workers</p>
            </div>
            <div className="mt-2">
              <p className="text-xl font-semibold">{workOrder.neededWorkers}</p>
              <p>Required workers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-muted-foreground">Pay Rate</p>
            </div>
            <div className="mt-2">
              <p className="text-xl font-semibold">${workOrder.payRate.toFixed(2)}</p>
              <p>Per hour</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Timer className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-muted-foreground">Estimated Time</p>
            </div>
            <div className="mt-2">
              <p className="text-xl font-semibold">{workOrder.expectedHours}</p>
              <p>Hours expected</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Details section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <p className="text-muted-foreground">{workOrder.address}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Block Information</h3>
              <ul className="text-muted-foreground">
                {workOrder.acres && <li>Acres: {workOrder.acres}</li>}
                {workOrder.rows && <li>Rows: {workOrder.rows}</li>}
                {workOrder.vines && <li>Vines: {workOrder.vines}</li>}
                {workOrder.vinesPerRow && <li>Vines per Row: {workOrder.vinesPerRow}</li>}
              </ul>
            </div>
          </div>
          
          {workOrder.notes && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{workOrder.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Worker Tasks section */}
      <Card>
        <CardHeader>
          <CardTitle>Worker Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground">No worker tasks assigned yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium">{task.workerName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={task.status === "approved" ? "success" : "outline"}>
                        {task.status === "approved" ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
