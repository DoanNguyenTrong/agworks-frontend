
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ClipboardList, Clock, DollarSign, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { users, workOrders, workerTasks } from "@/lib/data";

export default function ServiceDashboard() {
  const { currentUser } = useAuth();
  
  // Get workers belonging to this service company
  const companyWorkers = users.filter(user => 
    user.role === 'worker' && user.serviceCompanyId === currentUser?.id
  );
  
  // Get work orders assigned to this service company (in a real app, this would be filtered by serviceCompanyId)
  const availableWorkOrders = workOrders.filter(order => order.status === 'published').slice(0, 3);
  
  // Get recent tasks from company workers
  const recentTasks = workerTasks.filter(task => 
    companyWorkers.some(worker => worker.id === task.workerId)
  ).slice(0, 3);
  
  const stats = [
    {
      title: "Active Workers",
      value: companyWorkers.length.toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Available Jobs",
      value: availableWorkOrders.length.toString(),
      icon: ClipboardList,
      color: "text-green-600"
    },
    {
      title: "Pending Tasks",
      value: recentTasks.filter(task => task.status === 'pending').length.toString(),
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Monthly Earnings",
      value: "$12,450",
      icon: DollarSign,
      color: "text-green-600"
    }
  ];

  return (
    <MainLayout pageTitle="Service Company Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.companyName || currentUser?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your workforce and track available work opportunities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Work Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Available Work Orders
              </CardTitle>
              <CardDescription>
                New job opportunities in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableWorkOrders.length > 0 ? (
                availableWorkOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{order.workType}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        ${order.payRate}/hr
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Workers needed: {order.neededWorkers}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No work orders available at the moment.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Company Workers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Workers
              </CardTitle>
              <CardDescription>
                Active workers in your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyWorkers.length > 0 ? (
                companyWorkers.slice(0, 5).map((worker) => (
                  <div key={worker.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {worker.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-muted-foreground">{worker.phone}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No workers assigned to your company yet.
                </p>
              )}
              {companyWorkers.length > 0 && (
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/service/workers">View All Workers</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Worker Activity</CardTitle>
            <CardDescription>
              Latest task submissions from your workers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {task.workerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{task.workerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted task for Order #{task.orderId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={task.status === 'approved' ? 'default' : 'secondary'}
                        className={
                          task.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : task.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {task.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent activity from your workers.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
