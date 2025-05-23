
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { sites, blocks } from "@/lib/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, MapPin, Grape, Rows } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const blockFormSchema = z.object({
  name: z.string().min(2, {
    message: "Block name must be at least 2 characters.",
  }),
  siteId: z.string().min(1, {
    message: "Please select a site.",
  }),
  acres: z.number().min(0.1, {
    message: "Acreage must be at least 0.1 acres.",
  }).optional(),
  rows: z.number().min(1, {
    message: "Number of rows must be at least 1.",
  }).optional(),
  vines: z.number().min(1, {
    message: "Number of vines must be at least 1.",
  }).optional(),
});

export default function BlockManagement() {
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get customer sites and blocks
  const customerSites = currentUser
    ? sites.filter(site => site.customerId === currentUser.id)
    : [];
  
  const siteIds = customerSites.map(site => site.id);
  const customerBlocks = blocks.filter(block => siteIds.includes(block.siteId));

  const form = useForm<z.infer<typeof blockFormSchema>>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      name: "",
      siteId: "",
      acres: undefined,
      rows: undefined,
      vines: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof blockFormSchema>) {
    // In a real app, this would create a new block via API
    toast({
      title: "Block created",
      description: `"${values.name}" has been added to your vineyard.`,
    });
    
    setIsDialogOpen(false);
    form.reset();
  }

  const getSiteName = (siteId: string) => {
    const site = sites.find(site => site.id === siteId);
    return site ? site.name : "Unknown Site";
  };

  return (
    <MainLayout pageTitle="Block Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Manage vineyard blocks and growing areas
        </p>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Block
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vineyard Block</DialogTitle>
              <DialogDescription>
                Enter the details of your new growing area.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Block Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Block A - Cabernet" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this growing area
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
                      <FormLabel>Site</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a site" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customerSites.map((site) => (
                            <SelectItem key={site.id} value={site.id}>
                              {site.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The vineyard site where this block is located
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="acres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Acres</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="5.2"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            value={field.value === undefined ? "" : field.value}
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
                        <FormLabel>Rows</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="52"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value === undefined ? "" : field.value}
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
                        <FormLabel>Vines</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="2080"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value === undefined ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Create Block</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customerBlocks.length > 0 ? (
          customerBlocks.map((block) => (
            <Card key={block.id}>
              <CardHeader>
                <CardTitle>{block.name}</CardTitle>
                <CardDescription>{getSiteName(block.siteId)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">
                      {block.acres ? `${block.acres} acres` : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Rows className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">
                      {block.rows ? `${block.rows} rows` : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Grape className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">
                      {block.vines ? `${block.vines} vines` : "N/A"}
                    </span>
                  </div>
                </div>
                
                {block.rows && block.vines && block.rows > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Vines per Row: </span>
                    <span>{Math.round(block.vines / block.rows)}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => navigate(`/customer/blocks/edit/${block.id}`)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/customer/blocks/${block.id}`)}>
                  View Details</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <Grape className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Blocks Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first vineyard block to define growing areas
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Block
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
