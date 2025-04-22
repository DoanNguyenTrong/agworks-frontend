
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
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  companyName: z.string().trim().min(1, "Company name is required"),
  phone: z.string().regex(/^[0-9 ()+-]*$/, "Invalid phone number").optional(),
  address: z.string().trim().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export interface CustomerFormProps {
  onComplete?: (data?: CustomerFormData) => void;
  onSubmit?: (data: CustomerFormData) => void;
  defaultValues?: CustomerFormData;
  isEditMode?: boolean;
  customerId?: string;
  allowPasswordEdit?: boolean;
}

export default function CustomerForm({ 
  onComplete, 
  onSubmit, 
  defaultValues, 
  isEditMode = false,
  customerId,
  allowPasswordEdit = false
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
      password: "",
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
        
        // Update password if provided and allowed
        if (data.password && allowPasswordEdit) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            customerId,
            { password: data.password }
          );
          
          if (passwordError) throw passwordError;
        }
        
        toast({
          title: "Customer updated",
          description: `${data.companyName} has been updated.`,
        });
      } else {
        // Create new customer in Supabase using standard auth signup
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password || '',
          options: {
            data: {
              name: data.name,
              company_name: data.companyName,
              phone: data.phone,
              address: data.address,
              role: 'customer'
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Ensure profile data is updated
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              name: data.name,
              email: data.email,
              company_name: data.companyName,
              phone: data.phone,
              address: data.address,
              role: 'customer'
            });
            
          if (profileError) throw profileError;
        }
        
        toast({
          title: "Customer created",
          description: `${data.companyName} has been added as a customer.`,
        });
      }
      
      if (onComplete) {
        onComplete(data);
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
        
        {(!isEditMode || (isEditMode && allowPasswordEdit)) && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isEditMode ? "New Password" : "Initial Password"}{!isEditMode && '*'}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  {isEditMode ? "Leave blank to keep current password" : "Must be at least 8 characters. Customer can change this after logging in."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
          <Button type="button" variant="outline" onClick={() => onComplete && onComplete()}>
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
