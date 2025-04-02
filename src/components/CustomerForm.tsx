
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export interface CustomerFormProps {
  onComplete?: () => void;
  onSubmit?: (data: CustomerFormData) => void;
  defaultValues?: CustomerFormData;
  isEditMode?: boolean;
  customerId?: string;
}

export default function CustomerForm({ 
  onComplete, 
  onSubmit, 
  defaultValues, 
  isEditMode = false,
  customerId
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      companyName: "",
      phone: "",
      address: "",
    },
  });

  const handleSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(data);
        setIsSubmitting(false);
        return;
      }
      
      // Default handling if no onSubmit provided
      if (isEditMode && customerId) {
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
          .eq('id', customerId);
        
        if (error) throw error;
        
        toast({
          title: "Customer updated",
          description: `${data.companyName} has been updated.`,
        });
      } else {
        // Create new customer in Supabase
        // For security, we'll use the admin-specific API endpoint
        // since only admins should be able to create customers
        
        const { data: newCustomer, error } = await supabase.auth.admin.createUser({
          email: data.email,
          password: Math.random().toString(36).slice(-8), // Generate random password
          email_confirm: true,
          user_metadata: {
            name: data.name,
            company_name: data.companyName,
            phone: data.phone,
            address: data.address,
            role: 'customer'
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Customer created",
          description: `${data.companyName} has been added as a customer.`,
        });
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error handling customer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save customer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={3}
                  placeholder="Street, City, State, ZIP"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (isEditMode ? "Updating..." : "Creating...") 
              : (isEditMode ? "Update Customer" : "Create Customer")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
