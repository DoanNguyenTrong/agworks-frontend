
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sites, blocks } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
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

export default function BlockManagementPage() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [blockToDelete, setBlockToDelete] = useState<any>(null);
  const navigate = useNavigate();
  
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

  const handleDeleteBlock = () => {
    if (!blockToDelete) return;
    
    // In a real app, this would be an API call
    toast({
      title: "Block deleted",
      description: `${blockToDelete.name} has been deleted.`,
    });
    
    setBlockToDelete(null);
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
        
        <Button asChild>
          <Link to="/customer/blocks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Block
          </Link>
        </Button>
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
          <Button asChild>
            <Link to="/customer/blocks/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Block
            </Link>
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
                              onClick={() => setBlockToDelete(block)}
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
                              <AlertDialogCancel onClick={() => setBlockToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteBlock} className="bg-red-500 hover:bg-red-600">
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
