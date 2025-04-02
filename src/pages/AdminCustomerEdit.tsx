
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import CustomerForm from "@/components/CustomerForm";
import { supabase } from "@/integrations/supabase/client";

export default function AdminCustomerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .eq('role', 'customer')
          .single();
          
        if (error) throw error;
        
        setCustomer(data);
      } catch (error: any) {
        console.error('Error fetching customer:', error);
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
  }, [id]);

  const handleComplete = () => {
    navigate(`/admin/customers/${id}`);
  };

  const handleSave = async (data: any) => {
    try {
      // Update customer in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          company_name: data.companyName,
          phone: data.phone,
          address: data.address,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Customer updated",
        description: "Customer information has been updated successfully.",
      });
      
      navigate(`/admin/customers/${id}`);
    } catch (error: any) {
      console.error('Error updating customer:', error);
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
              companyName: customer?.company_name || "",
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
