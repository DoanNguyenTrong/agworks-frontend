
import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Grape, Edit, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Block, Site } from "@/lib/types";
import { fetchBlocks, fetchSites } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function BlockManagementPage() {
  const { currentUser } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        
        // Load sites owned by the customer
        const sitesData = await fetchSites(currentUser.id);
        setSites(sitesData);
        
        if (sitesData.length > 0) {
          // Load all blocks for these sites
          const siteIds = sitesData.map(site => site.id);
          const blocksData = await Promise.all(
            siteIds.map(siteId => fetchBlocks(siteId))
          );
          
          // Flatten the array of arrays
          setBlocks(blocksData.flat());
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, toast]);
  
  if (isLoading) {
    return (
      <MainLayout pageTitle="Block Management">
        <div className="flex justify-center items-center p-8">
          <p>Loading blocks...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Block Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Vineyard Blocks</h1>
        
        <Button asChild>
          <Link to="/customer/blocks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Block
          </Link>
        </Button>
      </div>
      
      {blocks.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Grape className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Blocks Added Yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first vineyard block to get started.
          </p>
          <Button asChild>
            <Link to="/customer/blocks/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Block
            </Link>
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
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
                {blocks.map((block) => {
                  const site = sites.find(s => s.id === block.siteId);
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
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
}
