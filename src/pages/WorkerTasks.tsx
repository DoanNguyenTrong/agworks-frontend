
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar, ArrowUpDown, Clock, CheckCircle, Camera } from "lucide-react";
import { workerTasks, workOrders, sites, blocks } from "@/lib/data";
import { format } from "date-fns";

export default function WorkerTasks() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter tasks based on status and search term
  const filteredTasks = workerTasks.filter(task => {
    // Filter by status
    if (filter !== "all" && task.status !== filter) return false;
    
    // Find related work order
    const order = workOrders.find(o => o.id === task.orderId);
    if (!order) return false;
    
    // Find related site and block
    const site = sites.find(s => s.id === order.siteId);
    const block = blocks.find(b => b.id === order.blockId);
    
    // Search by work type, site name, block name, and date
    const searchString = `${order.workType} ${site?.name || ""} ${block?.name || ""} ${task.completedAt}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });
  
  // Group tasks by status for the dashboard counts
  const pendingTasks = workerTasks.filter(task => task.status === "pending").length;
  const approvedTasks = workerTasks.filter(task => task.status === "approved").length;
  const rejectedTasks = workerTasks.filter(task => task.status === "rejected").length;
  
  // Calculate earnings
  const earnings = workerTasks.reduce((total, task) => {
    const order = workOrders.find(o => o.id === task.orderId);
    if (order && task.status === "approved") {
      return total + order.payRate;
    }
    return total;
  }, 0);
  
  const handleViewTask = (id: string) => {
    navigate(`/worker/tasks/${id}`);
  };

  return (
    <MainLayout pageTitle="My Tasks">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{workerTasks.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingTasks}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedTasks}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Earnings</p>
                <p className="text-2xl font-bold">${earnings.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Task History</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Task
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead className="text-right">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const order = workOrders.find(o => o.id === task.orderId);
                  const site = sites.find(s => order && s.id === order.siteId);
                  const block = blocks.find(b => order && b.id === order.blockId);
                  
                  return (
                    <TableRow 
                      key={task.id} 
                      className="cursor-pointer"
                      onDoubleClick={() => handleViewTask(task.id)}
                    >
                      <TableCell>
                        {format(new Date(task.completedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order ? order.workType.charAt(0).toUpperCase() + order.workType.slice(1) : "Unknown"}
                      </TableCell>
                      <TableCell>
                        {site?.name} - {block?.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          task.status === "approved" ? "default" : 
                          task.status === "rejected" ? "destructive" : 
                          "secondary"
                        }>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        {task.status === "approved" && order ? 
                          <span className="font-medium">${order.payRate.toFixed(2)}</span> : 
                          <span className="text-muted-foreground">-</span>
                        }
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
