import { apiGetAllImage } from "@/api/image";
import { apiGetAllWorkerTask } from "@/api/workerTask";
import { apiGetAllWorkOrder } from "@/api/workOrder";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { WorkerApplication } from "@/lib/types";
import { StatusType } from "@/lib/utils/constant";
import { format } from "date-fns";
import dayjs from "dayjs";
import { get } from "lodash";
import { CalendarDays, Clock, MapPin, PlusCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export default function SiteManagerDashboard() {
  const { currentUser } = useAuth();
  const [pendingApplications, setPendingApplications] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [workOrder, setWorkOrder] = useState([]);
  const [task, setTask] = useState([]);

  const getDataTask = async (payload: string[]) => {
    try {
      if (payload.length > 0) {
        const { data } = await apiGetAllWorkerTask({
          filter: { orderId: payload },
        });
        // console.log("data :>> ", data);
        const tasks = get(data, "metaData", []);
        setTask(tasks);
        // Total tasks
        setTotalTasks(tasks.length);

        // Calculate total earnings from all completed tasks
        let earnings = 0;
        const res = await apiGetAllImage({
          filter: {
            taskId: tasks
              // .filter(
              //   (app: WorkerApplication) => app.status !== StatusType.PENDING
              // )
              .map((t: any) => t?._id),
          },
        });
        const listImage = get(res, "data.metaData", []);
        await listImage.forEach((image: any) => {
          const currentTask = tasks.filter(
            (t) => t?._id === image?.taskId?._id
          );
          if (currentTask) {
            earnings += get(currentTask, "[0]orderId.payRate", 0);
          }
        });
        setTotalEarnings(earnings);

        const pending = tasks.filter(
          (app: WorkerApplication) => app.status === StatusType.PENDING
        ).length;
        setPendingApplications(pending);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    // Find the site managed by this user
    const getDataWorkOrder = async () => {
      try {
        const { data } = await apiGetAllWorkOrder({ number_of_page: 10 });
        setWorkOrder(get(data, "metaData", []));
        const payload: string[] = get(data, "metaData", []).map((i) =>
          get(i, "_id", "")
        );

        getDataTask(payload);
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    getDataWorkOrder();
  }, [currentUser]);

  // Get active work orders for the manager's site
  const activeOrders =
    workOrder.filter((order) =>
      [StatusType.NEW, StatusType.INPROGRESS].includes(order.status)
    ) || [];

  //======================
  // Get upcoming work orders starting in the next 7 days
  const today = dayjs().startOf("day");
  const nextWeek = today.add(7, "day").endOf("day");

  const upcomingOrders = workOrder.filter((order) => {
    const startDate = dayjs(order.startDate);
    return startDate.isAfter(today) && startDate.isBefore(nextWeek);
  });

  // Prepare stats for chart displays
  const orderStatusData = [
    {
      name: "Completed",
      value: workOrder.filter((i) => i.status === StatusType.COMPLETED).length,
    },
    {
      name: "In Progress",
      value: workOrder.filter((i) => i.status === StatusType.INPROGRESS).length,
    },
    {
      name: "New",
      value: workOrder.filter((i) => i.status === StatusType.NEW).length,
    },
    { name: "Upcoming", value: upcomingOrders.length },
  ].filter((item) => item.value > 0);

  // Get top blocks by work orders
  const blockWorkOrders = workOrder.map((i) => {
    const list = task.filter((t) => t.orderId._id === i._id);
    return {
      name: get(i, "ID", "-"),
      orders: list.length,
      tasks: list.filter((l) => l?.status === StatusType.APPROVED).length,
    };
  });

  return (
    <MainLayout pageTitle="Site Manager Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Starting in the next 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Worker Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For {totalTasks} completed tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Status</CardTitle>
            <CardDescription>
              Overview of your work orders by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} orders`, "Count"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Block Activity</CardTitle>
            <CardDescription>
              Most active blocks by tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={blockWorkOrders}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" name="Work Orders" fill="#8884d8" />
                  <Bar dataKey="tasks" name="Completed Tasks" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Active Work Orders</h2>
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/manager/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Work Order
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => {
            return (
              <Card key={order._id} className="overflow-hidden">
                <div className="p-1 bg-primary/10 border-b"></div>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {order.workType.charAt(0).toUpperCase() +
                            order.workType.slice(1)}{" "}
                          - {get(order, "blockId.name")}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {get(order, "siteId.address")}
                        </div>
                      </div>
                      <Badge
                        className="mt-2 md:mt-0"
                        variant={
                          order.status === "inProgress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.status === "inProgress" ? "In Progress" : "New"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Dates</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.startDate), "MMM d HH:mm")} -{" "}
                            {format(
                              new Date(order.endDate),
                              "MMM d HH:mm, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Expected Hours</p>
                          <p className="text-sm text-muted-foreground">
                            {order?.expectedHours | 0} hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Workers</p>
                          <p className="text-sm text-muted-foreground">
                            {
                              task.filter(
                                (app) => app.orderId._id === order._id
                              ).length
                            }{" "}
                            / {order.neededWorkers} assigned
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <Link to={`/manager/orders/${order._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">No Active Work Orders</h3>
            <p className="text-muted-foreground mb-4">
              Create a new work order to start assigning tasks to workers
            </p>
            <Button asChild>
              <Link to="/manager/orders/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Work Order
              </Link>
            </Button>
          </div>
        )}
      </div>

      {upcomingOrders.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-12 mb-6">
            Upcoming Work Orders
          </h2>
          <div className="space-y-4">
            {upcomingOrders.map((order) => {
              return (
                <Card key={order._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {order.workType.charAt(0).toUpperCase() +
                            order.workType.slice(1)}{" "}
                          - {get(order, "blockId.name")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Starting{" "}
                          {format(new Date(order.startDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        asChild
                        className="mt-2 md:mt-0"
                      >
                        <Link to={`/manager/orders/${order._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </MainLayout>
  );
}
