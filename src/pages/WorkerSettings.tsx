import { apiUpdateAcc } from "@/api/account";
import MainLayout from "@/components/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Bell, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";

export default function WorkerSettings() {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [profileImage, setProfileImage] = useState(
    currentUser?.profileImage || ""
  );

  // Notification settings
  const [newJobNotif, setNewJobNotif] = useState(true);
  const [applicationStatusNotif, setApplicationStatusNotif] = useState(true);
  const [paymentNotif, setPaymentNotif] = useState(true);
  const [generalNotif, setGeneralNotif] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        ...currentUser,
        name: name,
        email: email,
        phone: phone,
        profileImage: profileImage,
      };
      console.log("body :>> ", body);
      // In a real app, this would make an API call
      const res = await apiUpdateAcc(body);
      console.log("res :>> ", res);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  const changeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG, or GIF images are allowed.");
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("Image size must be less than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileImage(base64String); // cập nhật state
    };
    reader.readAsDataURL(file);
  };

  return (
    <MainLayout pageTitle="Worker Settings">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div>
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileImage} alt={name} />
                      <AvatarFallback className="text-2xl">
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-4">
                      <Label htmlFor="profile-image">Profile Image</Label>
                      <Input
                        id="profile-image"
                        type="file"
                        className="mt-1"
                        accept="image/*"
                        onChange={(e) => changeProfileImage(e)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG or GIF. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateNotifications} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-job-notif">
                        New Job Opportunities
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when new jobs are posted in your
                        area
                      </p>
                    </div>
                    <Switch
                      id="new-job-notif"
                      checked={newJobNotif}
                      onCheckedChange={setNewJobNotif}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="application-notif">
                        Application Status Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your job applications are approved or
                        rejected
                      </p>
                    </div>
                    <Switch
                      id="application-notif"
                      checked={applicationStatusNotif}
                      onCheckedChange={setApplicationStatusNotif}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-notif">
                        Payment Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when payments are processed for your
                        completed work
                      </p>
                    </div>
                    <Switch
                      id="payment-notif"
                      checked={paymentNotif}
                      onCheckedChange={setPaymentNotif}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="general-notif">General Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates about platform features and announcements
                      </p>
                    </div>
                    <Switch
                      id="general-notif"
                      checked={generalNotif}
                      onCheckedChange={setGeneralNotif}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Preferences</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="destructive" type="button">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
