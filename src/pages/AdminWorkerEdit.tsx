import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkerForm from "@/components/WorkerForm";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { findUserById } from "@/lib/utils/dataManagement";
import { MAP_ROLE } from "@/lib/utils/role";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminWorkerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // Find worker by ID using the utility function
        const foundWorker = findUserById(id);

        if (!foundWorker || foundWorker.role !== MAP_ROLE.WORKER) {
          throw new Error("Worker not found");
        }

        setWorker(foundWorker);
      } catch (error: any) {
        console.error("Error fetching worker:", error);
        toast({
          title: "Error",
          description: "Failed to load worker details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorker();
  }, [id, toast]);

  const handleComplete = () => {
    navigate(`/admin/workers/${id}`);
  };

  const handleSave = async (data: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, we would update the worker in the database.
      // Here we just show a success message.

      toast({
        title: "Worker updated",
        description: "Worker information has been updated successfully.",
      });

      navigate(`/admin/workers/${id}`);
    } catch (error: any) {
      console.error("Error updating worker:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update worker",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Loading...">
        <div className="flex justify-center py-12">
          <p>Loading worker details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!worker && id) {
    return (
      <MainLayout pageTitle="Worker Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The worker you're looking for doesn't exist or you don't have
            permission to edit it.
          </p>
          <Button onClick={() => navigate("/admin/workers")}>
            Back to Workers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Edit Worker">
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate(`/admin/workers/${id || ""}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Worker Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Worker Information</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkerForm
            onComplete={handleComplete}
            onSubmit={handleSave}
            defaultValues={{
              name: worker?.name || "",
              email: worker?.email || "",
              phone: worker?.phone || "",
              sendInvite: false,
            }}
            isEditMode={true}
            workerId={id}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
