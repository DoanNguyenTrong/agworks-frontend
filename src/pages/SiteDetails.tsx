import { apiGetBlockByFiled } from "@/api/block";
import { apiDeleteSite, apiGetDetailSite } from "@/api/site";
import MainLayout from "@/components/MainLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Block, Site } from "@/lib/types";
import { get } from "lodash";
import { ArrowLeft, Edit, MapPin, Trash, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function SiteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [siteBlocks, setSiteBlocks] = useState<any[]>([]);
  const [manager, setManager] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<number>(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // console.log("id :>> ", id);
    const getDetail = async (id: string) => {
      try {
        const { data } = await apiGetDetailSite(id);
        console.log("data :>> ", data);
        setSite(get(data, "metaData"));
        setManager(get(data, "metaData.userIds", []));
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    const getByBlockBySiteId = async (id: string) => {
      try {
        const { data } = await apiGetBlockByFiled({ siteId: id });
        console.log("data==============:>> ", data);
        setSiteBlocks(get(data, "metaData", []));
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    getByBlockBySiteId(id);
    getDetail(id);
    // if (id) {
    //   const foundSite = allSites.find(s => s.id === id);
    //   if (foundSite) {
    //     setSite(foundSite);

    //     // Get site blocks
    //     const foundBlocks = blocks.filter(b => b.siteId === id);
    //     setSiteBlocks(foundBlocks);

    //     // Get site manager
    //     if (foundSite.managerId) {
    //       const foundManager = users.find(u => u.id === foundSite.managerId);
    //       if (foundManager) {
    //         setManager(foundManager);
    //       }
    //     }

    //     // Count active orders
    //     const ordersCount = workOrders.filter(
    //       order => order.siteId === id &&
    //       ["published", "inProgress"].includes(order.status)
    //     ).length;
    //     setActiveOrders(ordersCount);
    //   }
    // }
  }, [id]);

  const handleDeleteSite = async () => {
    if (!site) return;

    // In a real app, this would call an API
    try {
      await apiDeleteSite(site._id);

      toast({
        title: "Site deleted",
        description: `${site.name} has been deleted.`,
      });
      navigate("/customer/sites");
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  if (!site) {
    return (
      <MainLayout pageTitle="Site Details">
        <div className="flex justify-center items-center h-64">
          <p>Site not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => navigate("/customer/sites")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sites
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">{site.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {site.address}
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate(`/customer/sites/edit/${site._id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Site
            </Button>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {site.name} and all associated
                    blocks. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSite}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteBlocks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {siteBlocks
                .reduce((sum, block) => sum + (block.acres || 0), 0)
                .toFixed(1)}{" "}
              acres
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Site Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] overflow-x-auto">
              {manager.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {manager.map((item) => (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={item?.logo} />
                        <AvatarFallback className="text-lg">
                          {item?.name}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">{item?.name}</p>
                        <p className="text-muted-foreground">{item?.email}</p>
                        {item?.phone && (
                          <p className="text-muted-foreground">{item?.phone}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">No Manager Assigned</p>
                  <p className="text-muted-foreground mb-4">
                    Assign a site manager to oversee work orders.
                  </p>
                  <Button onClick={() => navigate("/customer/accounts")}>
                    Assign Manager
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Blocks</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <div
                onClick={() =>
                  navigate(`/customer/blocks/new?siteId=${site._id}`)
                }
              >
                Add Block
              </div>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] overflow-x-auto">
              {siteBlocks.length > 0 ? (
                <div className="space-y-4">
                  {siteBlocks.map((block: Block) => (
                    <div
                      key={block._id}
                      className="flex justify-between items-center border-b pb-4 last:pb-0 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{block.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {block.acres ? `${block.acres} acres` : ""}
                          {block.acres && block.rows ? " • " : ""}
                          {block.rows ? `${block.rows} rows` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/customer/blocks/edit/${block._id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/customer/blocks/${block._id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    No blocks added to this site yet.
                  </p>
                  <Button variant="outline" asChild>
                    <div
                      onClick={() =>
                        navigate(`/customer/blocks/new?siteId=${site._id}`)
                      }
                    >
                      Add First Block
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="default" asChild>
          <Link to="/customer/blocks">View All Blocks</Link>
        </Button>
      </div>
    </MainLayout>
  );
}
