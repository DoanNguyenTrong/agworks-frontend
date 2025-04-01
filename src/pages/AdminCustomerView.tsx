
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sites, users } from "@/lib/data";
import { User, Site } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Link } from "react-router-dom";

export default function AdminCustomerView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<User | null>(null);
  const [customerSites, setCustomerSites] = useState<Site[]>([]);

  useEffect(() => {
    if (id) {
      const foundCustomer = users.find(user => user.id === id && user.role === "customer");
      if (foundCustomer) {
        setCustomer(foundCustomer);
        // Get customer sites
        const foundSites = sites.filter(site => site.customerId === id);
        setCustomerSites(foundSites);
      }
    }
  }, [id]);

  if (!customer) {
    return (
      <MainLayout pageTitle="Customer Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The customer you're looking for doesn't exist or you don't have permission to view it.
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
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate("/admin/customers")}>
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
                <AvatarFallback className="text-2xl">{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <p className="text-muted-foreground">{customer.email}</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                <p>{customer.companyName || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{customer.phone || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{customer.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sites</CardTitle>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/admin/sites/new?customerId=${customer.id}`}>Add Site</Link>
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
                  {customerSites.map(site => {
                    const manager = site.managerId 
                      ? users.find(user => user.id === site.managerId) 
                      : null;
                    
                    return (
                      <TableRow 
                        key={site.id}
                        onDoubleClick={() => navigate(`/admin/sites/${site.id}`)}
                        className="cursor-pointer"
                      >
                        <TableCell>{site.name}</TableCell>
                        <TableCell>{site.address}</TableCell>
                        <TableCell>{manager ? manager.name : "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => navigate(`/admin/sites/${site.id}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No sites found for this customer.</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link to={`/admin/sites/new?customerId=${customer.id}`}>Add Site</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
