import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkerPerformance from "@/components/WorkerPerformance";
import { WorkOrder, WorkerTask } from "@/lib/types";
import { format } from "date-fns";
import { useState } from "react";

interface WorkOrderTabsProps {
  workOrder: WorkOrder;
  tasks: WorkerTask[];
  payments?: any[];
}

export const RenderStatus = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "paid":
      return <Badge className="bg-blue-500">Paid</Badge>;
    default:
      return null;
  }
};

export default function WorkOrderTabs({
  workOrder,
  tasks,
  payments = [],
}: WorkOrderTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  // Group tasks by status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const approvedTasks = tasks.filter((task) => task.status === "approved");
  const rejectedTasks = tasks.filter((task) => task.status === "rejected");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full mb-6">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="tasks">
          Tasks {tasks.length > 0 && `(${tasks.length})`}
        </TabsTrigger>
        <TabsTrigger value="workers">
          Workers{" "}
          {workOrder.neededWorkers > 0 && `(${workOrder.neededWorkers})`}
        </TabsTrigger>
        <TabsTrigger value="payslips">
          Payslips {payments.length > 0 && `(${payments.length})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
            <CardDescription>
              Complete information about this work order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Schedule
                </h3>
                <p className="font-medium">
                  {format(new Date(workOrder.startDate), "MMM d")} -{" "}
                  {format(new Date(workOrder.endDate), "MMM d, yyyy")}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Work Type
                </h3>
                <p className="font-medium capitalize">{workOrder.workType}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </h3>
                <p className="font-medium capitalize">{workOrder.status}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Pay Rate
                </h3>
                <p className="font-medium">${workOrder.payRate}/hour</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Expected Hours
                </h3>
                <p className="font-medium">{workOrder.expectedHours} hours</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Workers Needed
                </h3>
                <p className="font-medium">{workOrder.neededWorkers}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Vineyard Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs text-muted-foreground">Address</h4>
                  <p className="font-medium">{workOrder.address}</p>
                </div>

                <div>
                  <h4 className="text-xs text-muted-foreground">Acres</h4>
                  <p className="font-medium">{workOrder.acres || "—"}</p>
                </div>

                <div>
                  <h4 className="text-xs text-muted-foreground">Rows</h4>
                  <p className="font-medium">{workOrder.rows || "—"}</p>
                </div>

                <div>
                  <h4 className="text-xs text-muted-foreground">Vines</h4>
                  <p className="font-medium">{workOrder.vines || "—"}</p>
                </div>
              </div>
            </div>

            {workOrder.notes && (
              <>
                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Notes
                  </h3>
                  <p>{workOrder.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tasks">
        <Card>
          <CardHeader>
            <CardTitle>Task Submissions</CardTitle>
            <CardDescription>
              Review and manage worker task submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-6">
                {pendingTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Pending Review ({pendingTasks.length})
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Photos</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTasks.map((task) => (
                          <TableRow key={task._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={task.imageUrl} />
                                  <AvatarFallback>
                                    {task.workerName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{task.workerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(task.completedAt),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell>{task.photoUrls.length}</TableCell>
                            <TableCell>{RenderStatus(task.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {approvedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Approved ({approvedTasks.length})
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Photos</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedTasks.map((task) => (
                          <TableRow key={task._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={task.imageUrl} />
                                  <AvatarFallback>
                                    {task.workerName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{task.workerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(task.completedAt),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell>{task.photoUrls.length}</TableCell>
                            <TableCell>{RenderStatus(task.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {rejectedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Rejected ({rejectedTasks.length})
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Photos</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedTasks.map((task) => (
                          <TableRow key={task._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={task.imageUrl} />
                                  <AvatarFallback>
                                    {task.workerName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{task.workerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(task.completedAt),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell>{task.photoUrls.length}</TableCell>
                            <TableCell>{RenderStatus(task.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No task submissions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="workers">
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>
              Track worker productivity and task completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkerPerformance tasks={tasks} payRate={workOrder.payRate} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payslips">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Worker payments for this work order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Completed Tasks</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{payment.workerName}</div>
                      </TableCell>
                      <TableCell>{payment.taskCount}</TableCell>
                      <TableCell>{payment.totalHours}</TableCell>
                      <TableCell>${workOrder.payRate.toFixed(2)}/hr</TableCell>
                      <TableCell>${payment.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{RenderStatus(payment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No payment data available yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
