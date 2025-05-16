import { apiGetAccList, apiGetAllAccOrganization } from "@/api/account";
import { apiCreateSite } from "@/api/site";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { sites } from "@/lib/data";
import { User } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "lodash";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";

const siteSchema = z.object({
  name: z.string().trim().min(1, "Site name is required"),
  address: z.string().trim().min(1, "Address is required"),
  managerId: z.string().optional(),
});

export default function SiteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const isEditMode = !!id;
  const [siteManagers, setSiteManagers] = useState<Array<User>>([]);
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

  const form = useForm<z.infer<typeof siteSchema>>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: "",
      address: "",
      managerId: "",
    },
  });

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const site = sites.find((s) => s._id === id);
      if (site) {
        form.reset({
          name: site.name,
          address: site.address,
          managerId: site.managerId || "",
        });
      }
    }
  }, [isEditMode, id, form]);

  const onSubmit = async (data: z.infer<typeof siteSchema>) => {
    // Convert "none" value back to empty string or undefined for backend
    const { managerId, ...cloneData } = data;

    const formattedData = {
      ...cloneData,
      userId: managerId ? [managerId] : [],
      organizationId: customerId,
    };

    await apiCreateSite(formattedData);

    // In a real app, you would save this data to your backend
    toast({
      title: isEditMode ? "Site updated" : "Site created",
      description: `Successfully ${isEditMode ? "updated" : "created"} site ${
        data.name
      }`,
    });

    navigate(-1);
  };

  useEffect(() => {
    const getDataManagerSite = async () => {
      try {
        if (location.pathname.includes("customer")) {
          const { data } = await apiGetAllAccOrganization();
          // console.log("data list=> ", data);
          setSiteManagers(get(data, "metaData", []));
        } else {
          //get list with manager role in current organizationId
          const { data } = await apiGetAccList({
            filter: {
              role: "SiteManager",
              organizationId: customerId,
            },
          });
          setSiteManagers(get(data, "metaData", []));
          // console.log("data manager: ", data);
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    getDataManagerSite();
  }, []);

  return (
    <MainLayout pageTitle={isEditMode ? "Edit Site" : "Add New Site"}>
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Site" : "Add New Site"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., North Hill Vineyard"
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this vineyard site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 1234 Vine St, Napa, CA 94558"
                      />
                    </FormControl>
                    <FormDescription>
                      The physical address of this vineyard site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Manager</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      // disabled={!!customerId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a site manager (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="none">None</SelectItem> */}
                        {siteManagers.map((manager) => (
                          <SelectItem key={manager._id} value={manager._id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Assign a manager to oversee this site (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? "Save Changes" : "Create Site"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
