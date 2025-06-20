
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Star, MessageSquare, DollarSign, Users } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { workOrders, users, workerApplications } from "@/lib/data";
import { WorkOrder, WorkerApplication } from "@/lib/types";

export default function CompanyWorkerDetails() {
  const { id: orderId, companyId } = useParams<{ id: string; companyId: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  
  useEffect(() => {
    if (orderId && companyId) {
      // Get work order
      const order = workOrders.find(o => o.id === orderId);
      setWorkOrder(order || null);
      
      // Get company info
      const serviceCompany = users.find(u => u.id === companyId && u.role === 'serviceCompany');
      setCompany(serviceCompany || null);
      
      // Get worker applications for this order and company
      const workerApps = workerApplications.filter(app => 
        app.orderId === orderId && app.serviceCompanyId === companyId
      );
      setApplications(workerApps);
    }
  }, [orderId, companyId]);
  
  const getStatusBadge = (status: WorkerApplication["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const mockPerformanceRating = (workerId: string) => {
    // Mock performance rating based on worker ID
    const ratings = [4.2, 4.7, 3.9, 4.5, 4.1];
    return ratings[parseInt(workerId.slice(-1)) % ratings.length];
  };
  
  if (!workOrder || !company) {
    return (
      <MainLayout pageTitle="Company Worker Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Loading company details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="p-0 mr-2" 
            onClick={() => navigate(`/manager/orders/${orderId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Worker Applications</h1>
            <p className="text-muted-foreground">
              {company.companyName} • Order #{orderId}
            </p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Company Name</h4>
                <p className="font-medium">{company.companyName || company.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Contact Email</h4>
                <p>{company.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                <p>{company.phone || 'N/A'}</p>
              </div>
            </div>
            {company.address && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                <p>{company.address}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Worker Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker Name</TableHead>
                  <TableHead>Performance Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Suggested Rate</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{application.workerName}</div>
                          <div className="text-sm text-muted-foreground">ID: {application.workerId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mockPerformanceRating(application.workerId).toFixed(1)}</span>
                        <span className="text-muted-foreground text-sm">/5.0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell>
                      {application.suggestedRate ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>${application.suggestedRate.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Standard rate</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {application.notes ? (
                        <div className="max-w-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <MessageSquare className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">Worker Note:</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.notes}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No notes</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Worker Applications</h3>
              <p className="text-muted-foreground">
                No workers from {company.companyName} have applied for this job yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
