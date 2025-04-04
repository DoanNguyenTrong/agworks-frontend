import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Check, X, Clock, DollarSign, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WorkOrder, WorkerTask } from "@/lib/types";
import { getPaymentCalculations } from "@/lib/data";
import WorkerPerformance from "@/components/WorkerPerformance";

interface WorkOrderTabsProps {
  workOrder: WorkOrder;
  tasks: WorkerTask[];
}

export default function WorkOrderTabs({ workOrder, tasks }: WorkOrderTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const paymentCalculations = getPaymentCalculations(workOrder.id);
  
  const handleApproveTask = (taskId: string) => {
    toast({
      title: "Task approved",
      description: "The task has been approved for payment.",
    });
  };
  
  const handleRejectTask = (taskId: string) => {
    toast({
      title: "Task rejected",
      description: "The task has been rejected.",
    });
  };
  
  const completeWorkOrder = () => {
    toast({
      title: "Work order completed",
      description: "The work order has been marked as completed.",
    });
  };

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:w-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Completed Tasks</TabsTrigger>
        <TabsTrigger value="payslip">Payslip</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="workers" className="hidden md:block">Workers</TabsTrigger>
      </TabsList>
      
      {/* Overview Tab */}
      <TabsContent value="overview">
        <WorkerPerformance id={workOrder.id} tasks={tasks} payRate={workOrder.payRate} />
      </TabsContent>
      
      {/* Tasks Tab */}
      <TabsContent value="tasks">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-muted cursor-pointer"
                  onClick={() => setSelectedImage(task.imageUrl)}>
                  <img 
                    src={task.imageUrl} 
                    alt="Task evidence" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={
                      task.status === "approved" ? "bg-green-500" : 
                      task.status === "rejected" ? "bg-red-500" :
                      "bg-yellow-500"
                    }>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{task.workerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.completedAt), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                    {task.status === "pending" && (
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 text-green-500"
                          onClick={() => handleApproveTask(task.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 text-red-500"
                          onClick={() => handleRejectTask(task.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Completed Tasks</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Workers haven't submitted any completed tasks for this work order yet.
              </p>
            </div>
          )}
        </div>
        
        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Task Image</DialogTitle>
            </DialogHeader>
            <div className="overflow-hidden rounded-md">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Task evidence" 
                  className="w-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>
      
      {/* Payslip Tab */}
      <TabsContent value="payslip">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Payment Calculations</CardTitle>
                <CardDescription>
                  Pay amounts based on completed and approved tasks
                </CardDescription>
              </div>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                Export Payroll
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Completed Tasks</TableHead>
                  <TableHead>Pay Rate</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentCalculations.length > 0 ? (
                  paymentCalculations.map((payment) => (
                    <TableRow key={payment.workerId}>
                      <TableCell className="font-medium">{payment.workerName}</TableCell>
                      <TableCell>{payment.taskCount}</TableCell>
                      <TableCell>${workOrder.payRate.toFixed(2)} per task</TableCell>
                      <TableCell className="text-right font-bold">${payment.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No payment data available
                    </TableCell>
                  </TableRow>
                )}
                {paymentCalculations.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Total Payment</TableCell>
                    <TableCell className="text-right font-bold">
                      ${paymentCalculations.reduce((sum, payment) => sum + payment.totalAmount, 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Details Tab */}
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Basic Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Work Type:</dt>
                    <dd className="font-medium">
                      {workOrder.workType.charAt(0).toUpperCase() + workOrder.workType.slice(1)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Start Date:</dt>
                    <dd className="font-medium">{format(new Date(workOrder.startDate), "MMMM d, yyyy")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">End Date:</dt>
                    <dd className="font-medium">{format(new Date(workOrder.endDate), "MMMM d, yyyy")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status:</dt>
                    <dd>
                      <Badge variant={
                        workOrder.status === "completed" ? "default" : 
                        workOrder.status === "cancelled" ? "destructive" : 
                        "secondary"
                      }>
                        {workOrder.status.charAt(0).toUpperCase() + workOrder.status.slice(1)}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Work Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Expected Hours:</dt>
                    <dd className="font-medium">{workOrder.expectedHours} hours</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Needed Workers:</dt>
                    <dd className="font-medium">{workOrder.neededWorkers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pay Rate:</dt>
                    <dd className="font-medium">${workOrder.payRate.toFixed(2)} per task</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Address:</dt>
                    <dd className="font-medium text-right">{workOrder.address}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-4">Block Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Acres:</dt>
                    <dd className="font-medium">{workOrder.acres || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rows:</dt>
                    <dd className="font-medium">{workOrder.rows || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Vines:</dt>
                    <dd className="font-medium">{workOrder.vines || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Vines Per Row:</dt>
                    <dd className="font-medium">{workOrder.vinesPerRow || "—"}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="font-medium mb-4">Notes</h3>
                {workOrder.notes ? (
                  <Textarea value={workOrder.notes} readOnly className="h-32" />
                ) : (
                  <div className="border rounded-md h-32 flex items-center justify-center text-muted-foreground">
                    No notes provided
                  </div>
                )}
              </div>
            </div>
            
            {workOrder.status === "inProgress" && (
              <div className="flex justify-end pt-4">
                <Button onClick={completeWorkOrder}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Workers Tab */}
      <TabsContent value="workers">
        <Card>
          <CardHeader>
            <CardTitle>Worker Management</CardTitle>
            <CardDescription>
              Manage workers assigned to this work order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Approved Workers</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Completed Tasks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>John Worker</TableCell>
                      <TableCell>{format(new Date(), "MMM d, yyyy")}</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Remove</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jane Worker</TableCell>
                      <TableCell>{format(new Date(), "MMM d, yyyy")}</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Remove</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Pending Applications</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Sam Worker</TableCell>
                      <TableCell>{format(new Date(), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-green-500">
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  View Time Records
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
