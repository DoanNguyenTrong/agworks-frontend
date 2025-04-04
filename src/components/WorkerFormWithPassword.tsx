
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const workerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export type WorkerFormData = z.infer<typeof workerSchema>;

export interface WorkerFormWithPasswordProps {
  onComplete?: () => void;
  onSubmit?: (data: WorkerFormData) => void;
  defaultValues?: WorkerFormData;
  isEditMode?: boolean;
  workerId?: string;
  allowPasswordEdit?: boolean;
}

export default function WorkerFormWithPassword({
  onComplete,
  onSubmit,
  defaultValues,
  isEditMode = false,
  workerId,
  allowPasswordEdit = false
}: WorkerFormWithPasswordProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      password: "",
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
      
      // Default handling if no onSubmit provided
      // In a real app, this would interact with backend APIs
      
      toast({
        title: isEditMode ? "Worker updated" : "Worker created",
        description: `${data.name} has been ${isEditMode ? "updated" : "added"} successfully.`,
      });
      
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
                  {isEditMode ? "Leave blank to keep current password" : "Must be at least 8 characters."}
                </FormDescription>
                <FormMessage />
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
