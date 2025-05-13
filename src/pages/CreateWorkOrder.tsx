import { apiCreateWorkOrder } from "@/api/workOrder";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkOrderForm from "@/components/WorkOrderForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateWorkOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Creating work order:", data);
      await apiCreateWorkOrder(data);

      toast({
        title: "Work Order Created",
        description: "The work order has been created successfully.",
      });

      navigate("/manager/orders");
    } catch (error) {
      console.error("Error creating work order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Create Work Order">
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate("/manager/orders")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Work Orders
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkOrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
