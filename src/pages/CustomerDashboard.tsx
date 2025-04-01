
import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Map, Grape, ClipboardList } from "lucide-react";
import { sites, blocks, workOrders } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const [customerSites, setCustomerSites] = useState([]);
  const [customerBlocks, setCustomerBlocks] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      // Get sites owned by this customer
      const userSites = sites.filter(site => site.customerId === currentUser.id);
      setCustomerSites(userSites);
      
      // Get blocks within these sites
      const siteIds = userSites.map(site => site.id);
      const userBlocks = blocks.filter(block => siteIds.includes(block.siteId));
      setCustomerBlocks(userBlocks);
      
      // Get active work orders for these sites
      const userOrders = workOrders.filter(
        order => siteIds.includes(order.siteId) && 
        ["published", "inProgress"].includes(order.status)
      );
      setActiveOrders(userOrders);
    }
  }, [currentUser]);

  return (
    <MainLayout pageTitle="Vineyard Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerSites.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across your vineyard operations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerBlocks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Managed growing areas
            </p>
          </CardContent>
        </Card>
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
      </div>

      {/* Sites Overview */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Sites</h2>
        <Button asChild>
          <Link to="/customer/sites">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Site
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {customerSites.length > 0 ? (
          customerSites.map(site => (
            <Card key={site.id} className="overflow-hidden">
              <div className="h-1 bg-primary"></div>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>{site.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blocks:</span>
                    <span className="text-sm font-medium">
                      {blocks.filter(block => block.siteId === site.id).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Orders:</span>
                    <span className="text-sm font-medium">
                      {workOrders.filter(
                        order => order.siteId === site.id && 
                        ["published", "inProgress"].includes(order.status)
                      ).length}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sites Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first vineyard site to get started
            </p>
            <Button asChild>
              <Link to="/customer/sites">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Site
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Blocks Overview */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Blocks</h2>
        <Button asChild>
          <Link to="/customer/blocks">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Block
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {customerBlocks.length > 0 ? (
          customerBlocks.slice(0, 3).map(block => {
            const blockSite = sites.find(site => site.id === block.siteId);
            return (
              <Card key={block.id}>
                <CardHeader>
                  <CardTitle>{block.name}</CardTitle>
                  <CardDescription>
                    {blockSite ? blockSite.name : "Unknown Site"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {block.acres && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Acres:</span>
                        <span className="text-sm font-medium">{block.acres}</span>
                      </div>
                    )}
                    {block.rows && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rows:</span>
                        <span className="text-sm font-medium">{block.rows}</span>
                      </div>
                    )}
                    {block.vines && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Vines:</span>
                        <span className="text-sm font-medium">{block.vines}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <Grape className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Blocks Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Define growing blocks within your vineyard sites
            </p>
            <Button asChild>
              <Link to="/customer/blocks">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Block
              </Link>
            </Button>
          </div>
        )}
        {customerBlocks.length > 3 && (
          <div className="flex justify-center col-span-full mt-2">
            <Button variant="outline" asChild>
              <Link to="/customer/blocks">View All Blocks</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-6">Recent Work Orders</h2>
      <div className="space-y-4">
        {activeOrders.length > 0 ? (
          activeOrders.slice(0, 3).map(order => {
            const orderBlock = blocks.find(block => block.id === order.blockId);
            const orderSite = sites.find(site => site.id === order.siteId);
            return (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)} - {orderBlock?.name || "Unknown Block"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {orderSite?.name || "Unknown Site"} • 
                        {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d")}
                      </p>
                    </div>
                    <Button variant="outline" className="mt-2 md:mt-0">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Work Orders</h3>
            <p className="text-muted-foreground">
              Your site managers will create work orders as needed
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
