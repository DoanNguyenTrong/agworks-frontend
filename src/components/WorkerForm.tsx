
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { addUser } from "@/lib/utils/dataManagement";

const workerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().regex(/^[0-9 ()+-]*$/, "Invalid phone number").optional(),
  password: z.string().refine(val => val === '' || val.length >= 8,
    "Password must be at least 8 characters if provided"
  ).optional(),
  sendInvite: z.boolean().default(true),
});

export type WorkerFormData = z.infer<typeof workerSchema>;

export interface WorkerFormProps {
  onComplete?: () => void;
  onSubmit?: (data: WorkerFormData) => void;
  defaultValues?: WorkerFormData;
  isEditMode?: boolean;
  workerId?: string;
}

export default function WorkerForm({ 
  onComplete, 
  onSubmit, 
  defaultValues, 
  isEditMode = false,
  workerId
}: WorkerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      password: "",
      sendInvite: true,
    },
  });

  const handleSubmit = async (data: WorkerFormData) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(data);
        setIsSubmitting(false);
        return;
      }
      
      // Default handling if no onSubmit is provided
      // if (isEditMode && workerId) {
      //   // In a real implementation, we would update the data
      //   // For now, we'll just simulate success
      //
      //   toast({
      //     title: "Worker updated",
      //     description: `${data.name} has been updated.`,
      //   });
      // } else {
      //   // Create new worker using local data management
      //   const newWorker = addUser({
      //     email: data.email,
      //     name: data.name,
      //     role: 'worker',
      //     phone: data.phone,
      //     profileImage: '/placeholder.svg'
      //   });
      //
      //   // If sendInvite is true, we'd send an email in a real implementation
      //
      //   toast({
      //     title: "Worker created",
      //     description: `${data.name} has been added as a worker.${!data.password ? ' A password was generated.' : ''}`,
      //   });
      // }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Error handling worker:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save worker",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                <FormDescription>
                  Used for login and notifications.
                </FormDescription>
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
        
        {!isEditMode && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  If left empty, a temporary password will be generated.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {!isEditMode && (
          <FormField
            control={form.control}
            name="sendInvite"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Send invitation email</FormLabel>
                  <FormDescription>
                    Send an email with login instructions to the worker.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? (isEditMode ? "Updating..." : "Creating...")
              : (isEditMode ? "Update Worker" : "Create Worker")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
