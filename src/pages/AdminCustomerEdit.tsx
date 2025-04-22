import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CustomerForm from "@/components/CustomerForm";
import { User } from "@/lib/types";
import { findUserById } from "@/lib/utils/dataManagement";
import { apiGetAccDetail, apiUpdateAcc } from "@/api/account";
import { get } from "lodash";

export default function AdminCustomerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // Find customer by ID from the local data
        const { data } = await apiGetAccDetail({ id: id });
        setCustomer(get(data, "metaData", {}));

        // if (!customer || customer.role !== "Customer") {
        //   throw new Error("Customer not found");
        // }
      } catch (error: any) {
        console.error("Error fetching customer:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load customer data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id, toast]);

  const handleComplete = () => {
    navigate(`/admin/customers/${id}`);
  };

  const handleSave = async (data: any) => {
    try {
      console.log("update data", data);
      await apiUpdateAcc({ ...data, id: id });

      toast({
        title: "Customer updated",
        description: "Customer information has been updated successfully.",
      });

      navigate(`/admin/customers/${id}`);
    } catch (error: any) {
      console.error("Error updating customer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Loading...">
        <div className="flex justify-center items-center py-12">
          <p>Loading customer information...</p>
        </div>
      </MainLayout>
    );
  }

  if (!customer && id) {
    return (
      <MainLayout pageTitle="Customer Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The customer you're looking for doesn't exist or you don't have
            permission to edit it.
          </p>
          <Button onClick={() => navigate("/admin/customers")}>
            Back to Customers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Edit Customer">
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate(`/admin/customers/${id || ""}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Customer Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm
            onComplete={handleComplete}
            onSubmit={handleSave}
            defaultValues={{
              name: customer?.name || "",
              email: customer?.email || "",
              companyName: customer?.companyName || "",
              phone: customer?.phone || "",
              address: customer?.address || "",
            }}
            isEditMode={true}
            customerId={id}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
