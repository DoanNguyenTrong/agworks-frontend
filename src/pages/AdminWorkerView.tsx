import { apiGetAccDetail } from "@/api/account";
import { BASE_URL } from "@/api/config";
import { apiGetAllWorkerTask } from "@/api/workerTask";
import MainLayout from "@/components/MainLayout";
import PreviewImageDialog from "@/components/PreviewImageDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import WorkerPerformance from "@/components/WorkerPerformance";
import { useToast } from "@/hooks/use-toast";
import { StatusType } from "@/lib/utils/constant";
import dayjs from "dayjs";
import { get } from "lodash";
import { Calendar, ChevronLeft, Edit, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function AdminWorkerView() {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const { toast } = useToast();

  const loadWorker = async (id: string) => {
    try {
      setIsLoading(true);
      // Find worker by ID from the local data
      const { data } = await apiGetAccDetail({ id: id });
      setWorker(get(data, "metaData", {}));

      // Get completed tasks for this worker
      const { data: _data } = await apiGetAllWorkerTask({
        filter: { status: StatusType.APPROVED, workerId: [id] },
      });
      setCompletedTasks(get(_data, "metaData", []));
    } catch (error: any) {
      console.error("Error loading worker:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load worker details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("completedTasks", completedTasks);

  useEffect(() => {
    if (id) {
      loadWorker(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout pageTitle="Worker Details">
        <div className="flex justify-center items-center h-64">
          <p>Loading worker details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!worker) {
    return (
      <MainLayout pageTitle="Worker Details">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Worker not found</p>
          <Button asChild>
            <Link to="/admin/workers">Back to Workers</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Worker Details">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/admin/workers">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Workers
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worker Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Worker Profile</CardTitle>
              <CardDescription>
                Personal information and contact details
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" asChild>
              <Link to={`/admin/workers/edit/${worker["_id"]}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={
                    worker?.logo &&
                    (!worker?.logo.includes("base64")
                      ? `${BASE_URL}${worker?.logo}`
                      : worker?.logo)
                  }
                  alt={worker?.name}
                />
                <AvatarFallback>
                  {worker?.name?.charAt(0) || "W"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{worker?.name}</h2>
              <Badge className="mt-2 bg-agworks-brown">{worker?.role}</Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {worker?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {worker?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(worker?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Task completion metrics and efficiency data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6"> */}
        {/* Pass id to WorkerPerformance */}
        {/* <WorkerPerformance image={[]} tasks={[]} worker={[]} />
          </CardContent>
        </Card> */}

        {/* Recent Tasks Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Latest tasks completed by this worker
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(completedTasks) && completedTasks?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    {/* <TableHead>Order ID</TableHead> */}
                    <TableHead>Completed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTasks.map((task) => (
                    <TableRow key={task?._id}>
                      <TableCell className="font-medium">{task?._id}</TableCell>
                      {/* <TableCell>{task?.orderId?._id}</TableCell> */}
                      <TableCell>
                        {dayjs(task?.updatedAt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task?.status === "approved"
                              ? "default"
                              : task?.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {task?.status?.charAt(0).toUpperCase() +
                            task?.status?.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setPreviewImage(task?._id)}
                          variant="outline"
                          size="sm"
                        >
                          View Photos
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No tasks completed yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <PreviewImageDialog
        id={previewImage}
        _onclose={() => setPreviewImage(null)}
      />
    </MainLayout>
  );
}
