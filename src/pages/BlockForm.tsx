import { apiCreateBlock } from "@/api/block";
import { apiGetAllSite } from "@/api/site";
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
import { toast } from "@/hooks/use-toast";
import { blocks } from "@/lib/data";
import { Site } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "lodash";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";

const blockSchema = z.object({
  name: z.string().min(1, "Block name is required"),
  siteId: z.string().min(1, "Site is required"),
  acres: z.coerce.number().positive().optional(),
  rows: z.coerce.number().int().positive().optional(),
  vines: z.coerce.number().int().positive().optional(),
});

export default function BlockForm() {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const siteId = searchParams.get("siteId");
  const navigate = useNavigate();
  // const { currentUser } = useAuth();
  const isEditMode = !!id;
  const [sites, setSite] = useState<Array<Site>>([]);

  // Get customer sites
  // console.log("currentUser :>> ", currentUser);
  // const customerSites = sites.filter(
  //   (site) => site.customerId === currentUser?._id
  // );

  const form = useForm<z.infer<typeof blockSchema>>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: "",
      siteId: siteId ? siteId : "",
      acres: undefined,
      rows: undefined,
      vines: undefined,
    },
  });

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const block = blocks.find((b) => b._id === id);
      if (block) {
        form.reset({
          name: block.name,
          siteId: block.siteId,
          acres: block.acres,
          rows: block.rows,
          vines: block.vines,
        });
      }
    }
  }, [isEditMode, id, form]);

  useEffect(() => {
    const getSite = async () => {
      try {
        const { data } = await apiGetAllSite();
        setSite(get(data, "metaData", []));
      } catch (error) {
        console.log("error :>> ", error);
      }
    };
    getSite();
  }, []);

  const onSubmit = async (data: z.infer<typeof blockSchema>) => {
    // In a real app, you would save this data to your backend
    try {
      await apiCreateBlock(data);
      toast({
        title: isEditMode ? "Block updated" : "Block created",
        description: `Successfully ${
          isEditMode ? "updated" : "created"
        } block ${data.name}`,
      });

      navigate("/customer/blocks");
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <MainLayout pageTitle={isEditMode ? "Edit Block" : "Add New Block"}>
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate("/customer/blocks")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blocks
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Block" : "Add New Block"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block Name*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Block A - Cabernet"
                      />
                    </FormControl>
                    <FormDescription>
                      Give this block a descriptive name, typically including
                      variety.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!siteId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site._id} value={site._id}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select which vineyard site this block belongs to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="acres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acres</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="e.g., 5.2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rows"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rows</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="e.g., 52"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Vines</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="e.g., 2080"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customer/blocks")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? "Save Changes" : "Create Block"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
