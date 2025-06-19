
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { users, workerTasks } from "@/lib/data";

export default function ServiceWorkers() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get workers belonging to this service company
  const companyWorkers = users.filter(user => 
    user.role === 'worker' && user.serviceCompanyId === currentUser?.id
  );
  
  // Filter workers based on search term
  const filteredWorkers = companyWorkers.filter(worker => {
    const searchString = `${worker.name} ${worker.email} ${worker.phone || ""}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });
  
  // Calculate completed tasks for each worker
  const calculateCompletedTasks = (workerId: string) => {
    return workerTasks.filter(task => 
      task.workerId === workerId && task.status === "approved"
    ).length;
  };

  return (
    <MainLayout pageTitle="Company Workers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Your Workers</h1>
              <p className="text-muted-foreground">
                Manage workers assigned to {currentUser?.companyName}
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Workers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Completed Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={worker.profileImage} />
                            <AvatarFallback>{worker.name?.charAt(0) || 'W'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{worker.name}</p>
                            <p className="text-sm text-muted-foreground">{worker.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{worker.phone || "—"}</TableCell>
                      <TableCell>{calculateCompletedTasks(worker.id)} tasks</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(worker.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : searchTerm ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No workers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No workers assigned to your company yet.</p>
                        <p className="text-sm text-muted-foreground">
                          Contact your admin to assign workers to your company.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Card */}
        {companyWorkers.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{companyWorkers.length}</div>
                  <div className="text-sm text-muted-foreground">Total Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {workerTasks.filter(task => 
                      companyWorkers.some(worker => worker.id === task.workerId) && 
                      task.status === 'approved'
                    ).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {workerTasks.filter(task => 
                      companyWorkers.some(worker => worker.id === task.workerId) && 
                      task.status === 'pending'
                    ).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
