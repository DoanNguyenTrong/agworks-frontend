import { apiGetWorkerTasksById } from "@/api/workerTask";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { get } from "lodash";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkerTasks() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workerTasks, setWorkerTasks] = useState([]);

  const getWorkerTasks = async () => {
    try {
      const { data } = await apiGetWorkerTasksById();
      setWorkerTasks(get(data, "metaData", []));
    } catch (error) {
      console.error("Error fetching worker tasks:", error);
    }
  };

  useEffect(() => {
    getWorkerTasks();
  }, []);

  // console.log("workerTasks", workerTasks);

  // Filter tasks by search term and status
  const filteredTasks = workerTasks.filter((task) => {
    // Status filter
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }

    // Search filter (by task ID or work order ID)
    if (searchTerm !== "") {
      const searchString = `${task._id} ${task.orderId || ""}`.toLowerCase();
      if (!searchString.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge className="bg-blue-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleRowClick = (taskId: string) => {
    navigate(`/worker/tasks/${taskId}`);
  };

  return (
    <MainLayout pageTitle="My Tasks">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Task ID</TableHead> */}
                <TableHead>Work Order</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Date Completed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const order = task.orderId;
                  return (
                    <TableRow
                      key={task._id}
                      className="cursor-pointer"
                      onClick={() => handleRowClick(task._id)}
                    >
                      {/* <TableCell className="font-medium">{task._id}</TableCell> */}
                      <TableCell>{order.ID}</TableCell>
                      <TableCell>
                        {order?.workType
                          ? order.workType.charAt(0).toUpperCase() +
                            order.workType.slice(1)
                          : "Unknown"}
                      </TableCell>
                      <TableCell>
                        {task.completedAt
                          ? format(new Date(task.completedAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/worker/tasks/${task._id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
