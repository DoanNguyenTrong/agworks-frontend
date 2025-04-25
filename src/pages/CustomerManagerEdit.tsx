import { apiGetAccDetail, apiUpdateAcc } from "@/api/account";
import AccountResetDialog from "@/components/AccountResetDialog";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { get } from "lodash";
import { ArrowLeft, KeyRound, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CustomerManagerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [manager, setManager] = useState<User | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getDetailUser = async (id: string) => {
    try {
      const { data } = await apiGetAccDetail({ id });
      // console.log("data :>> ", data);
      setManager(get(data, "metaData"));
      setName(get(data, "metaData.name", ""));
      setEmail(get(data, "metaData.email", ""));
      setPhone(get(data, "metaData.phone", ""));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(false);
      getDetailUser(id);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    try {
      const newAcc = {
        ...manager,
        name,
        email,
        phone,
      };
      await apiUpdateAcc(newAcc);
      toast({
        title: "Manager updated",
        description: "Site manager information has been updated successfully.",
      });
      navigate("/customer/accounts");
    } catch (error) {
      console.log("error :>> ", error);
    }
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
      <Button
        variant="ghost"
        className="p-0 mb-6"
        onClick={() => navigate("/customer/accounts")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Site Managers
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              {manager.profileImage ? (
                <img
                  src={manager.profileImage}
                  alt={manager.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-primary" />
              )}
            </div>
            <CardTitle>Edit {manager.name}</CardTitle>
          </div>
          <CardDescription>
            Update this site manager's information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetDialogOpen(true)}
                className="flex items-center justify-center"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Account
              </Button>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/customer/accounts")}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AccountResetDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        userName={manager.name}
        userEmail={manager.email}
        userId={manager._id}
        onComplete={() => getDetailUser(id)}
      />
    </MainLayout>
  );
}
