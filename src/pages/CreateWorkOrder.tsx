
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sites, blocks } from "@/lib/data";
import WorkOrderForm from "@/components/WorkOrderForm";
import { toast } from "@/hooks/use-toast";

export default function CreateWorkOrder() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [managedSites, setManagedSites] = useState<any[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      // Get sites managed by this manager
      const userSites = sites.filter(site => site.managerId === currentUser.id);
      setManagedSites(userSites);
    }
  }, [currentUser]);
  
  const handleWorkOrderSubmit = (data: any) => {
    console.log("Work order data:", data);
    
    // Here you would typically make an API call to save the work order
    
    toast({
      title: "Work order created",
      description: "Your work order has been created successfully.",
    });
    
    // Redirect back to work orders list
    navigate("/manager/orders");
  };

  return (
    <MainLayout pageTitle="Create Work Order">
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate("/manager/orders")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Work Orders
      </Button>
      
      <WorkOrderForm />
    </MainLayout>
  );
}
