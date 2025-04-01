
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, Filter } from "lucide-react";
import { useState } from "react";
import { users, sites, workOrders } from "@/lib/data";
import { User } from "@/lib/types";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  // Filter users by search term and role
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchString = `${user.name} ${user.email} ${user.role} ${user.companyName || ""}`.toLowerCase();
    if (!searchString.includes(searchTerm.toLowerCase())) return false;
    
    // Role filter
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    
    // Date filter (mock implementation - would use actual dates in real app)
    if (dateFilter === "recent") {
      // Simulate filtering for users created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(user.createdAt) < thirtyDaysAgo) return false;
    } else if (dateFilter === "thisYear") {
      // Simulate filtering for users created this year
      const thisYear = new Date().getFullYear();
      if (new Date(user.createdAt).getFullYear() !== thisYear) return false;
    }
    
    return true;
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

  const handleRowDoubleClick = (user: User) => {
    // Navigate to user details page based on role
    if (user.role === "customer") {
      navigate(`/admin/customers/${user.id}`);
    } else if (user.role === "worker") {
      navigate(`/admin/workers/${user.id}`);
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
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{users.length}</div>
              <Select 
                defaultValue="all" 
                onValueChange={(value) => setRoleFilter(value)}
                value={roleFilter}
              >
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Vineyard Owners</SelectItem>
                  <SelectItem value="siteManager">Site Managers</SelectItem>
                  <SelectItem value="worker">Field Workers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{customerCount}</div>
              <Tabs 
                defaultValue="all" 
                className="w-[130px]"
                onValueChange={(value) => {
                  setRoleFilter(value === "all" ? "customer" : "customer");
                  setDateFilter(value);
                }}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs px-2">Recent</TabsTrigger>
                  <TabsTrigger value="thisYear" className="text-xs px-2">This Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
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
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{siteManagerCount}</div>
              <Tabs 
                defaultValue="all" 
                className="w-[130px]"
                onValueChange={(value) => {
                  setRoleFilter(value === "all" ? "siteManager" : "siteManager");
                  setDateFilter(value);
                }}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs px-2">Recent</TabsTrigger>
                  <TabsTrigger value="thisYear" className="text-xs px-2">This Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
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
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{workerCount}</div>
              <Tabs 
                defaultValue="all" 
                className="w-[130px]"
                onValueChange={(value) => {
                  setRoleFilter(value === "all" ? "worker" : "worker");
                  setDateFilter(value);
                }}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs px-2">Recent</TabsTrigger>
                  <TabsTrigger value="thisYear" className="text-xs px-2">This Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completing tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setDateFilter(value)}
            value={dateFilter}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="recent">Last 30 Days</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer"
                  onDoubleClick={() => handleRowDoubleClick(user)}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.companyName || "-"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
