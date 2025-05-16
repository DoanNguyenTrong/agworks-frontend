import { apiGetWorkOderById, apiUpdateWorkOderById } from "@/api/workOrder";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkOrderForm from "@/components/WorkOrderForm";
import { useToast } from "@/hooks/use-toast";
import { get } from "lodash";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditWorkOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initForm, setInitForm] = useState({});

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Update work order:", data);
      await apiUpdateWorkOderById(data, id);

      toast({
        title: "Work Order Updated",
        description: "The work order has been updated successfully.",
      });

      navigate("/manager/orders");
    } catch (error) {
      console.error("Error creating work order:", error);
      toast({
        title: "Error",
        description: "Failed to update work order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async (idOrder: string) => {
      try {
        const { data } = await apiGetWorkOderById({ id: idOrder });
        // console.log("res :>> ", data);
        const convertData = {
          ...get(data, "metaData"),
        };
        setInitForm(convertData);
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <MainLayout pageTitle="Edit Work Order">
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
          <WorkOrderForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initForm={initForm}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
