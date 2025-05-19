import { apiDeleteAcc, apiGetAccDetail } from "@/api/account";
import { BASE_URL } from "@/api/config";
import { apiGetListSite } from "@/api/site";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Site, User } from "@/lib/types";
import { get } from "lodash";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function CustomerManagerView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manager, setManager] = useState<User | null>(null);
  const [managerSites, setManagerSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // Fetch manager from local data
        const { data: siteList } = await apiGetListSite({
          number_of_page: 1000,
          filter: {
            organizationId: id,
          },
        });
        setManagerSites(
          get(siteList, "metaData", []).filter((site: any) => {
            return site.userIds.find((user: any) => user._id === id);
          })
        );

        const { data } = await apiGetAccDetail({ id: id });
        setManager(get(data, "metaData", {}));

        // if (!manager || manager.role !== "manager") {
        //   throw new Error("manager not found");
        // }
        // Fetch manager sites from local data
      } catch (error: any) {
        console.error("Error fetching manager data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load manager data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagerData();
  }, [id]);

  const handleDeletemanager = async () => {
    if (!manager) return;

    try {
      setIsDeleting(true);
      await apiDeleteAcc({ _id: manager["_id"] });

      toast({
        title: "manager deleted",
        description: "manager has been removed successfully.",
      });

      navigate("/customer/accounts");
    } catch (error: any) {
      console.error("Error deleting manager:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete manager",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Loading manager Details">
        <div className="flex justify-center items-center py-12">
          <p>Loading manager information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!manager) {
    return (
      <MainLayout pageTitle="Manager Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The manager you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/customer/accounts")}>
            Back to managers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="manager Details">
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate("/customer/accounts")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to managers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Manager Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={
                    manager?.logo &&
                    (!manager?.logo.includes("base64")
                      ? `${BASE_URL}${manager?.logo}`
                      : manager?.logo)
                  }
                  alt={manager?.name}
                />
                <AvatarFallback className="text-2xl">
                  {manager?.name?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{manager?.name || "—"}</h2>
              <p className="text-muted-foreground">{manager?.email || "—"}</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {manager?.companyName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Company Name
                  </p>
                  <p>{manager?.companyName || "—"}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p>{manager?.phone || "—"}</p>
              </div>
              {manager?.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p>{manager?.address || "—"}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p>{new Date(manager?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/customer/managers/edit/${manager["_id"]}`)
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete{" "}
                      {manager?.companyName || manager?.name}? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeletemanager}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sites</CardTitle>
              {/* <Button size="sm" variant="outline" asChild>
                <Link to={`/customer/sites/new?managerId=${manager._id}`}>
                  Add Site
                </Link>
              </Button> */}
            </div>
          </CardHeader>
          <CardContent className="max-h-[460px] overflow-auto">
            {managerSites?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managerSites?.map((site) => (
                    <TableRow key={site?._id} className="cursor-pointer">
                      <TableCell>{site?.name}</TableCell>
                      <TableCell>{site?.address}</TableCell>
                      <TableCell>
                        {site?.userIds.length > 0 ? "Assigned" : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              navigate(`/customer/sites/${site?._id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No sites found for this manager.
                </p>
                <Button className="mt-4" size="sm" asChild>
                  <Link to={`/admin/sites/new?managerId=${manager?._id}`}>
                    Add Site
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
