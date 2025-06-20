
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, MapPin, Users, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { workOrders, serviceCompanyApplications } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ServiceWorkOrders() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter work orders that this service company can see
  const availableOrders = workOrders.filter(order => {
    // Show orders that either:
    // 1. Have service company IDs and this company is in the list
    // 2. Are published and available for bidding
    return order.serviceCompanyIds?.includes(currentUser?.id || '') || 
           (order.status === "published" && !order.acceptedByServiceCompanyId);
  });
  
  // Filter work orders by search and status
  const filteredOrders = availableOrders.filter(order => {
    // Search filter
    const searchString = `${order.workType} ${order.address}`.toLowerCase();
    if (!searchString.includes(searchTerm.toLowerCase())) return false;
    
    // Status filter - map service company perspective
    if (statusFilter === "available" && (order.acceptedByServiceCompanyId || getApplicationStatus(order.id) !== 'none')) return false;
    if (statusFilter === "applied" && getApplicationStatus(order.id) !== 'pending') return false;
    if (statusFilter === "accepted" && (getApplicationStatus(order.id) !== 'accepted' || order.acceptedByServiceCompanyId !== currentUser?.id)) return false;
    if (statusFilter === "rejected" && getApplicationStatus(order.id) !== 'rejected') return false;
    
    return true;
  });

  const getApplicationStatus = (orderId: string) => {
    const application = serviceCompanyApplications.find(
      app => app.orderId === orderId && app.serviceCompanyId === currentUser?.id
    );
    return application?.status || 'none';
  };

  const getStatusBadge = (order: any) => {
    const appStatus = getApplicationStatus(order.id);
    
    if (appStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-700">Applied</Badge>;
    } else if (appStatus === 'accepted') {
      return <Badge className="bg-green-100 text-green-700">Accepted</Badge>;
    } else if (appStatus === 'rejected') {
      return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
    } else if (order.acceptedByServiceCompanyId && order.acceptedByServiceCompanyId !== currentUser?.id) {
      return <Badge variant="outline">Unavailable</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-700">Available</Badge>;
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // TODO: Implement actual API call to accept order
      console.log("Accepting order:", orderId);
      
      toast({
        title: "Order Application Submitted",
        description: "Your application for this work order has been submitted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      // TODO: Implement actual API call to reject order
      console.log("Rejecting order:", orderId);
      
      toast({
        title: "Order Rejected",
        description: "You have declined this work order.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to reject order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getWorkTypeDisplay = (workType: string) => {
    switch (workType) {
      case "pruning":
        return "Pruning";
      case "shootThinning":
        return "Shoot Thinning";
      default:
        return workType.charAt(0).toUpperCase() + workType.slice(1);
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/service/orders/${orderId}`);
  };

  return (
    <MainLayout pageTitle="Work Orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Available Work Orders</h1>
              <p className="text-muted-foreground">
                View and apply for work orders from vineyard managers
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full md:w-72"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Orders</p>
                  <p className="text-2xl font-bold">
                    {filteredOrders.filter(order => getApplicationStatus(order.id) === 'none' && !order.acceptedByServiceCompanyId).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applied</p>
                  <p className="text-2xl font-bold">
                    {filteredOrders.filter(order => getApplicationStatus(order.id) === 'pending').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">
                    {filteredOrders.filter(order => getApplicationStatus(order.id) === 'accepted').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">$24,580</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Workers Needed</TableHead>
                  <TableHead>Pay Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {getWorkTypeDisplay(order.workType)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{order.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{order.neededWorkers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>${order.payRate}/vine</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(order.id)}>
                            View Details
                          </Button>
                          {getApplicationStatus(order.id) === 'none' && !order.acceptedByServiceCompanyId && (
                            <>
                              <Button size="sm" onClick={() => handleAcceptOrder(order.id)}>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Apply
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectOrder(order.id)}>
                                <XCircle className="h-3 w-3 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "No work orders found matching your search." : "No work orders available."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
