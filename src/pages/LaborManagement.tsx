import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, Trash2, Edit, KeyRound, Users, Settings, MapPin, Eye } from "lucide-react";
import EmployeeForm from "@/components/EmployeeForm";
import RoleManagement from "@/components/RoleManagement";
import { toast } from "@/hooks/use-toast";
import { User, Site } from "@/lib/types";
import AccountResetDialog from "@/components/AccountResetDialog";
import { addUser } from "@/lib/utils/dataManagement";
import SiteManagerForm from "@/components/SiteManagerForm";
import { useAuth } from "@/contexts/AuthContext";
import { apiDeleteAcc, apiGetAllAccOrganization } from "@/api/account";
import { apiGetListSite } from "@/api/site";
import { filter, get } from "lodash";
import { PERMISSION_EMPLOYEE, isPermissionCustomerOrEmployee } from "@/lib/utils/role";

export default function LaborManagement() {
  const { currentUser, permissions } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<false | true | "edit">(false);
  const [managers, setManagers] = useState<User[]>([]);
  const [customerSites, setCustomerSites] = useState<Site[]>([]);

  const [employees, setEmployees] = useState<User[]>(managers);

  // Filter employees by search term, role, site, and employment type
  const filteredEmployees = managers.filter(employee => {
    const searchStr = `${employee.name} ${employee.email} ${employee.phone || ""}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    const matchesSite = siteFilter === "all" || employee.siteId === siteFilter;
    // const matchesEmployment = employmentFilter === "all" || employee.employmentType === employmentFilter;
    return matchesSearch && matchesRole && matchesSite;
  });

  // Get site name for employee
  const getSiteName = (employee: User) => {
    // if (employee.siteId) {
    //   const site = customerSites.find(s => s._id === employee.siteId);
    //   return site?.name || "—";
    // }
    // if (employee.customerId && employee.role === "siteManager") {
    //   // Site managers can work at multiple sites, show customer company
    //   return currentUser?.companyName || "—";
    // }
    // if (employee.role === "worker" && employee.employmentType === "contracted" && employee.serviceCompanyId) {
    //   // For contracted workers, show their service company name
    //   const serviceCompany = managers.find(u => u.id === employee.serviceCompanyId);
    //   return serviceCompany?.companyName || serviceCompany?.name || "—";
    // }
    // if (employee.role === "worker" && employee.employmentType === "direct") {
    //   // For direct workers, show the customer company
    //   return currentUser?.companyName || "—";
    // }
    return "—";
  };

  // Get employment type display for employee
  const getEmploymentType = (employee: User) => {
    if (employee.role === "worker") {
      return employee.employmentType === "direct" ? "Direct Employee" : "Contracted";
    }
    if (["siteManager", "accountant", "hrManager", "receptionist", "dataEntry"].includes(employee.role)) {
      return "Direct Employee";
    }
    return "—";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "siteManager":
        return "bg-blue-100 text-blue-800";
      case "worker":
        return "bg-green-100 text-green-800";
      case "accountant":
        return "bg-purple-100 text-purple-800";
      case "hrManager":
        return "bg-orange-100 text-orange-800";
      case "receptionist":
        return "bg-pink-100 text-pink-800";
      case "dataEntry":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRoleName = (role: string) => {
    switch (role) {
      case "siteManager":
        return "Site Manager";
      case "worker":
        return "Field Worker";
      case "accountant":
        return "Accountant";
      case "hrManager":
        return "HR Manager";
      case "receptionist":
        return "Receptionist";
      case "dataEntry":
        return "Data Entry";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const handleAfterSubmit = async (data: any) => {
    setIsDialogOpen(false);
    await fetchDataAccOrganization();
  };

  const handleDelete = async (employeeToDelete: User) => {
    await apiDeleteAcc(employeeToDelete);
    fetchDataAccOrganization();
    toast({
      title: "Employee deleted",
      description: `${employeeToDelete.name} has been removed.`,
    });
  };

  const handleResetAccount = (employee: User) => {
    setSelectedEmployee(employee);
    setShowResetDialog(true);
  };

  const handleViewEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const fetchDataAccOrganization = async () => {
    try {
      const { data } = await apiGetAllAccOrganization();
      const dataUsers = get(data, "metaData").map((user: User) => {
        user.employmentType = "direct";
        return user;
      });
      setManagers(dataUsers);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const fetchDataListSites = async () => {
    try {
      const { data } = await apiGetListSite({});
      setCustomerSites(get(data, "metaData", []));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    fetchDataAccOrganization();
    fetchDataListSites();
  }, []);

  return (
    <MainLayout pageTitle="Labor Management">
      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-9 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value="siteManager">Site Managers</option>
                <option value="worker">Field Workers</option>
                <option value="accountant">Accountants</option>
                <option value="hrManager">HR Managers</option>
                <option value="receptionist">Receptionists</option>
                <option value="dataEntry">Data Entry</option>
              </select>
              {/* <select
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Employment Types</option>
                <option value="direct">Direct Employees</option>
                <option value="contracted">Contracted Workers</option>
              </select> */}
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Sites</option>
                {customerSites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.name} ({site.locationType})
                  </option>
                ))}
              </select>
            </div>
            {
              isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_EMPLOYEES) &&
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            }
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Site/Company</TableHead>
                    <TableHead>Employment Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow
                        key={employee._id}
                        className="cursor-pointer"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            {employee.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {employee.phone ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              {employee.phone}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(employee.role)}>
                            {formatRoleName(employee.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {getSiteName(employee)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={employee.employmentType === "direct" ? "default" : "secondary"}>
                            {employee.employmentType === "contracted" ? "contracted" : "Direct Employee"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/customer/managers/${employee._id}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {
                              isPermissionCustomerOrEmployee(currentUser, permissions, PERMISSION_EMPLOYEE.MANAGE_EMPLOYEES) &&
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowEmployeeDetails('edit');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleResetAccount(employee)}
                                >
                                  <KeyRound className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the employee
                                        account and remove their access.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(employee)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">No employees found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onComplete={() => setIsDialogOpen(false)}
            onSubmit={handleAfterSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={!!showEmployeeDetails} onOpenChange={v => setShowEmployeeDetails(v ? showEmployeeDetails : false)}>
        <DialogContent className="sm:max-w-[500px] p-0">
          {selectedEmployee && (
            <SiteManagerForm
              manager={selectedEmployee}
              isView={showEmployeeDetails === true}
              isEditing={showEmployeeDetails === 'edit'}
              onCancel={() => setShowEmployeeDetails(false)}
              onSubmit={async (data) => {
                setShowEmployeeDetails(false);
                await fetchDataAccOrganization();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedEmployee && (
        <AccountResetDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          userName={selectedEmployee.name}
          userEmail={selectedEmployee.email}
          userId={selectedEmployee._id}
        />
      )}
    </MainLayout>
  );
}
