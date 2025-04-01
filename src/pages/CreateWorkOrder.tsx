
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import WorkOrderForm from "@/components/WorkOrderForm";

export default function CreateWorkOrder() {
  const navigate = useNavigate();

  // Set default start time to 6am and end time to 4pm
  const defaultStartDate = new Date();
  defaultStartDate.setHours(6, 0, 0, 0);
  
  const defaultEndDate = new Date();
  defaultEndDate.setHours(16, 0, 0, 0);

  return (
    <MainLayout pageTitle="Create Work Order">
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate("/manager/orders")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Work Orders
      </Button>
      
      <WorkOrderForm defaultStartDate={defaultStartDate} defaultEndDate={defaultEndDate} />
    </MainLayout>
  );
}
