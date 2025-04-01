
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ManagerForm from "@/components/ManagerForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { siteManagers } from "@/lib/data";

export default function CustomerManagerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [manager, setManager] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch manager data
    const foundManager = siteManagers.find(manager => manager.id === id);
    if (foundManager) {
      setManager(foundManager);
    }
    setIsLoading(false);
  }, [id]);

  const handleDelete = () => {
    // In a real application, this would be an API call
    toast({
      title: "Site manager deleted",
      description: `${manager.name} has been removed as a site manager.`,
    });
    navigate("/customer/accounts");
  };

  const handleFormSubmit = (data: any) => {
    // In a real application, this would be an API call
    toast({
      title: "Site manager updated",
      description: `${data.name} has been updated.`,
    });
    navigate("/customer/accounts");
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Edit Site Manager">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!manager) {
    return (
      <MainLayout pageTitle="Edit Site Manager">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Site manager not found</p>
          <Button onClick={() => navigate("/customer/accounts")}>
            Back to Site Managers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Edit Site Manager">
      <Card>
        <CardContent className="pt-6">
          <ManagerForm 
            onComplete={() => navigate("/customer/accounts")}
            onSubmit={handleFormSubmit}
            defaultValues={{
              name: manager.name,
              email: manager.email,
              phone: manager.phone || "",
            }}
            isEditMode={true}
          />
        </CardContent>
      </Card>

      <div className="mt-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Site Manager</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the site manager
                account and remove their access to all sites.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
