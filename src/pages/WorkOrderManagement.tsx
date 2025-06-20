
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sites, workOrders, blocks } from "@/lib/data";
import { WorkOrder } from "@/lib/types";
import { format } from "date-fns";

export default function WorkOrderManagement() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Get work orders for the sites this manager is responsible for
  const managedSites = sites.filter(site => site.managerId === currentUser?.id);
  const managedSiteIds = managedSites.map(site => site.id);
  
  // Filter work orders by search term and status - exclude draft and cancelled
  const filteredOrders = workOrders
    .filter(order => managedSiteIds.includes(order.siteId))
    .filter(order => !['draft', 'cancelled'].includes(order.status))
    .filter(order => {
      if (statusFilter !== "all") {
        return order.status === statusFilter;
      }
      return true;
    })
    .filter(order => {
      const block = blocks.find(b => b.id === order.blockId);
      const searchString = `${order.id} ${block?.name || ""} ${order.workType}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const getStatusBadge = (status: WorkOrder["status"]) => {
    switch (status) {
      case "published":
        return <Badge variant="secondary">Published</Badge>;
      case "inProgress":
        return <Badge>In Progress</Badge>;
      case "completed":
        return <Badge className="bg-agworks-green">Completed</Badge>;
      default:
        return null;
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/manager/orders/${orderId}`);
  };

  return (
    <MainLayout pageTitle="Work Order Management">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button asChild>
            <Link to="/manager/orders/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Work Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pay Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const block = blocks.find(b => b.id === order.blockId);
                return (
                  <TableRow key={order.id} className="cursor-pointer" onClick={() => handleOrderClick(order.id)}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{block?.name || "Unknown Block"}</TableCell>
                    <TableCell>
                      {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d")}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>${order.payRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/manager/orders/${order.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No work orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}
