import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { users, sites } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { getAllRolesByOrganization } from "@/api/role";
import { Role } from "@/lib/types";
import { MAP_ROLE } from "@/lib/utils/role";
import {
  apiCreateAcc,
  apiDeleteAcc,
  apiGetAllAccOrganization,
} from "@/api/account";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  employeeRoleId: z.string().min(1, "Employee Role is required"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  sendInvite: z.boolean().default(true),
  // serviceCompanyId: z.string().optional(),
  // siteId: z.string().optional(),
  employmentType: z.enum(["direct", "contracted"]).optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export interface EmployeeFormProps {
  onComplete?: () => void;
  onSubmit?: (data: EmployeeFormData) => void;
  defaultValues?: EmployeeFormData;
  isEditMode?: boolean;
  employeeId?: string;
}

export default function EmployeeForm({
  onComplete,
  onSubmit,
  defaultValues,
  isEditMode = false,
  employeeId
}: EmployeeFormProps) {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [selectedRole, setSelectedRole] = useState(defaultValues?.role || "");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(defaultValues?.employmentType || "direct");
  const [roles, setRoles] = useState<Role[]>([]);

  // Get service companies for dropdown
  const serviceCompanies = users.filter(user => user.role === 'serviceCompany');

  // Get customer's sites for dropdown
  const customerSites = sites.filter(site => site.customerId === currentUser?._id);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      password: "",
      employeeRoleId: undefined,
      sendInvite: true,
      // siteId: "none",
      employmentType: "direct",
    },
  });

  const handleSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const newEmployee = {
        ...data,
        role: MAP_ROLE.EMPLOYEE,
      };
      await apiCreateAcc(newEmployee);

      const role = roles.find((role: Role) => role._id == data.employeeRoleId)

      toast({
        title: "Employee added",
        description: `${data.name} has been added as a ${role.name}.`,
      });
      setIsSubmitting(false);
      onSubmit(newEmployee);
    } catch (error) {
      console.log("error :>> ", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save employee",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Check if role requires site assignment
  // const requiresSiteAssignment = ["accountant", "hrManager", "receptionist", "dataEntry"].includes(selectedRole);
  // const isFieldWorker = selectedRole === "worker";
  // const isContractedWorker = isFieldWorker && selectedEmploymentType === "contracted";

  const fetchDataRoles = async () => {
    const res = await getAllRolesByOrganization();
    setRoles(res.data);
  }

  useEffect(() => {
    fetchDataRoles();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormDescription>
                  Used for login and notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="employeeRoleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role*</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    roles.map((role, index) => {
                      return <SelectItem key={index} value={role._id}>{role.name}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
              <FormDescription>
                Define the employee's role and permissions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type*</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="direct">Direct Employee</SelectItem>
                  <SelectItem value="contracted">Contracted Worker</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether this is a direct employee or a contracted worker through a service company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {requiresSiteAssignment && (
          <FormField
            control={form.control}
            name="siteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Site*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customerSites.map((site) => (
                      <SelectItem key={site._id} value={site._id}>
                        {site.name} ({site.locationType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Assign this employee to a specific site location.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        {/* {isContractedWorker && (
          <FormField
            control={form.control}
            name="serviceCompanyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Company*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceCompanies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.companyName || company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the service company this contracted worker belongs to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password*</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  If left empty, a temporary password will be generated.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Street, City, State, ZIP"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditMode && (
          <FormField
            control={form.control}
            name="sendInvite"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Send invitation email</FormLabel>
                  <FormDescription>
                    Send an email with login instructions to the employee.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? (isEditMode ? "Updating..." : "Creating...")
              : (isEditMode ? "Update Employee" : "Create Employee")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
