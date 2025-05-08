import { apiGetBlockByFiled } from "@/api/block";
import { BASE_URL } from "@/api/config";
import { apiGetAllImage } from "@/api/image";
import { apiGetWorkerTasksById } from "@/api/workerTask";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderStatus } from "@/components/WorkOrderTabsUpdated";
import { useAuth } from "@/contexts/AuthContext";
import { StatusType } from "@/lib/utils/constant";
import { format } from "date-fns";
import dayjs from "dayjs";
import { get, uniq } from "lodash";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  Clock,
  DollarSign,
  MapPin,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WorkerDashboard() {
  const { currentUser } = useAuth();
  const [workerTasks, setWorkerTasks] = useState([]);
  const [listImage, setlistImage] = useState([]);
  const [listBlock, setlistBlock] = useState([]);

  const getAllImage = async (payload: string[]) => {
    try {
      const { data } = await apiGetAllImage({ filter: { taskId: payload } });
      // console.log("data", data.metaData);
      setlistImage(get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const getListBlockByID = async (payload: any) => {
    try {
      const { data } = await apiGetBlockByFiled({ siteId: payload });
      // console.log("Bloks :>> ", data.metaData);
      setlistBlock(get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const getWorkerTasks = async () => {
    try {
      const { data } = await apiGetWorkerTasksById();
      setWorkerTasks(get(data, "metaData", []));
      await getAllImage(get(data, "metaData", []).map((task) => task._id));
      // console.log("Worker tasks:", data.metaData);
      const blockIds = uniq(
        get(data, "metaData", []).map((t) => get(t, "orderId.siteId"))
      );
      await getListBlockByID(blockIds);
    } catch (error) {
      console.error("Error fetching worker tasks:", error);
    }
  };

  useEffect(() => {
    getWorkerTasks();
  }, []);

  // console.log("Worker tasks:", workerTasks);

  // Get completed tasks
  const completedTasks =
    workerTasks.filter((task) => task.status === StatusType.APPROVED) || [];

  const earnings = listImage.reduce((total, task) => {
    const currtTask = completedTasks.find(
      (o) => o._id === get(task, "taskId._id")
    );
    if (currtTask) {
      return total + get(currtTask, "orderId.payRate", 0);
    }
    return total;
  }, 0);

  return (
    <MainLayout pageTitle="Worker Dashboard">
      <div className="flex items-center mb-8">
        <div className="mr-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-primary" />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
          <p className="text-muted-foreground">{currentUser?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently assigned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
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

      <div className="space-y-6 max-h-[480px] overflow-auto">
        {workerTasks.length > 0 ? (
          workerTasks.map((task, i) => {
            const order = get(task, "orderId");
            const site = order.siteId;
            const block = listBlock.find(
              (b) => b?._id === get(order, "blockId")
            );
            // console.log("block :>> ", block);

            return (
              <Card key={i} className="overflow-hidden">
                <div className="p-1 bg-primary/10 border-b"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order.workType.charAt(0).toUpperCase() +
                          order.workType.slice(1)}{" "}
                        - {block?.name || ""}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {site?.name || ""} • Job #{order._id}
                      </p>
                    </div>
                    {RenderStatus(task.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {get(block, "siteId.address")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Dates</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.startDate), "MMM d")} -{" "}
                          {format(new Date(order.endDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Expected Hours</p>
                        <p className="text-sm text-muted-foreground">
                          {order.expectedHours} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Pay Rate</p>
                        <p className="text-sm text-muted-foreground">
                          ${order.payRate.toFixed(2)} per photo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="sm:flex-1">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Task Photo
                    </Button>
                    <Button variant="outline" className="sm:flex-1" asChild>
                      <Link to="/worker/tasks">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        View My Tasks
                      </Link>
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
            <Button>Browse Available Jobs</Button>
          </div>
        )}
      </div>

      {workerTasks.filter((task) => task.status === "pending").length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-6 mt-10">
            Pending Applications
          </h2>
          <div className="space-y-4">
            {workerTasks
              .filter((task) => task.status === "pending")
              .map(({ orderId: order }, i) => {
                const site = order.siteId;

                return (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium">
                            {order.workType.charAt(0).toUpperCase() +
                              order.workType.slice(1)}{" "}
                            Job
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {site?.name || ""} • Applied on{" "}
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
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
          <h2 className="text-xl font-semibold mb-6 mt-10">
            Recent Task Photos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {completedTasks.slice(0, 8).map((task) => {
              const photo = listImage.find(
                (image) => get(image, "taskId._id") === get(task, "_id")
              );
              return (
                <div
                  key={get(task, "_id")}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="aspect-square relative bg-muted">
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          get(task, "status") === "approved"
                            ? "default"
                            : get(task, "status") === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {get(task, "status").charAt(0).toUpperCase() +
                          get(task, "status").slice(1)}
                      </Badge>
                    </div>
                    {get(photo, "_id") ? (
                      <img
                        src={`${BASE_URL}${get(photo, "imageData")}`}
                        alt="Task completion"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Camera className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      Task #{get(task, "_id")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(get(task, "createdAt")).format("YYYY/MM/DD HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {completedTasks.length > 8 && (
            <div className="text-center mt-4">
              <Button variant="outline" asChild>
                <Link to="/worker/tasks">View All Task Photos</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
