
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { blocks as allBlocks, sites, workOrders } from "@/lib/data";
import { Block } from "@/lib/types";
import { format } from "date-fns";
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

export default function BlockDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [block, setBlock] = useState<Block | null>(null);
  const [site, setSite] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundBlock = allBlocks.find(b => b.id === id);
      if (foundBlock) {
        setBlock(foundBlock);
        
        // Get site info
        const foundSite = sites.find(s => s.id === foundBlock.siteId);
        if (foundSite) {
          setSite(foundSite);
        }
        
        // Get active orders for this block
        const orders = workOrders.filter(
          order => order.blockId === id && 
          ["published", "inProgress"].includes(order.status)
        );
        setActiveOrders(orders);
      }
    }
  }, [id]);
  
  const handleDeleteBlock = () => {
    if (!block) return;
    
    // In a real app, this would call an API
    toast({
      title: "Block deleted",
      description: `${block.name} has been deleted.`,
    });
    
    navigate('/customer/blocks');
  };
  
  if (!block || !site) {
    return (
      <MainLayout pageTitle="Block Details">
        <div className="flex justify-center items-center h-64">
          <p>Block not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="ghost" className="p-0" onClick={() => navigate('/customer/blocks')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blocks
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">{block.name}</h1>
            <p className="text-muted-foreground">{site.name}</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => navigate(`/customer/blocks/edit/${block.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Block
            </Button>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
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
                    onClick={handleDeleteBlock} 
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{block.acres || 0} acres</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{block.rows || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{block.vines || 0}</div>
            {block.rows && block.vines ? (
              <p className="text-xs text-muted-foreground mt-1">
                ~{Math.round(block.vines / block.rows)} vines per row
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-6">Active Work Orders</h2>
      
      <div className="space-y-4">
        {activeOrders.length > 0 ? (
          activeOrders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {order.workType.charAt(0).toUpperCase() + order.workType.slice(1)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d")}
                    </p>
                  </div>
                  <Badge className="mt-2 md:mt-0 w-fit" variant={order.status === "inProgress" ? "default" : "secondary"}>
                    {order.status === "inProgress" ? "In Progress" : "Published"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Workers: </span>
                    <span className="font-medium">{order.neededWorkers}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Hours: </span>
                    <span className="font-medium">{order.expectedHours}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pay Rate: </span>
                    <span className="font-medium">${order.payRate.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">No Active Work Orders</h3>
            <p className="text-muted-foreground">
              There are no active work orders for this block.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
