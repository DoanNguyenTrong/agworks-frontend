import MainLayout from "@/components/MainLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sites, users } from "@/lib/data";
import { Site } from "@/lib/types";
import { addSite } from "@/lib/utils/dataManagement";
import { MAP_ROLE } from "@/lib/utils/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, PlusCircle, Trash, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

const siteFormSchema = z.object({
  name: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  managerId: z.string().optional(),
});

export default function SiteManagement() {
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [customerSites, setCustomerSites] = useState(
    currentUser
      ? sites.filter((site) => site.customerId === currentUser.id)
      : []
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get available site managers
  const siteManagers = users.filter(
    (user) => user.role === MAP_ROLE.SITE_MANAGER
  );

  const form = useForm<z.infer<typeof siteFormSchema>>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      address: "",
      managerId: "",
    },
  });

  function onSubmit(values: z.infer<typeof siteFormSchema>) {
    if (!currentUser) return;

    // Create new site
    const newSite = addSite({
      name: values.name,
      address: values.address,
      customerId: currentUser.id,
      managerId:
        values.managerId && values.managerId !== "no-manager"
          ? values.managerId
          : undefined,
    });

    // Update local state
    setCustomerSites((prev) => [...prev, newSite]);

    toast({
      title: "Site created",
      description: `"${values.name}" has been added to your vineyard.`,
    });

    setIsDialogOpen(false);
    form.reset();
  }

  const handleDeleteSite = () => {
    if (!siteToDelete) return;

    // In a real app, this would delete via API
    // For now, we'll just update local state
    setCustomerSites((prev) =>
      prev.filter((site) => site.id !== siteToDelete.id)
    );

    toast({
      title: "Site deleted",
      description: `"${siteToDelete.name}" has been removed from your vineyard.`,
    });

    setSiteToDelete(null);
  };

  const getManagerName = (managerId: string | undefined) => {
    if (!managerId) return "Unassigned";
    const manager = users.find((user) => user.id === managerId);
    return manager ? manager.name : "Unknown Manager";
  };

  return (
    <MainLayout pageTitle="Site Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Manage your vineyard properties and locations
        </p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vineyard Site</DialogTitle>
              <DialogDescription>
                Enter the details of your new vineyard location.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="North Hill Vineyard" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this vineyard location
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="1234 Vine St, Napa, CA 94558"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The physical address of this vineyard site
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
                      <FormLabel>Site Manager (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no-manager">
                            No manager assigned
                          </SelectItem>
                          {siteManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Assign a manager to oversee operations at this site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create Site</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customerSites.length > 0 ? (
          customerSites.map((site: Site) => (
            <Card key={site.id}>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>Site ID: {site.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {site.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Site Manager</p>
                    <p className="text-sm text-muted-foreground">
                      {getManagerName(site.managerId)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/customer/sites/edit/${site.id}`}>Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/customer/sites/${site.id}`}>View Details</Link>
                  </Button>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Site</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{site.name}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setSiteToDelete(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setSiteToDelete(site);
                          handleDeleteSite();
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sites Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first vineyard site to get started
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Site
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
