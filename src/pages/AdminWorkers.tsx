
import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, PlusCircle, Trash, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import WorkerForm from "@/components/WorkerForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AdminWorkers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workerToDelete, setWorkerToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, number>>({});
  
  // Fetch workers from Supabase
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'worker');
          
        if (error) throw error;
        
        setWorkers(data || []);
        
        // Fetch task counts for each worker
        const { data: taskData, error: taskError } = await supabase
          .from('worker_tasks')
          .select('worker_id, status')
          .eq('status', 'approved');
          
        if (taskError) throw taskError;
        
        const taskCounts: Record<string, number> = {};
        
        taskData?.forEach(task => {
          if (task.worker_id) {
            taskCounts[task.worker_id] = (taskCounts[task.worker_id] || 0) + 1;
          }
        });
        
        setCompletedTasks(taskCounts);
      } catch (error: any) {
        console.error('Error fetching workers:', error);
        toast({
          title: "Error",
          description: "Failed to load workers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkers();
  }, []);
  
  // Filter workers based on search term and status
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = searchTerm === "" || 
      worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      worker.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, we'll consider all workers active
    const matchesStatus = statusFilter === "all" || statusFilter === "active";
    
    return matchesSearch && matchesStatus;
  });
  
  // Delete worker
  const handleDeleteWorker = async () => {
    if (!workerToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Delete worker from Supabase
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', workerToDelete);
        
      if (error) throw error;
      
      // Update local state
      setWorkers(workers.filter(w => w.id !== workerToDelete));
      
      toast({
        title: "Worker deleted",
        description: "Worker has been removed successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting worker:', error);
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
            <WorkerForm onComplete={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
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
                  <TableRow key={worker.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={worker.profile_image} />
                          <AvatarFallback>{worker.name?.charAt(0) || 'W'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">{worker.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{worker.phone || "—"}</TableCell>
                    <TableCell>{completedTasks[worker.id] || 0} tasks</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/workers/${worker.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/workers/edit/${worker.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => setWorkerToDelete(worker.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {worker.name}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setWorkerToDelete(null)}>Cancel</AlertDialogCancel>
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
                    {searchTerm ? "No workers found matching your search." : "No workers added yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
