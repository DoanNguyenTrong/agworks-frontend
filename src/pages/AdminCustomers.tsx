import { apiCreateAcc, apiDeleteAcc, apiGetAccList } from "@/api/account";
import { apiGetListSite } from "@/api/site";
import AccountResetDialog from "@/components/AccountResetDialog";
import CustomerForm, { CustomerFormData } from "@/components/CustomerForm";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { MAP_ROLE } from "@/lib/utils/role";
import { get } from "lodash";
import { Edit, Eye, KeyRound, PlusCircle, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminCustomers() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [customersList, setCustomersList] = useState<User[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter customers based on search term
  const filteredCustomers = customersList.filter(
    (customer) =>
      searchTerm === "" ||
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getList = async () => {
    try {
      const { data } = await apiGetAccList({
        filter: { role: MAP_ROLE.CUSTOIMER },
      });
      // const data = response.metaData;
      setCustomersList(get(data, "metaData", []));
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const getListSite = async () => {
    try {
      const { data } = await apiGetListSite({});
      setSites(get(data, "metaData", []));
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    getListSite();
    getList();
  }, []);

  // Handle adding a new customer
  const handleAddCustomer = async (data: CustomerFormData) => {
    try {
      if (!data || !data.email) {
        throw new Error("Customer data is missing required fields");
      }

      // Add new customer using the data management utility
      const newCustomer = {
        email: data.email,
        name: data.name,
        role: "Customer",
        password: data.password || "12345678",
        companyName: data.companyName,
        phone: data.phone,
        address: data.address,
      };

      await apiCreateAcc(newCustomer);

      getList(); // Update the customers list with the new customer

      // Add the new customer to our local state

      toast({
        title: "Customer added",
        description: "New customer has been added successfully.",
      });

      setShowAddDialog(false);
    } catch (error: any) {
      console.error("Error adding customer:", error);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      setIsDeleting(true);
      await apiDeleteAcc({ _id: customerToDelete });
      const { data } = await apiGetAccList({
        filter: { organizationId: customerToDelete },
      });

      // remove site manager when customer created acc
      const accManagerSite = get(data, "metaData", []).map((i) => i._id);
      if (accManagerSite.length > 0) {
        await Promise.all(
          accManagerSite.map((idAcc: string) => apiDeleteAcc({ _id: idAcc }))
        );
      }

      // get list acc cus
      await getList();

      toast({
        title: "Customer deleted",
        description: "Customer has been removed successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeleting(false);
      setCustomerToDelete(null);
    }
  };

  // Handle account reset
  const handleOpenResetDialog = (customer: User) => {
    setSelectedUser(customer);
    setShowResetDialog(true);
  };

  return (
    <MainLayout pageTitle="Customer Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-72 mb-4 md:mb-0">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new customer account.
              </DialogDescription>
            </DialogHeader>
            <CustomerForm
              onComplete={() => setShowAddDialog(false)}
              onSubmit={handleAddCustomer}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 max-h-[540px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer["_id"]}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.logo} />
                          <AvatarFallback>
                            {customer.name?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.companyName || "—"}</TableCell>
                    <TableCell>{customer.phone || "—"}</TableCell>
                    <TableCell>
                      {
                        sites.filter((i) => i?.organizationId === customer._id)
                          .length
                      }{" "}
                      Sites
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/customers/${customer["_id"]}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/customers/edit/${customer["_id"]}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenResetDialog(customer)}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() =>
                                setCustomerToDelete(customer["_id"])
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                {customer.companyName || customer.name}? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setCustomerToDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    {searchTerm
                      ? "No customers found matching your search."
                      : "No customers added yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <AccountResetDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          onComplete={getList}
          userName={selectedUser.name}
          userEmail={selectedUser.email}
          userId={selectedUser["_id"]}
        />
      )}
    </MainLayout>
  );
}
