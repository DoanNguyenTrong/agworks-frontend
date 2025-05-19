import { apiCreateAcc, apiGetAllAccOrganization } from "@/api/account";
import { apiGetListBlock } from "@/api/block";
import { apiGetListSite, apiUpdateByFieldUserIds } from "@/api/site";
import { apiGetWorkOrderByUser } from "@/api/workOrder";
import MainLayout from "@/components/MainLayout";
import ManagerForm from "@/components/ManagerForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { MAP_ROLE } from "@/lib/utils/role";
import clsx from "clsx";
import { format } from "date-fns";
import { get } from "lodash";
import { ClipboardList, Grape, Map, PlusCircle, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const [customerSites, setCustomerSites] = useState([]);
  const [customerBlocks, setCustomerBlocks] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [isAddManagerDialogOpen, setIsAddManagerDialogOpen] = useState(false);
  const [managers, setManagers] = useState([]);

  const getDataBlocks = async () => {
    try {
      const { data } = await apiGetListBlock({ number_of_page: 1000 });
      setCustomerBlocks(get(data, "metaData", []));
      // console.log("Block :>> ", get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const getDataSite = async () => {
    try {
      const { data } = await apiGetListSite({});
      // console.log("Site :>> ", get(data, "metaData", []));
      setCustomerSites(get(data, "metaData", []));
      // const { data } = await apiGetSearchSiteByUser();
      // setCustomerSites(data);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const getAllManagers = async () => {
    try {
      const { data } = await apiGetAllAccOrganization();
      setManagers(get(data, "metaData"));
      // console.log("Acc :>> ", get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    getDataBlocks();
    getAllManagers();
    getDataSite();
  }, []);

  useEffect(() => {
    const getDataWorkOrders = async () => {
      const { data } = await apiGetWorkOrderByUser({
        userIds: managers.map((manager) => manager._id),
      });
      setWorkOrders(get(data, "metaData", []));
    };

    getDataWorkOrders();
  }, [managers]);

  const handleAddManager = async (data: any) => {
    // In a real app, this would make an API call
    try {
      const newManagerSite = {
        ...data,
        role: MAP_ROLE.SITE_MANAGER,
      };
      const res = await apiCreateAcc(newManagerSite);
      if (data?.siteId) {
        await apiUpdateByFieldUserIds(
          { userId: [get(res, "data.metaData.user._id")] },
          data.siteId
        );
      }
      await getAllManagers();
      // Update local state
      // toast({
      //   title: "Site manager invited",
      //   description: `${data.name} has been invited as a site manager.`,
      // });
      setIsAddManagerDialogOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <MainLayout pageTitle="Vineyard Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerSites?.length}</div>
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
            <div className="text-2xl font-bold">{customerBlocks?.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Managed growing areas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders?.length}</div>
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
          <Link to="/customer/sites/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Site
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {customerSites?.length > 0 ? (
          customerSites?.slice(0, 3).map((site) => (
            <Card key={site?._id} className="overflow-hidden">
              <div className="h-1 bg-primary"></div>
              <CardHeader>
                <CardTitle>{site?.name}</CardTitle>
                <CardDescription>{site?.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Blocks:
                    </span>
                    <span className="text-sm font-medium">
                      {
                        customerBlocks?.filter(
                          (block) => get(block, "siteId._id") === site?._id
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active Orders:
                    </span>
                    <span className="text-sm font-medium">
                      {
                        workOrders?.filter(
                          (order) =>
                            order?.siteId === site?.id &&
                            ["New", "InProgress"].includes(order?.status)
                        ).length
                      }
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/customer/sites/${site?._id}`}>View Details</Link>
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
              <Link to="/customer/sites/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Site
              </Link>
            </Button>
          </div>
        )}
      </div>

      {customerSites?.length > 3 && (
        <div className="flex justify-center mb-12">
          <Button variant="outline" asChild>
            <Link to="/customer/sites">View All Sites</Link>
          </Button>
        </div>
      )}
      {customerSites?.length > 0 && customerSites?.length <= 3 && (
        <div className="mb-12"></div>
      )}

      {/* Blocks Overview */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Blocks</h2>
        <Button asChild>
          <Link to="/customer/blocks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Block
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {customerBlocks?.length > 0 ? (
          customerBlocks?.slice(0, 3).map((block) => {
            const siteManager = get(block, "siteId", null);
            return (
              <Card key={block?._id}>
                <CardHeader>
                  <CardTitle>{block?.name}</CardTitle>
                  <CardDescription>
                    {siteManager ? siteManager?.name : "Unknown Site"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {block?.acres && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Acres:
                        </span>
                        <span className="text-sm font-medium">
                          {block?.acres}
                        </span>
                      </div>
                    )}
                    {block?.rows && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Rows:
                        </span>
                        <span className="text-sm font-medium">
                          {block?.rows}
                        </span>
                      </div>
                    )}
                    {block?.vines && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Vines:
                        </span>
                        <span className="text-sm font-medium">
                          {block?.vines}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/customer/blocks/${block?._id}`}>
                      View Details
                    </Link>
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
              <Link to="/customer/blocks/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Block
              </Link>
            </Button>
          </div>
        )}
        {customerBlocks?.length > 3 && (
          <div className="flex justify-center col-span-full mt-2">
            <Button variant="outline" asChild>
              <Link to="/customer/blocks">View All Blocks</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Site Manager Overview */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Site Managers</h2>
        <Button onClick={() => setIsAddManagerDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Site Manager
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {managers.length > 0 ? (
          managers.slice(0, 3).map((manager) => {
            const siteManager = get(manager, "siteId", null);
            return (
              <Card key={manager?._id}>
                <CardHeader>
                  <CardTitle>{manager?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {manager?.email && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Email:
                        </span>
                        <span className="text-sm font-medium">
                          {manager?.email}
                        </span>
                      </div>
                    )}
                    {manager?.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Phone:
                        </span>
                        <span className="text-sm font-medium">
                          {manager?.phone}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/customer/managers/${manager?._id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <Grape className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Managers Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Assign managers to your vineyard sites to supervise work orders
              and oversee field operations.
            </p>
            <Button onClick={() => setIsAddManagerDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Site Manager
            </Button>
          </div>
        )}
        {managers?.length > 3 && (
          <div className="flex justify-center col-span-full mt-2">
            <Button variant="outline" asChild>
              <Link to="/customer/accounts">View All Managers</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-6">Recent Work Orders</h2>
      <div className="space-y-4 max-h-[560px] overflow-y-auto">
        {workOrders?.length > 0 ? (
          workOrders?.map((order) => {
            const orderBlock = customerBlocks?.find(
              (block) => block?._id === order?.blockId
            );
            const orderSite = customerSites?.find(
              (site) => site?._id === order?.siteId
            );
            return (
              <Card key={order?._id} className="max-h-[120px] overflow-y-auto">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order?.workType.charAt(0).toUpperCase() +
                          order?.workType.slice(1)}{" "}
                        - {orderBlock?.name || "Unknown Block"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {orderSite?.name || "Unknown Site"}
                        <span> • </span>
                        {format(new Date(order?.startDate), "MMM d")} -{" "}
                        {format(new Date(order?.endDate), "MMM d")}
                      </p>
                    </div>

                    <Button variant="outline" className="mt-2 md:mt-0">
                      <Link to={`/customer/work-order/detail/${order?._id}`}>
                        View Details
                      </Link>
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

      <Dialog
        open={isAddManagerDialogOpen}
        onOpenChange={setIsAddManagerDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Site Manager</DialogTitle>
          </DialogHeader>
          <ManagerForm
            onComplete={() => setIsAddManagerDialogOpen(false)}
            onSubmit={handleAddManager}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
