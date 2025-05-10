import { apiGetDetailBlock } from "@/api/block";
import { BASE_URL } from "@/api/config";
import { apiGetAllImage } from "@/api/image";
import { apiGetTaskDetails } from "@/api/workerTask";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { get } from "lodash";
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function WorkerTaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>({});
  const [block, setBlock] = useState(null);
  const [listImage, setListImage] = useState([]);

  const getTaskDetails = async (id: string) => {
    try {
      const { data } = await apiGetTaskDetails(id);
      setTask(get(data, "metaData", []));

      getBlockDetails(get(data, "metaData.orderId.blockId"));
      getImage(get(data, "metaData._id"));
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const getImage = async (id: string) => {
    const { data } = await apiGetAllImage({ filter: { taskId: [id] } });
    setListImage(get(data, "metaData", []));
  };

  const getBlockDetails = async (blockId) => {
    const { data } = await apiGetDetailBlock(blockId);
    setBlock(get(data, "metaData", []));
  };

  useEffect(() => {
    console.log("task ====", taskId);
    if (taskId) {
      getTaskDetails(taskId);
      // setWorkOrder(task?.orderId);
    }
  }, [taskId]);
  console.log("task", task);

  if (!task) {
    return (
      <MainLayout pageTitle="Task Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-4">Task not found</h2>
          <p className="text-muted-foreground mb-6">
            The task you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/worker/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-blue-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout pageTitle="Task Details">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/worker/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">Task</CardTitle>
                  <div className="mt-2">
                    {getStatusBadge(get(task, "status"))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    Completed on
                  </p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {task?.createdAt
                        ? dayjs(get(task, "createdAt")).format(
                            "YYYY/MM/DD HH:mm"
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Task Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {listImage.length > 0 ? (
                  listImage.map((item) => (
                    <div
                      key={get(item, "_id")}
                      className="aspect-square rounded-md overflow-hidden"
                    >
                      <img
                        src={`${BASE_URL}${get(item, "imageData")}`}
                        alt={`Task photo ${get(item, "filename")}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 text-muted-foreground">
                    No photos uploaded
                  </div>
                )}
              </div>

              {get(task, "orderId") && (
                <>
                  <Separator className="my-6" />
                  <h3 className="font-medium mb-4">Work Order Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-agworks-green" />
                      <div>
                        <p className="font-medium">Work Type</p>
                        <p className="text-muted-foreground">
                          {get(task, "workerId.name", "")
                            .charAt(0)
                            .toUpperCase() +
                            get(task, "workerId.name", "").slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 mt-0.5 text-agworks-green" />
                      <div>
                        <p className="font-medium">Schedule</p>
                        <p className="text-muted-foreground">
                          {dayjs(get(task, "orderId.startDate")).format(
                            "YYYY/MM/DD HH:mm"
                          )}{" "}
                          -{" "}
                          {dayjs(get(task, "orderId.endDate")).format(
                            "YYYY/MM/DD HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5 text-agworks-green" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {get(block, "name", "")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {get(block, "siteId") && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vineyard</p>
                    <p className="font-medium">{get(block, "siteId.name")}</p>
                  </div>
                )}

                {get(block, "_id  ") && (
                  <div>
                    <p className="text-sm text-muted-foreground">Block</p>
                    <p className="font-medium">{get(block, "name")}</p>
                  </div>
                )}

                {task && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Pay Rate</p>
                      <p className="font-medium">
                        ${get(task, "orderId.payRate", 0).toFixed(2)}/hour
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Hours
                      </p>
                      <p className="font-medium">
                        {get(task, "orderId.expectedHours", 0)} hours
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Worker</p>
                  <p className="font-medium">{get(task, "workerId.name")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
