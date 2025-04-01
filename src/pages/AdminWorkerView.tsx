
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { users, workerTasks } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminWorkerView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any | null>(null);
  const [workerStats, setWorkerStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    approvedTasks: 0,
    rejectedTasks: 0,
    percentageApproved: 0,
  });

  useEffect(() => {
    if (id) {
      const foundWorker = users.find(user => user.id === id && user.role === "worker");
      if (foundWorker) {
        setWorker(foundWorker);
        
        // Calculate worker stats
        const tasks = workerTasks.filter(task => task.workerId === id);
        const approved = tasks.filter(task => task.status === "approved").length;
        const rejected = tasks.filter(task => task.status === "rejected").length;
        const completed = approved + rejected;
        
        setWorkerStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          approvedTasks: approved,
          rejectedTasks: rejected,
          percentageApproved: completed > 0 ? (approved / completed) * 100 : 0,
        });
      }
    }
  }, [id]);

  if (!worker) {
    return (
      <MainLayout pageTitle="Worker Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The worker you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/admin/workers")}>
            Back to Workers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Worker Details">
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate("/admin/workers")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Workers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Worker Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{worker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{worker.name}</h2>
              <p className="text-muted-foreground">{worker.email}</p>
              <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{worker.phone || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>{new Date(worker.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p>{workerStats.completedTasks}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                <div className="mt-2">
                  <Progress value={workerStats.percentageApproved} className="h-2" />
                  <p className="text-sm mt-1">{workerStats.percentageApproved.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/workers/edit/${worker.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {workerTasks.filter(task => task.workerId === worker.id).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Image</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerTasks
                    .filter(task => task.workerId === worker.id)
                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                    .slice(0, 5)
                    .map(task => (
                      <TableRow key={task.id}>
                        <TableCell>{new Date(task.completedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="link" onClick={() => navigate(`/admin/orders/${task.orderId}`)}>
                            {task.orderId}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              task.status === "approved"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : task.status === "rejected"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Image
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks recorded for this worker yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
