import { apiGetListSite } from "@/api/site";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Site } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const managerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  siteId: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  sendInvite: z.boolean().default(true),
});

export type ManagerFormData = z.infer<typeof managerSchema>;

export interface ManagerFormProps {
  onComplete?: () => void;
  onSubmit?: (data: ManagerFormData) => void;
  defaultValues?: ManagerFormData;
  isEditMode?: boolean;
}

export default function ManagerForm({
  onComplete,
  onSubmit,
  defaultValues,
  isEditMode = false,
}: ManagerFormProps) {
  const { currentUser } = useAuth();
  const [customerSites, setCustomerSites] = useState<Array<Site>>([]);
  // Get customer sites
  // const customerSites = sites.filter(site => site.customerId === currentUser?.id);

  const form = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      siteId: "",
      password: "",
      sendInvite: true,
    },
  });

  const handleSubmit = (data: ManagerFormData) => {
    console.log("Site manager data:", data);

    if (onSubmit) {
      onSubmit(data);
    } else {
      // Default behavior if no onSubmit is provided
      toast({
        title: isEditMode ? "Site manager updated" : "Site manager created",
        description: isEditMode
          ? `${data.name} has been updated.`
          : `${data.name} has been added as a site manager.`,
      });

      if (onComplete) {
        onComplete();
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiGetListSite({});
        // console.log("data :>> ", data);
        setCustomerSites(get(data, "metaData", []));
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    fetchData();
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
          name="siteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Site</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* <SelectItem value="none">None</SelectItem> */}
                  {customerSites.map((site) => (
                    <SelectItem key={site._id} value={site._id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign this manager to a specific site.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
                    Send an email with login instructions to the site manager.
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
          <Button type="submit">
            {isEditMode ? "Update Site Manager" : "Create Site Manager"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
