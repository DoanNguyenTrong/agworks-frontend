
import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import WorkerForm from "@/components/WorkerForm";
import { User } from "@/lib/types";
import { fetchUsers, fetchWorkerTasks } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminWorkers() {
  const [workers, setWorkers] = useState<User[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsers("worker");
        setWorkers(data);
      } catch (error) {
        console.error("Error loading workers:", error);
        toast({
          title: "Error",
          description: "Failed to load workers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkers();
  }, [toast]);

  return (
    <MainLayout pageTitle="Worker Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Workers</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
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
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p>Loading workers...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.length > 0 ? (
                  workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={worker.profileImage} />
                            <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{worker.name}</p>
                            <p className="text-sm text-muted-foreground">{worker.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{worker.phone || "—"}</TableCell>
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
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No workers found. Add a worker to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
