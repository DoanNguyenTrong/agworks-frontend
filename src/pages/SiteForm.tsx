import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Grape } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiCreateSite, apiUpdateSite, apiGetListSite, apiGetDetailSite } from "@/api/site";
import { User } from "@/lib/types";
import { apiGetAccList, apiGetAllAccOrganization } from "@/api/account";
import { useWatch } from "react-hook-form";
import { get, uniq } from "lodash";

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  address: z.string().min(1, "Address is required"),
  locationType: z.enum(["vineyard", "office"], {
    required_error: "Please select a location type",
  }),
  description: z.string().optional(),
  managerId: z.string().optional(),
});

export default function SiteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [siteManagers, setSiteManagers] = useState<Array<User>>([]);
  const [siteData, setSiteData] = useState<any>(null);
  const [watchedLocationType, setWatchedLocationType] = useState<string>("");
  const [curentManager, setCurentManager] = useState<Array<User>>([]);

  const form = useForm<z.infer<typeof siteSchema>>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: "",
      address: "",
      locationType: "vineyard",
      description: "",
      managerId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof siteSchema>) => {
    // Convert "none" value back to empty string or undefined for backend
    const { managerId, ...cloneData } = data;
    if (isEditMode && id) {
      const formattedData = {
        ...cloneData,
        userId: uniq([
          ...curentManager.map((i: any) => i._id),
          currentUser._id,
        ]).filter((item) => item !== ""),
      };
      await apiUpdateSite(formattedData, id)
    } else {
      const formattedData = {
        ...cloneData,
        userId: [currentUser._id],
      };
      await apiCreateSite(formattedData);
    }

    // In a real app, you would save this data to your backend
    toast({
      title: isEditMode ? "Site updated" : "Site created",
      description: `Successfully ${isEditMode ? "updated" : "created"} ${data.locationType} site ${data.name}`,
    });

    navigate(-1);
  };

  const locationType = useWatch({
    control: form.control,
    name: "locationType",
  });

  useEffect(() => {
    if (!isEditMode || !id) return;
    const getDetail = async (id: string) => {
      try {
        const { data } = await apiGetDetailSite(id);
        const site = data.metaData
        setSiteData(get(data, "metaData", {}));
        setCurentManager(get(data, "metaData.userIds", ""));
        form.reset({
          name: site.name,
          address: site.address,
          locationType: site.locationType,
          description: site.description || "",
          managerId: site.managerId || "",
        });
      } catch (error) {
        console.log("error :>> ", error);
      } finally {
      }
    };

    getDetail(id);
  }, [id]);

  useEffect(() => {
    setWatchedLocationType(form.getValues("locationType"));
  }, [locationType, form]);

  useEffect(() => {
    const getDataManagerSite = async () => {
      try {
        if (location.pathname.includes("customer")) {
          const { data } = await apiGetAllAccOrganization();
          setSiteManagers(get(data, "metaData", []));
        } else {
          const { data } = await apiGetAccList({
            filter: {
              role: "SiteManager",
              organizationId: customerId,
            },
          });
          setSiteManagers(get(data, "metaData", []));
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    getDataManagerSite();
  }, []);

  return (
    <MainLayout pageTitle={isEditMode ? "Edit Site" : "Add New Site"}>
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate("/customer/sites")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sites
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
                name="locationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Location Type*</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="vineyard" id="vineyard" />
                          <Label htmlFor="vineyard" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Grape className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">Vineyard</div>
                              <div className="text-sm text-muted-foreground">
                                Wine grape growing location with blocks and vines
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="font-medium">Office</div>
                              <div className="text-sm text-muted-foreground">
                                Administrative office, tasting room, or facility
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          watchedLocationType === "vineyard"
                            ? "e.g., North Hill Vineyard"
                            : "e.g., Corporate Office"
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this {watchedLocationType} location.
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
                      <Input {...field} placeholder="e.g., 1234 Vine St, Napa, CA 94558" />
                    </FormControl>
                    <FormDescription>
                      The physical address of this location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={
                          watchedLocationType === "vineyard"
                            ? "e.g., Premium wine grape vineyard with excellent soil conditions"
                            : "e.g., Main administrative office and tasting room"
                        }
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description providing more details about this location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedLocationType === "vineyard" && (
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Manager</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a site manager (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {siteManagers.map(manager => (
                            <SelectItem key={manager._id} value={manager._id}>
                              {manager.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Assign a manager to oversee this vineyard (optional). Only applicable for vineyard locations.
                      </FormDescription>
                      <div className="py-4 text-[14px] flex justify-start items-center gap-2">
                        <div>Site Manager selected:</div>
                        {curentManager.map((i: User, idx) => (
                          <div
                            key={i._id}
                            onDoubleClick={() =>
                              setCurentManager(
                                curentManager.filter((u: User) => u._id !== i._id)
                              )
                            }
                            className="flex items-center gap-1"
                          >
                            <div className="bg-blue-200 hover:bg-red-500 px-5 py-1 rounded-full font-bold cursor-pointer delete-user">
                              <div className="name">{i.name}</div>
                              <div className="des hidden text-[#FFF]">Delete</div>
                            </div>
                            {idx < curentManager.length - 1 && <>,</>}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/customer/sites")}>
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
