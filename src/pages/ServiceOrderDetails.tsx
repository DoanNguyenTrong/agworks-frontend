
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { workOrders, workerApplications, users, serviceCompanyApplications } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ServiceOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const order = workOrders.find(o => o.id === orderId);
  const serviceCompanyApplication = serviceCompanyApplications.find(
    app => app.orderId === orderId && app.serviceCompanyId === currentUser?.id
  );
  
  // Get worker applications for this order from this service company's workers
  const serviceCompanyWorkers = users.filter(user => 
    user.role === 'worker' && user.serviceCompanyId === currentUser?.id
  );
  const workerApplicationsForOrder = workerApplications.filter(app => 
    app.orderId === orderId && serviceCompanyWorkers.some(worker => worker.id === app.workerId)
  );

  if (!order) {
    return (
      <MainLayout pageTitle="Order Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Work order not found.</p>
          <Button onClick={() => navigate("/service/orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleAcceptOrder = async () => {
    try {
      // TODO: Implement actual API call
      toast({
        title: "Order Application Submitted",
        description: "Your application for this work order has been submitted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application.",
        variant: "destructive",
      });
    }
  };

  const handleRejectOrder = async () => {
    try {
      // TODO: Implement actual API call
      toast({
        title: "Order Declined",
        description: "You have declined this work order.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to decline order.",
        variant: "destructive",
      });
    }
  };

  const getApplicationStatusBadge = () => {
    if (!serviceCompanyApplication) {
      return <Badge className="bg-blue-100 text-blue-700">Available</Badge>;
    }
    
    switch (serviceCompanyApplication.status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Applied</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getWorkerStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Applied</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <MainLayout pageTitle="Work Order Details">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/service/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          {getApplicationStatusBadge()}
        </div>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Work Order #{order.id}
              <div className="flex gap-2">
                {!serviceCompanyApplication && (
                  <>
                    <Button onClick={handleAcceptOrder}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply for Order
                    </Button>
                    <Button variant="outline" onClick={handleRejectOrder}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{order.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Work Dates</p>
                  <p className="font-medium">
                    {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Workers Needed</p>
                  <p className="font-medium">{order.neededWorkers}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pay Rate</p>
                  <p className="font-medium">${order.payRate}/vine</p>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workers">Worker Applications ({workerApplicationsForOrder.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Block Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Acres:</span>
                      <span>{order.acres || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rows:</span>
                      <span>{order.rows || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vines:</span>
                      <span>{order.vines || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vines per Row:</span>
                      <span>{order.vinesPerRow || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Work Type:</span>
                      <span>{order.workType.charAt(0).toUpperCase() + order.workType.slice(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Hours:</span>
                      <span>{order.expectedHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Pay Estimate:</span>
                      <span>${((order.vines || 0) * order.payRate).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workers">
            <Card>
              <CardHeader>
                <CardTitle>Worker Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {workerApplicationsForOrder.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Worker Name</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Suggested Rate</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Companions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workerApplicationsForOrder.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.workerName}
                          </TableCell>
                          <TableCell>
                            {new Date(application.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getWorkerStatusBadge(application.status)}
                          </TableCell>
                          <TableCell>
                            {application.suggestedRate ? `$${application.suggestedRate}/vine` : 'Standard rate'}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {application.notes || 'No notes'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {application.companionWorkerIds?.length ? 
                              `${application.companionWorkerIds.length} companions` : 
                              'Working alone'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No worker applications yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {serviceCompanyApplication?.status === 'accepted' 
                        ? "Once you accept this order, your workers can apply for it."
                        : "Apply for this order first to allow your workers to sign up."
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
