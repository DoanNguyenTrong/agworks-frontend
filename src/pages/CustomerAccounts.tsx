
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Mail, Phone, Trash2, Edit, KeyRound } from "lucide-react";
import ManagerForm from "@/components/ManagerForm";
import { toast } from "@/hooks/use-toast";
import { users } from "@/lib/data";
import { User } from "@/lib/types";
import AccountResetDialog from "@/components/AccountResetDialog";
import { addUser } from "@/lib/utils/dataManagement";

export default function CustomerAccounts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [siteManagers, setSiteManagers] = useState<User[]>(
    users.filter(user => user.role === "siteManager")
  );

  // Filter managers by search term
  const filteredManagers = siteManagers.filter(manager => {
    const searchStr = `${manager.name} ${manager.email} ${manager.phone || ""}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  // Get company name for site manager
  const getCompanyName = (manager: User) => {
    if (manager.customerId) {
      const customer = users.find(u => u.id === manager.customerId && u.role === "customer");
      return customer?.companyName || "—";
    }
    return "—";
  };

  const handleAddManager = (data: any) => {
    // Create a new site manager
    const newManager = addUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "siteManager",
      customerId: users.find(u => u.role === "customer")?.id
    });
    
    // Update local state
    setSiteManagers(prev => [...prev, newManager]);
    
    toast({
      title: "Site manager invited",
      description: `${data.name} has been invited as a site manager.`,
    });
    
    setIsDialogOpen(false);
  };

  const handleDelete = (managerToDelete: User) => {
    // Update local state by removing the manager
    setSiteManagers(prev => prev.filter(manager => manager.id !== managerToDelete.id));
    
    toast({
      title: "Site manager deleted",
      description: `${managerToDelete.name} has been removed as a site manager.`,
    });
  };

  const handleRowDoubleClick = (id: string) => {
    navigate(`/customer/managers/edit/${id}`);
  };

  const handleResetAccount = (manager: User) => {
    setSelectedManager(manager);
    setShowResetDialog(true);
  };

  return (
    <MainLayout pageTitle="Site Managers">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-auto mb-4 md:mb-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search site managers..."
            className="pl-9 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Site Manager
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager) => (
                  <TableRow 
                    key={manager.id} 
                    onDoubleClick={() => handleRowDoubleClick(manager.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {manager.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {manager.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {manager.phone}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </TableCell>
                    <TableCell>{getCompanyName(manager)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/customer/managers/edit/${manager.id}`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetAccount(manager);
                          }}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the site manager
                                account and remove their access to all sites.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(manager)}>
                                Delete
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
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No site managers found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Site Manager</DialogTitle>
          </DialogHeader>
          <ManagerForm
            onComplete={() => setIsDialogOpen(false)}
            onSubmit={handleAddManager}
          />
        </DialogContent>
      </Dialog>

      {selectedManager && (
        <AccountResetDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          userName={selectedManager.name}
          userEmail={selectedManager.email}
          userId={selectedManager.id}
        />
      )}
    </MainLayout>
  );
}
