import { BASE_URL } from "@/api/config";
import { apiChangeStatusTask } from "@/api/workerTask";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import WorkerPerformance from "@/components/WorkerPerformance";
import { toast } from "@/hooks/use-toast";
import { getPaymentCalculations } from "@/lib/data";
import { WorkOrder, WorkerApplication, WorkerTask } from "@/lib/types";
import { StatusType } from "@/lib/utils/constant";
import dayjs from "dayjs";
import { get } from "lodash";
import { Check, Clock, DollarSign, ImageIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkOrderTabsProps {
  workOrder: WorkOrder;
  tasks: WorkerTask[];
  worker: WorkerApplication[];
  image: any[];
  fetchData?: () => void;
}

export default function WorkOrderTabs({
  workOrder,
  tasks,
  worker,
  image,
  fetchData = () => {},
}: WorkOrderTabsProps) {
  const listTasks = tasks;
  const listImage = image;
  const [activeTab, setActiveTab] = useState("overview");
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const paymentCalculations = getPaymentCalculations(workOrder._id);

  const handleApproveTask = async (taskId: string) => {
    try {
      const res = await apiChangeStatusTask(
        {
          status: StatusType.APPROVED,
        },
        taskId
      );
      console.log("res :>> ", res);
      toast({
        title: "Task approved",
        description: "The task has been approved for payment.",
      });
      fetchData();
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleRejectTask = async (taskId: string) => {
    try {
      const res = await apiChangeStatusTask(
        {
          status: StatusType.REJECTED,
        },
        taskId
      );
      console.log("res :>> ", res);
      toast({
        title: "Task rejected",
        description: "The task has been rejected.",
      });
      fetchData();
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      await apiChangeStatusTask(
        {
          status: StatusType.PENDING,
        },
        taskId
      );
      toast({
        title: "Task remove",
        description: "The task has been remove.",
      });
      fetchData();
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const completeWorkOrder = () => {
    toast({
      title: "Work order completed",
      description: "The work order has been marked as completed.",
    });
  };

  useEffect(() => {
    if (tasks.length > 0 && image.length > 0) {
      let earnings = 0;
      const listImage = image;
      listImage.forEach((image: any) => {
        const currentTask = tasks.filter((t) => t?._id === image?.taskId?._id);
        if (currentTask) {
          earnings += get(currentTask, "[0]orderId.payRate", 0);
        }
      });
      setTotalEarnings(earnings);
    }
  }, [tasks, image]);

  return (
    <Tabs
      defaultValue="overview"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:w-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Completed Tasks</TabsTrigger>
        <TabsTrigger value="payslip">Payslip</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="workers" className="hidden md:block">
          Workers
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <WorkerPerformance
          image={listImage}
          tasks={tasks}
          worker={worker}
          payRate={totalEarnings}
        />
      </TabsContent>

      {/* Tasks Tab */}
      <TabsContent value="tasks">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listImage.length > 0 ? (
            listImage.map((image) => (
              <div key={image._id}>
                <Card className="overflow-hidden">
                  <div
                    className="relative aspect-video overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={`${BASE_URL}${image.imageData}`}
                      alt="Task evidence"
                      className="object-cover w-full h-full"
                    />
                    {/* <div className="absolute top-2 right-2">
                        <Badge
                          className={
                            task.status === "approved"
                              ? "bg-green-500"
                              : task.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }
                        >
                          {task.status.charAt(0).toUpperCase() +
                            task.status.slice(1)}
                        </Badge>
                      </div> */}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">
                          {get(image, "fileName", "-")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dayjs(image.timestamp).format("YYYY/MM/DD HH:mm")}
                        </p>
                      </div>
                      {/* {task.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-green-500"
                              onClick={() => handleApproveTask(task._id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => handleRejectTask(task._id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )} */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Completed Tasks</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Workers haven't submitted any completed tasks for this work
                order yet.
              </p>
            </div>
          )}
        </div>

        {/* Image Preview Dialog */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
        >
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
                {listTasks.filter((t) => t.status === StatusType.APPROVED)
                  .length > 0 ? (
                  listTasks
                    .filter((t) => t.status === StatusType.APPROVED)
                    .map((task) => (
                      <TableRow key={`${task._id}`}>
                        <TableCell className="font-medium">
                          {get(task, "workerId.name", "-")}
                        </TableCell>
                        <TableCell>
                          {
                            listImage.filter(
                              (image) =>
                                get(image, "taskId.workerId") ===
                                get(task, "workerId._id")
                            ).length
                          }
                        </TableCell>
                        <TableCell>
                          ${get(task, "orderId.payRate")} per task
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          $
                          {(
                            listImage.filter(
                              (image) =>
                                get(image, "taskId.workerId") ===
                                get(task, "workerId._id")
                            ).length * get(task, "orderId.payRate", 1)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No payment data available
                    </TableCell>
                  </TableRow>
                )}
                {listTasks.filter((t) => t.status === StatusType.APPROVED)
                  .length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total Payment
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      $
                      {listTasks
                        .filter((t) => t.status === StatusType.APPROVED)
                        .reduce(
                          (sum, task) =>
                            sum +
                            get(task, "orderId.payRate", 1) *
                              listImage.filter(
                                (image) =>
                                  get(image, "taskId.workerId") ===
                                  get(task, "workerId._id")
                              ).length,
                          0
                        )
                        .toFixed(2)}
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
                      {workOrder.workType.charAt(0).toUpperCase() +
                        workOrder.workType.slice(1)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Start Date:</dt>
                    <dd className="font-medium">
                      {dayjs(workOrder.startDate).format("YYYY/MM/DD-HH:mm")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">End Date:</dt>
                    <dd className="font-medium">
                      {dayjs(workOrder.endDate).format("YYYY/MM/DD-HH:mm")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status:</dt>
                    <dd>
                      <Badge
                        variant={
                          workOrder.status === "Completed"
                            ? "default"
                            : workOrder.status === "Cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {workOrder.status.charAt(0).toUpperCase() +
                          workOrder.status.slice(1)}
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
                    <dd className="font-medium">
                      {workOrder.expectedHours ? workOrder.expectedHours : ""}
                      hours
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Needed Workers:</dt>
                    <dd className="font-medium">{workOrder.neededWorkers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pay Rate:</dt>
                    <dd className="font-medium">
                      ${workOrder?.payRate.toFixed(2)} per task
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Address:</dt>
                    <dd className="font-medium text-right">
                      {get(workOrder, "siteId.address", "-")}
                    </dd>
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
                    <dd className="font-medium">
                      {workOrder.vinesPerRow || "—"}
                    </dd>
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

            {workOrder.status === "InProgress" && (
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
                    {listTasks.filter((t) => t.status === StatusType.APPROVED)
                      .length > 0 ? (
                      listTasks
                        .filter((t) => t.status === StatusType.APPROVED)
                        .map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{get(item, "workerId.name")}</TableCell>
                            <TableCell>
                              {dayjs(get(item, "createdAt")).format(
                                "YYYY/MM/DD HH:mm"
                              )}
                            </TableCell>
                            <TableCell>
                              {
                                listImage.filter(
                                  (image) =>
                                    get(image, "taskId.workerId") ===
                                    get(item, "workerId._id")
                                ).length
                              }
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveTask(item._id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No data.
                        </TableCell>
                      </TableRow>
                    )}
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
                    {listTasks.filter((t) => t.status === StatusType.PENDING)
                      .length > 0 ? (
                      listTasks
                        .filter((t) => t.status === StatusType.PENDING)
                        .map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{get(item, "workerId.name")}</TableCell>
                            <TableCell>
                              {dayjs(get(item, "createdAt")).format(
                                "YYYY/MM/DD HH:mm"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-500"
                                  onClick={() => handleApproveTask(item._id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => handleRejectTask(item._id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No data.
                        </TableCell>
                      </TableRow>
                    )}
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
