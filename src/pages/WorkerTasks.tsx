
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { workerTasks, workOrders } from "@/lib/data";
import { format } from "date-fns";

export default function WorkerTasks() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Get tasks for current worker
  const myTasks = workerTasks.filter(task => 
    task.workerId === currentUser?.id
  );

  // Filter tasks by search term
  const filteredTasks = myTasks.filter(task => {
    const order = workOrders.find(order => order.id === task.orderId);
    const searchString = `${order?.workType || ""} ${order?.address || ""}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleRowDoubleClick = (id: string) => {
    navigate(`/worker/tasks/${id}`);
  };

  return (
    <MainLayout pageTitle="My Tasks">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const order = workOrders.find(order => order.id === task.orderId);
                  return (
                    <TableRow 
                      key={task.id}
                      onDoubleClick={() => handleRowDoubleClick(task.id)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        {task.completedAt ? format(new Date(task.completedAt), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {order?.workType || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {order?.address || "Unknown location"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={task.status === "approved" ? "success" : 
                                  task.status === "pending" ? "outline" : "secondary"}
                        >
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/worker/tasks/${task.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">No tasks found</p>
                    </div>
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
