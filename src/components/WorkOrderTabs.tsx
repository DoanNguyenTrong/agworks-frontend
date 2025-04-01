
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkOrder, WorkerTask } from "@/lib/types";
import { getPaymentCalculations } from "@/lib/data";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

interface WorkOrderTabsProps {
  workOrder: WorkOrder;
  tasks: WorkerTask[];
}

export default function WorkOrderTabs({ workOrder, tasks }: WorkOrderTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const paymentData = getPaymentCalculations(workOrder.id);

  const performanceData = [
    {
      name: format(new Date(workOrder.startDate), "MMM d"),
      tasks: 15,
    },
    {
      name: format(new Date(new Date(workOrder.startDate).getTime() + 86400000), "MMM d"),
      tasks: 24,
    },
    {
      name: format(new Date(new Date(workOrder.startDate).getTime() + 2 * 86400000), "MMM d"),
      tasks: 18,
    },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="completed">Completed Pieces</TabsTrigger>
        <TabsTrigger value="payslip">Payslip</TabsTrigger>
        <TabsTrigger value="details">Order Details</TabsTrigger>
      </TabsList>
      
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {tasks.filter(t => t.status === "approved").length} approved
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Workers Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentData.length}/{workOrder.neededWorkers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((paymentData.length / workOrder.neededWorkers) * 100)}% of capacity
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${paymentData.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                @ ${workOrder.payRate.toFixed(2)} per piece
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
            <CardDescription>Tasks completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Completed Pieces Tab */}
      <TabsContent value="completed" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks with Photo Evidence</CardTitle>
            <CardDescription>All uploaded images from workers</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-square relative bg-muted">
                      <div className="absolute top-2 right-2">
                        <Badge variant={task.status === "approved" ? "default" : task.status === "rejected" ? "destructive" : "secondary"}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </div>
                      <img
                        src={task.imageUrl || "/placeholder.svg"}
                        alt={`Task completed by ${task.workerName}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">{task.workerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(task.completedAt), "MMM d, yyyy h:mm a")}
                      </p>
                      <div className="flex mt-2 gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed tasks yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Payslip Tab */}
      <TabsContent value="payslip">
        <Card>
          <CardHeader>
            <CardTitle>Payment Calculations</CardTitle>
            <CardDescription>Worker earnings based on completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Payment summary for Work Order #{workOrder.id}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker Name</TableHead>
                  <TableHead>Completed Tasks</TableHead>
                  <TableHead>Pay Rate</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentData.length > 0 ? (
                  paymentData.map((payment) => (
                    <TableRow key={payment.workerId}>
                      <TableCell className="font-medium">{payment.workerName}</TableCell>
                      <TableCell>{payment.taskCount}</TableCell>
                      <TableCell>${workOrder.payRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${payment.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No payment data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Order Details Tab */}
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
            <CardDescription>Complete information about this work order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Site Address</h3>
                  <p>{workOrder.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Time Period</h3>
                  <p>{format(new Date(workOrder.startDate), "MMMM d, yyyy")} - {format(new Date(workOrder.endDate), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Work Type</h3>
                  <p>{workOrder.workType.charAt(0).toUpperCase() + workOrder.workType.slice(1)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Pay Rate</h3>
                  <p>${workOrder.payRate.toFixed(2)} per piece</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Workers Needed</h3>
                  <p>{workOrder.neededWorkers}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Expected Hours</h3>
                  <p>{workOrder.expectedHours} hours</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Vineyard Metrics</h3>
                  <p>
                    {workOrder.acres ? `${workOrder.acres} acres, ` : ""}
                    {workOrder.rows ? `${workOrder.rows} rows, ` : ""}
                    {workOrder.vines ? `${workOrder.vines} vines` : ""}
                    {workOrder.vinesPerRow ? `, ${workOrder.vinesPerRow} vines/row` : ""}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge className="mt-1">
                    {workOrder.status.charAt(0).toUpperCase() + workOrder.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {workOrder.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p>{workOrder.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
