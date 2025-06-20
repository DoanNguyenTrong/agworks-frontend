
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Pencil, AlertTriangle, Building2, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { workOrders, blocks, sites, users, serviceCompanyApplications, workerApplications } from "@/lib/data";
import { WorkOrder, ServiceCompanyApplication } from "@/lib/types";

export default function WorkOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [blockName, setBlockName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [companyApplications, setCompanyApplications] = useState<ServiceCompanyApplication[]>([]);
  const [selectedServiceCompanies, setSelectedServiceCompanies] = useState<any[]>([]);
  
  useEffect(() => {
    // Get work order data
    const order = workOrders.find(o => o.id === id);
    if (order) {
      setWorkOrder(order);
      
      // Get block and site names
      const block = blocks.find(b => b.id === order.blockId);
      if (block) {
        setBlockName(block.name);
      }
      
      const site = sites.find(s => s.id === order.siteId);
      if (site) {
        setSiteName(site.name);
      }
      
      // Get service company applications for this order
      const applications = serviceCompanyApplications.filter(app => app.orderId === order.id);
      setCompanyApplications(applications);
      
      // Get selected service companies info
      if (order.serviceCompanyIds) {
        const companies = users.filter(user => 
          user.role === 'serviceCompany' && order.serviceCompanyIds?.includes(user.id)
        );
        setSelectedServiceCompanies(companies);
      }
    }
  }, [id]);
  
  if (!workOrder) {
    return (
      <MainLayout pageTitle="Work Order Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Work Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The work order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: WorkOrder["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "published":
        return <Badge variant="secondary">Published</Badge>;
      case "inProgress":
        return <Badge>In Progress</Badge>;
      case "completed":
        return <Badge className="bg-agworks-green">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getApplication = (companyId: string) => {
    return companyApplications.find(app => app.serviceCompanyId === companyId);
  };

  const getApplicationStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Work Order Details</h1>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {workOrder.workType.charAt(0).toUpperCase() + workOrder.workType.slice(1)} - {blockName}
              </h2>
              {getStatusBadge(workOrder.status)}
            </div>
            <p className="text-muted-foreground">
              {siteName} • Order #{workOrder.id}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="mr-2">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button>
              {workOrder.status === "draft" ? "Publish" : 
               workOrder.status === "published" ? "Start Work" : 
               workOrder.status === "inProgress" ? "Complete" : "Reopen"}
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Work Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Work Type</h4>
                  <p className="capitalize">{workOrder.workType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Needed Workers</h4>
                  <p>{workOrder.neededWorkers}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Pay Rate</h4>
                  <p>${workOrder.payRate.toFixed(2)} per vine</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Expected Hours</h4>
                  <p>{workOrder.expectedHours}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Start Date</h4>
                  <p>{new Date(workOrder.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">End Date</h4>
                  <p>{new Date(workOrder.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              {workOrder.notes && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Notes</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{workOrder.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Service Companies ({selectedServiceCompanies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedServiceCompanies.map((company) => {
                    const application = getApplication(company.id);
                    return (
                      <TableRow 
                        key={company.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/manager/orders/${id}/companies/${company.id}`)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{company.companyName || company.name}</div>
                            <div className="text-sm text-muted-foreground">{company.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{company.email}</div>
                            {company.phone && <div className="text-sm text-muted-foreground">{company.phone}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {application ? (
                              <>
                                {getApplicationStatusIcon(application.status)}
                                <span className="capitalize">{application.status}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Invited</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {application ? new Date(application.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            View Workers
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {selectedServiceCompanies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No service companies selected for this work order.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
