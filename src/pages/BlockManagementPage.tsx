import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, Grape, Edit, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sites, blocks as allBlocks } from "@/lib/data";
import { Block } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { addBlock } from "@/lib/utils/dataManagement";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const blockFormSchema = z.object({
  name: z.string().min(2, {
    message: "Block name must be at least 2 characters.",
  }),
  siteId: z.string().min(1, {
    message: "Please select a site.",
  }),
  acres: z.coerce.number().optional(),
  rows: z.coerce.number().int().optional(),
  vines: z.coerce.number().int().optional(),
});

export default function BlockManagementPage() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [blocks, setBlocks] = useState(allBlocks);
  
  // Get customer sites and blocks
  const customerSites = sites.filter(site => site.customerId === currentUser?.id);
  const siteIds = customerSites.map(site => site.id);
  
  // Filter blocks
  let filteredBlocks = blocks.filter(block => siteIds.includes(block.siteId));
  
  // Apply site filter
  if (siteFilter !== "all") {
    filteredBlocks = filteredBlocks.filter(block => block.siteId === siteFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filteredBlocks = filteredBlocks.filter(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
    // Create new block
    const newBlock = addBlock({
      name: values.name,
      siteId: values.siteId,
      acres: values.acres,
      rows: values.rows,
      vines: values.vines
    });
    
    // Update local state
    setBlocks(prev => [...prev, newBlock]);
    
    toast({
      title: "Block created",
      description: `"${values.name}" has been added successfully.`,
    });
    
    setIsDialogOpen(false);
    form.reset();
  }

  const handleDeleteBlock = (blockToDelete: Block) => {
    // Update local state by removing the block
    setBlocks(prev => prev.filter(block => block.id !== blockToDelete.id));
    
    toast({
      title: "Block deleted",
      description: `${blockToDelete.name} has been deleted.`,
    });
  };

  return (
    <MainLayout pageTitle="Block Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {customerSites.map(site => (
                <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Block
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vineyard Block</DialogTitle>
              <DialogDescription>
                Enter the details of your new vineyard block.
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
                        A descriptive name for this vineyard block
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
                          {customerSites.map(site => (
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
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="acres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Acres</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="5.2" {...field} />
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
                          <Input type="number" placeholder="120" {...field} />
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
                          <Input type="number" placeholder="3600" {...field} />
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
      
      {filteredBlocks.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Grape className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm || siteFilter !== "all" ? "No blocks found" : "No Blocks Added Yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || siteFilter !== "all" ? 
              "Try adjusting your search or filter." : 
              "Add your first vineyard block to get started."}
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block Name</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Acres</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Vines</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlocks.map((block) => {
                const site = customerSites.find(s => s.id === block.siteId);
                return (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.name}</TableCell>
                    <TableCell>{site?.name || "Unknown Site"}</TableCell>
                    <TableCell>{block.acres || "—"}</TableCell>
                    <TableCell>{block.rows || "—"}</TableCell>
                    <TableCell>{block.vines || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/customer/blocks/${block.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/customer/blocks/edit/${block.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {block.name}.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteBlock(block)} 
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </MainLayout>
  );
}
