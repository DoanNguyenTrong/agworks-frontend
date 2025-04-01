
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import WorkerForm from "@/components/WorkerForm";

export default function AdminWorkerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundWorker = users.find(user => user.id === id && user.role === "worker");
      if (foundWorker) {
        setWorker(foundWorker);
      }
    }
  }, [id]);

  const handleComplete = () => {
    navigate(`/admin/workers/${id}`);
  };

  const handleSave = (data: any) => {
    console.log("Updated worker data:", data);
    
    toast({
      title: "Worker updated",
      description: "Worker information has been updated successfully.",
    });
    
    navigate(`/admin/workers/${id}`);
  };

  if (!worker && id) {
    return (
      <MainLayout pageTitle="Worker Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            The worker you're looking for doesn't exist or you don't have permission to edit it.
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
      <Button variant="ghost" className="p-0 mb-6" onClick={() => navigate(`/admin/workers/${id || ""}`)}>
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
            }}
            isEditMode={true}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
