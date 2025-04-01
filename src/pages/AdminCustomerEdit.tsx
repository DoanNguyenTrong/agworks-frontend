
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import CustomerForm from "@/components/CustomerForm";

export default function AdminCustomerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundCustomer = users.find(user => user.id === id && user.role === "customer");
      if (foundCustomer) {
        setCustomer(foundCustomer);
      }
    }
  }, [id]);

  const handleComplete = () => {
    navigate(`/admin/customers/${id}`);
  };

  const handleSave = (data: any) => {
    console.log("Updated customer data:", data);
    
    toast({
      title: "Customer updated",
      description: "Customer information has been updated successfully.",
    });
    
    navigate(`/admin/customers/${id}`);
  };

  if (!customer && id) {
    return (
      <MainLayout pageTitle="Customer Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The customer you're looking for doesn't exist or you don't have permission to edit it.
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
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate(`/admin/customers/${id || ""}`)}>
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
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
