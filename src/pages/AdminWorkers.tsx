import { apiCreateAcc, apiDeleteAcc, apiGetAccList } from "@/api/account";
import { BASE_URL } from "@/api/config";
import { apiGetAllWorkerTask } from "@/api/workerTask";
import AccountResetDialog from "@/components/AccountResetDialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WorkerForm, { WorkerFormData } from "@/components/WorkerForm";
import { toast } from "@/hooks/use-toast";
import { users, workerTasks } from "@/lib/data";
import { User } from "@/lib/types";
import { StatusType } from "@/lib/utils/constant";
import { get } from "lodash";
import { Edit, Eye, KeyRound, PlusCircle, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminWorkers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [workersList, setWorkersList] = useState<User[]>(
    users.filter((user) => user.role === "worker")
  );
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  // Filter workers based on search term and status
  const filteredWorkers = workersList.filter((worker) => {
    // Search filter
    const searchString = `${worker?.name} ${worker?.email} ${
      worker?.phone || ""
    }`.toLowerCase();
    if (!searchString.includes(searchTerm.toLowerCase())) return false;

    // Role filter - for now, we'll consider all workers active
    const matchesStatus = statusFilter === "all" || statusFilter === "active";

    return matchesStatus;
  });

  const getList = async () => {
    try {
      const { data } = await apiGetAccList({ filter: { role: "Worker" } });
      // const data = response.metaData;
      setWorkersList(get(data, "metaData", []));
    } catch (error) {
      console.error("Error fetching worker list:", error);
    }
  };

  const getCompletedTask = async () => {
    try {
      const { data } = await apiGetAllWorkerTask({
        filter: { status: StatusType.APPROVED },
      });
      setCompletedTasks(get(data, "metaData", []));
    } catch (error) {
      console.error("Error fetching worker tasks:", error);
    }
  };

  useEffect(() => {
    getList();
    getCompletedTask();
  }, []);

  // Calculate completed tasks for each worker
  const calculateCompletedTasks = (workerId: string = "") => {
    return completedTasks.filter((task) => task?.workerId?._id === workerId)
      .length;
  };

  // Handle adding a new worker
  const handleAddWorker = async (workerData: WorkerFormData) => {
    try {
      const res = await apiCreateAcc({
        email: workerData.email,
        name: workerData.name,
        role: "Worker",
        password: workerData.password || "12345678",
        phone: workerData.phone,
      });

      getList();

      toast({
        title: "Worker added",
        description: "New worker has been added successfully.",
      });

      setShowAddDialog(false);
    } catch (error: any) {
      console.error("Error adding worker:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add worker",
        variant: "destructive",
      });
    }
  };

  // Delete worker
  const handleDeleteWorker = async () => {
    if (!workerToDelete) return;

    try {
      setIsDeleting(true);
      await apiDeleteAcc({ _id: workerToDelete });
      getList();

      toast({
        title: "Worker deleted",
        description: "Worker has been removed successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting worker:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete worker",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setWorkerToDelete(null);
    }
  };

  // Handle account reset
  const handleOpenResetDialog = (worker: User) => {
    setSelectedUser(worker);
    setShowResetDialog(true);
  };

  return (
    <MainLayout pageTitle="Worker Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workers</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new worker account.
              </DialogDescription>
            </DialogHeader>
            <WorkerForm
              onComplete={() => setShowAddDialog(false)}
              onSubmit={handleAddWorker}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 max-h-[540px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Completed Tasks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading workers...
                  </TableCell>
                </TableRow>
              ) : filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <TableRow key={worker["_id"]}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              worker?.logo &&
                              (!worker?.logo.includes("base64")
                                ? `${BASE_URL}${worker?.logo}`
                                : worker?.logo)
                            }
                            alt={worker?.name}
                          />
                          <AvatarFallback>
                            {worker?.name?.charAt(0) || "W"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{worker?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {worker?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{worker?.phone || "—"}</TableCell>
                    <TableCell>
                      {calculateCompletedTasks(worker?._id)} tasks
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
                          <Link to={`/admin/workers/${worker["_id"]}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/workers/edit/${worker["_id"]}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenResetDialog(worker)}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => setWorkerToDelete(worker["_id"])}
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
                                Are you sure you want to delete {worker?.name}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setWorkerToDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteWorker}
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
                  <TableCell colSpan={5} className="text-center py-6">
                    {searchTerm
                      ? "No workers found matching your search."
                      : "No workers added yet."}
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
          onComplete={getList}
          onOpenChange={setShowResetDialog}
          userName={selectedUser?.name}
          userEmail={selectedUser?.email}
          userId={selectedUser["_id"]}
        />
      )}
    </MainLayout>
  );
}
