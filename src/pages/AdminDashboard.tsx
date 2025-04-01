
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { users, sites, workOrders } from "@/lib/data";
import { User } from "@/lib/types";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter users by search term
  const filteredUsers = users.filter(user => {
    const searchString = `${user.name} ${user.email} ${user.role}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });
  
  // Customer and worker counts
  const customerCount = users.filter(user => user.role === "customer").length;
  const workerCount = users.filter(user => user.role === "worker").length;
  const siteManagerCount = users.filter(user => user.role === "siteManager").length;
  
  // Get role badge color
  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "customer":
        return <Badge className="bg-agworks-green">Vineyard Owner</Badge>;
      case "siteManager":
        return <Badge className="bg-blue-500">Site Manager</Badge>;
      case "worker":
        return <Badge className="bg-agworks-brown">Field Worker</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout pageTitle="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all roles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vineyard Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Managing {sites.length} sites
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Site Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteManagerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overseeing operations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Field Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completing tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.companyName || "-"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">System Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vineyard Sites</CardTitle>
              <CardDescription>Total sites by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Napa Valley</span>
                  <Badge variant="outline">12 sites</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sonoma</span>
                  <Badge variant="outline">8 sites</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Central Coast</span>
                  <Badge variant="outline">5 sites</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-3 w-3" />
                    View All Sites
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>Current status overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>In Progress</span>
                  <Badge>
                    {workOrders.filter(order => order.status === "inProgress").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Published</span>
                  <Badge variant="secondary">
                    {workOrders.filter(order => order.status === "published").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <Badge className="bg-agworks-green">
                    {workOrders.filter(order => order.status === "completed").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-3 w-3" />
                    View All Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
