
import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CalendarDays, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { sites, workOrders, workerApplications, blocks } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function SiteManagerDashboard() {
  const { currentUser } = useAuth();
  const [activeSite, setActiveSite] = useState(null);
  const [pendingApplications, setPendingApplications] = useState(0);
  
  useEffect(() => {
    // Find the site managed by this user
    if (currentUser) {
      const managedSite = sites.find(site => site.managerId === currentUser.id);
      setActiveSite(managedSite);
      
      // Count pending applications for this site's work orders
      if (managedSite) {
        const siteOrders = workOrders.filter(order => order.siteId === managedSite.id);
        const orderIds = siteOrders.map(order => order.id);
        const pending = workerApplications.filter(
          app => orderIds.includes(app.orderrId) && app.status === "pending"
        ).length;
        setPendingApplications(pending);
      }
    }
  }, [currentUser]);

  // Get active work orders for the manager's site
  const activeOrders = activeSite
    ? workOrders.filter(
        order => order.siteId === activeSite.id && 
        ["published", "inProgress"].includes(order.status)
      )
    : [];

  // Get upcoming work orders starting in the next 7 days
  const currentDate = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingOrders = activeSite
    ? workOrders.filter(
        order => {
          const startDate = new Date(order.startDate);
          return order.siteId === activeSite.id && 
                startDate > currentDate && 
                startDate <= nextWeek;
        }
      )
    : [];

  return (
    <MainLayout pageTitle="Site Manager Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Starting in the next 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Worker Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Active Work Orders</h2>
        <Button asChild>
          <Link to="/manager/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Work Order
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {activeOrders.length > 0 ? (
          activeOrders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-1 bg-primary/10 border-b"></div>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)} - {
                          blocks.find(block => block.id === order.blockId)?.name
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                    </div>
                    <Badge className="mt-2 md:mt-0" variant={order.status === "inProgress" ? "default" : "secondary"}>
                      {order.status === "inProgress" ? "In Progress" : "Published"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Dates</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Expected Hours</p>
                        <p className="text-sm text-muted-foreground">{order.expectedHours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Workers</p>
                        <p className="text-sm text-muted-foreground">
                          {
                            workerApplications.filter(
                              app => app.orderrId === order.id && app.status === "approved"
                            ).length
                          } / {order.neededWorkers} assigned
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link to={`/manager/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">No Active Work Orders</h3>
            <p className="text-muted-foreground mb-4">
              Create a new work order to start assigning tasks to workers
            </p>
            <Button asChild>
              <Link to="/manager/orders/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Work Order
              </Link>
            </Button>
          </div>
        )}
      </div>

      {upcomingOrders.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-12 mb-6">Upcoming Work Orders</h2>
          <div className="space-y-4">
            {upcomingOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)} - {
                          blocks.find(block => block.id === order.blockId)?.name
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">Starting {format(new Date(order.startDate), "MMMM d, yyyy")}</p>
                    </div>
                    <Button variant="outline" asChild className="mt-2 md:mt-0">
                      <Link to={`/manager/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
}
