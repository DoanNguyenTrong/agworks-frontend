
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { WorkOrder, WorkerTask } from "@/lib/types";
import { users, serviceCompanyApplications } from "@/lib/data";
import { MapPin, Calendar, Users, DollarSign, Building2, CheckCircle, XCircle, Clock } from "lucide-react";
import WorkerPerformance from "@/components/WorkerPerformance";

interface WorkOrderTabsProps {
  workOrder: WorkOrder;
  tasks: WorkerTask[];
  payments?: any[];
}

export default function WorkOrderTabs({ workOrder, tasks, payments = [] }: WorkOrderTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Get service company applications for this order
  const companyApplications = serviceCompanyApplications.filter(app => app.orderId === workOrder.id);
  
  // Get selected service companies info
  const selectedServiceCompanies = workOrder.serviceCompanyIds ? 
    users.filter(user => 
      user.role === 'serviceCompany' && workOrder.serviceCompanyIds?.includes(user.id)
    ) : [];

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const approvedTasks = tasks.filter(task => task.status === "approved");
  const rejectedTasks = tasks.filter(task => task.status === "rejected");

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "paid":
        return <Badge className="bg-blue-500">Paid</Badge>;
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 w-full mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">
          Completed Tasks {tasks.length > 0 && `(${tasks.length})`}
        </TabsTrigger>
        <TabsTrigger value="payslip">
          Payslip {payments.length > 0 && `(${payments.length})`}
        </TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="companies">
          Companies ({selectedServiceCompanies.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {selectedServiceCompanies.length}
              </div>
              <p className="text-xs text-muted-foreground">Total Workers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {tasks.length}
              </div>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {Math.round(tasks.length / (workOrder.neededWorkers || 1))}
              </div>
              <p className="text-xs text-muted-foreground">Average Per Worker</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                ${payments.reduce((sum, p) => sum + p.totalAmount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Worker Performance</CardTitle>
              <CardDescription>Tasks completed by each worker</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkerPerformance id={workOrder.id} tasks={tasks} payRate={workOrder.payRate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Progress</CardTitle>
              <CardDescription>Tasks completed per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Daily progress tracking coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tasks">
        <Card>
          <CardHeader>
            <CardTitle>Task Submissions</CardTitle>
            <CardDescription>
              Review and manage worker task submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-6">
                {pendingTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Pending Review ({pendingTasks.length})</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Photos</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTasks.map(task => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={task.imageUrl} />
                                  <AvatarFallback>{task.workerName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{task.workerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{format(new Date(task.completedAt), "MMM d, yyyy")}</TableCell>
                            <TableCell>{task.photoUrls.length}</TableCell>
                            <TableCell>{renderStatus(task.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {approvedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Approved ({approvedTasks.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {approvedTasks.map(task => (
                        <Card key={task.id} className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={task.imageUrl} />
                              <AvatarFallback>{task.workerName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{task.workerName}</div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(task.completedAt), "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>
                          {task.photoUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {task.photoUrls.slice(0, 2).map((url, index) => (
                                <img 
                                  key={index}
                                  src={url} 
                                  alt={`Task photo ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {rejectedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Rejected ({rejectedTasks.length})</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Photos</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedTasks.map(task => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={task.imageUrl} />
                                  <AvatarFallback>{task.workerName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{task.workerName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{format(new Date(task.completedAt), "MMM d, yyyy")}</TableCell>
                            <TableCell>{task.photoUrls.length}</TableCell>
                            <TableCell>{renderStatus(task.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No task submissions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payslip">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment Calculations
              <Button className="bg-green-600 hover:bg-green-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Export Payroll
              </Button>
            </CardTitle>
            <CardDescription>
              Pay amounts based on completed and approved tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead>Completed Tasks</TableHead>
                      <TableHead>Pay Rate</TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{payment.workerName}</TableCell>
                        <TableCell>{payment.taskCount}</TableCell>
                        <TableCell>${workOrder.payRate.toFixed(1)} per task</TableCell>
                        <TableCell>${payment.totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Payment</span>
                    <span>${payments.reduce((sum, p) => sum + p.totalAmount, 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payment data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{workOrder.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Work Dates</p>
                  <p className="font-medium">
                    {new Date(workOrder.startDate).toLocaleDateString()} - {new Date(workOrder.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Workers Needed</p>
                  <p className="font-medium">{workOrder.neededWorkers}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pay Rate</p>
                  <p className="font-medium">${workOrder.payRate.toFixed(2)} per vine</p>
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

          <Card>
            <CardHeader>
              <CardTitle>Block Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Acres:</span>
                  <span>{workOrder.acres || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rows:</span>
                  <span>{workOrder.rows || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vines:</span>
                  <span>{workOrder.vines || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Hours:</span>
                  <span>{workOrder.expectedHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Pay Estimate:</span>
                  <span>${((workOrder.vines || 0) * workOrder.payRate).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
                      onClick={() => navigate(`/manager/orders/${workOrder.id}/companies/${company.id}`)}
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
  );
}
