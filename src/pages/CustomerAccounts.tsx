import {
  apiCreateAcc,
  apiDeleteAcc,
  apiGetAllAccOrganization,
} from "@/api/account";
import { apiUpdateByFieldUserIds } from "@/api/site";
import AccountResetDialog from "@/components/AccountResetDialog";
import MainLayout from "@/components/MainLayout";
import ManagerForm from "@/components/ManagerForm";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { MAP_ROLE } from "@/lib/utils/role";
import { filter, get } from "lodash";
import {
  Edit,
  KeyRound,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerAccounts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [managers, setManagers] = useState<User[]>([]);

  const handleAddManager = async (data: any) => {
    // Create a new site manager
    try {
      const newManagerSite = {
        ...data,
        role: MAP_ROLE.SITE_MANAGER,
      };
      const res = await apiCreateAcc(newManagerSite);
      await apiUpdateByFieldUserIds(
        { userId: [get(res, "data.metaData.user._id")] },
        data.siteId
      );
      await fetchData();
      // Update local state
      toast({
        title: "Site manager invited",
        description: `${data.name} has been invited as a site manager.`,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleDelete = async (managerToDelete: User) => {
    // Update local state by removing the manager
    try {
      await apiDeleteAcc(managerToDelete);
      await fetchData();
      toast({
        title: "Site manager deleted",
        description: `${managerToDelete.name} has been removed as a site manager.`,
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleRowDoubleClick = (id: string) => {
    navigate(`/customer/managers/edit/${id}`);
  };

  const handleResetAccount = (manager: User) => {
    setSelectedManager(manager);
    setShowResetDialog(true);
  };

  const fetchData = async () => {
    try {
      const { data } = await apiGetAllAccOrganization();
      // console.log("data :>> ", data);
      setManagers(get(data, "metaData"));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const searchUsersByName = (data: Array<User>, keyword: string) => {
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();

      return filter(data, (user) =>
        user.name.toLowerCase().includes(lowerKeyword)
      );
    }
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.length > 0 ? (
                searchUsersByName(managers, searchTerm).map((manager) => (
                  <TableRow
                    key={manager._id}
                    onDoubleClick={() => handleRowDoubleClick(manager._id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {manager.name}
                    </TableCell>
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
                        <span className="text-muted-foreground">
                          Not provided
                        </span>
                      )}
                    </TableCell>
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
                            navigate(`/customer/managers/edit/${manager._id}`);
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
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the site manager account and
                                remove their access to all sites.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(manager)}
                              >
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
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No site managers found
                    </p>
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
          onComplete={() => {
            setSelectedManager(null);
            setShowResetDialog(false);
          }}
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          userName={selectedManager.name}
          userEmail={selectedManager.email}
          userId={selectedManager._id}
        />
      )}
    </MainLayout>
  );
}
