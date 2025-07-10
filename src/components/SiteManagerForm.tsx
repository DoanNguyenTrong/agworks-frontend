import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, KeyRound } from "lucide-react";
import AccountResetDialog from "@/components/AccountResetDialog";
import { apiUpdateAcc } from "@/api/account";
import { toast } from "@/hooks/use-toast";

interface SiteManagerFormProps {
  manager: any;
  onSubmit?: (data: { name: string; email: string; phone: string }) => void;
  onCancel?: () => void;
  isView?: boolean;
  isEditing?: boolean;
  showBackButton?: boolean;
  onResetAccount?: () => void;
}

export default function SiteManagerForm({
  manager,
  onSubmit,
  onCancel,
  isView = false,
  isEditing = false,
  showBackButton = false,
  onResetAccount
}: SiteManagerFormProps) {
  const [name, setName] = useState(manager?.name || "");
  const [email, setEmail] = useState(manager?.email || "");
  const [phone, setPhone] = useState(manager?.phone || "");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    setName(manager?.name || "");
    setEmail(manager?.email || "");
    setPhone(manager?.phone || "");
  }, [manager]);

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
        title: "Employee updated",
        description: `Employee ${manager.name} information has been updated successfully.`,
      });
      if (onSubmit) {
        onSubmit({ name, email, phone });
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            {manager?.profileImage ? (
              <img
                src={manager.profileImage}
                alt={manager.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-6 h-6 text-primary" />
            )}
          </div>
          <CardTitle>{isView ? manager?.name : isEditing ? `Edit ${manager?.name}` : manager?.name}</CardTitle>
        </div>
        <CardDescription>
          {isView ? "View site manager details" : isEditing ? "Update this site manager's information" : "Site manager details"}
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
                disabled={isView && !isEditing}
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
                disabled={isView && !isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isView && !isEditing}
              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={manager?.companyName || ''}
                onChange={e => {
                  if (onSubmit && isEditing) manager.companyName = e.target.value;
                }}
                disabled={isView && !isEditing}
                readOnly={isView && !isEditing}
                className="bg-muted"
              />
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={manager?.address || ''}
                onChange={e => {
                  if (onSubmit && isEditing) manager.address = e.target.value;
                }}
                disabled={isView && !isEditing}
                readOnly={isView && !isEditing}
                className="bg-muted"
              />
            </div>
          </div>
          {!isView && (
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
          )}
          <div className="flex justify-end gap-3 mt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {isEditing && (
              <Button type="submit">Save Chafffnges</Button>
            )}
          </div>
        </form>
      </CardContent>
      <AccountResetDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        userName={manager?.name}
        userEmail={manager?.email}
        userId={manager?._id}
      />
    </Card>
  );
}
