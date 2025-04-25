import { apiDeleteAcc, apiGetAccDetail } from "@/api/account";
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
import { sites } from "@/lib/data";
import { Site, User } from "@/lib/types";
import { get } from "lodash";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AdminCustomerView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<User | null>(null);
  const [customerSites, setCustomerSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // Fetch customer from local data
        const { data } = await apiGetAccDetail({ id: id });
        setCustomer(get(data, "metaData", {}));

        // if (!customer || customer.role !== "Customer") {
        //   throw new Error("Customer not found");
        // }
        // Fetch customer sites from local data
        const customerSites = sites.filter((site) => site.customerId === id);
        setCustomerSites(customerSites);
      } catch (error: any) {
        console.error("Error fetching customer data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load customer data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  console.log("customer", customer);
  const handleDeleteCustomer = async () => {
    if (!customer) return;

    try {
      setIsDeleting(true);
      await apiDeleteAcc({ _id: customer["_id"] });

      toast({
        title: "Customer deleted",
        description: "Customer has been removed successfully.",
      });

      navigate("/admin/customers");
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Loading Customer Details">
        <div className="flex justify-center items-center py-12">
          <p>Loading customer information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!customer) {
    return (
      <MainLayout pageTitle="Customer Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The customer you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/admin/customers")}>
            Back to Customers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Customer Details">
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate("/admin/customers")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Customers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={customer.logo} />
                <AvatarFallback className="text-2xl">
                  {customer.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <p className="text-muted-foreground">{customer.email}</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Company Name
                </p>
                <p>{customer.companyName || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p>{customer.phone || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p>{customer.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/admin/customers/edit/${customer["_id"]}`)
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
                      {customer.companyName || customer.name}? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCustomer}
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
              <Button size="sm" variant="outline" asChild>
                <Link to={`/admin/sites/new?customerId=${customer._id}`}>
                  Add Site
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {customerSites.length > 0 ? (
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
                  {customerSites.map((site) => (
                    <TableRow key={site._id} className="cursor-pointer">
                      <TableCell>{site.name}</TableCell>
                      <TableCell>{site.address}</TableCell>
                      <TableCell>{site.managerId ? "Assigned" : "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/admin/sites/${site._id}`)}
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
                  No sites found for this customer.
                </p>
                <Button className="mt-4" size="sm" asChild>
                  <Link to={`/admin/sites/new?customerId=${customer._id}`}>
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
