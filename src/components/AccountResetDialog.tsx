import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { apiResetAcc, apiUpdateAcc } from "@/api/account";

interface AccountResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  userName: string;
  userEmail: string;
  userId: string;
}

export default function AccountResetDialog({
  open,
  onOpenChange,
  onComplete,
  userName,
  userEmail,
  userId,
}: AccountResetDialogProps) {
  const [activeTab, setActiveTab] = useState<"password" | "email">("password");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(userEmail);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password should be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, this would call an API to reset the password
      await apiResetAcc({ password: password, id: userId });

      toast({
        title: "Password reset successful",
        description: `${userName}'s password has been reset.`,
      });
      onComplete();
      setPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Failed to reset password",
        description: "An error occurred while resetting the password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, this would call an API to change the email
      apiUpdateAcc({
        email: email,
        id: userId,
        name: userName,
      });

      toast({
        title: "Email updated successfully",
        description: `${userName}'s email has been updated to ${email}.`,
      });
      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error changing email:", error);
      toast({
        title: "Failed to update email",
        description: "An error occurred while updating the email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Account for {userName}</DialogTitle>
          <DialogDescription>
            Reset password or update email address for this user.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "password" | "email")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Reset Password</TabsTrigger>
            <TabsTrigger value="email">Change Email</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="email">
            <form onSubmit={handleChangeEmail} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Current Email</Label>
                <Input
                  id="current-email"
                  value={userEmail}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email">New Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter new email address"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Email"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
