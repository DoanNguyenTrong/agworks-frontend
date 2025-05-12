import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { adminSettings } from "@/lib/data";
import { updateAdminSettings } from "@/lib/utils/dataManagement";
import {
  apiGetConfigSystem,
  apiUpdateConfigSystem,
  apiCreateConfigSystem,
} from "@/api/configSystem";
import { get, set } from "lodash";

// Form schemas
const generalSettingsSchema = z.object({
  systemName: z.string().min(1, "System name is required"),
  supportEmail: z.string().email("Invalid email address"),
  logoUrl: z.string().optional(),
  allowPublicRegistration: z.boolean().default(true),
  allowWorkerSelfRegistration: z.boolean().default(true),
});

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, "SMTP server is required"),
  smtpPort: z.string().min(1, "SMTP port is required"),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  senderEmail: z.string().email("Invalid sender email"),
  senderName: z.string().min(1, "Sender name is required"),
});

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<any>({});

  const getAdminConfig = async () => {
    const res = await apiGetConfigSystem();
    // console.log("res :>> ", res);
    setSettings(get(res, "data.metaData", {}));
    generalForm.reset(settings.general);
    emailForm.reset(settings.email);
  };
  console.log("settings :>> ", settings);

  useEffect(() => {
    getAdminConfig();
  }, []);

  // General settings form
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      systemName: "",
      supportEmail: "",
      logoUrl: "",
      allowPublicRegistration: false,
      allowWorkerSelfRegistration: false,
    },
  });

  // Email settings form
  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "",
      smtpPort: "",
      smtpUsername: "",
      smtpPassword: "",
      senderEmail: "",
      senderName: "",
    },
  });

  // Update forms when settings change
  useEffect(() => {
    generalForm.reset(settings.general);
    emailForm.reset(settings.email);
  }, [settings]);

  console.log("reload");

  // Submit handlers
  const handleSubmit = async () => {
    // console.log("setting::", settings);
    const updatedSettings = {
      ...settings,
      general: generalForm.getValues(),
      email: emailForm.getValues(),
    };
    console.log("submit settings :>> ", updatedSettings);
    await apiUpdateConfigSystem(updatedSettings);

    setSettings(updatedSettings);

    toast({
      title: "Settings saved",
      description: "Your general settings have been saved successfully.",
    });
  };

  return (
    <MainLayout pageTitle="Admin Settings">
      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full md:w-auto justify-start border-b pb-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings and defaults.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  id="general-settings-form"
                  onSubmit={generalForm.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={generalForm.control}
                    name="systemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This name will appear in the application header and
                          emails.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          Users will contact this email for support.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          URL to your system logo image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="allowPublicRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Public Registration
                          </FormLabel>
                          <FormDescription>
                            Allow users to register accounts publicly.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="allowWorkerSelfRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Worker Self-Registration
                          </FormLabel>
                          <FormDescription>
                            Allow workers to register for available jobs.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="general-settings-form">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email server and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  id="email-settings-form"
                  onSubmit={emailForm.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Server</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
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
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="email-settings-form">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Require users to use two-factor authentication.
                    </p>
                  </div>
                  <Switch
                    checked={settings?.security?.requireTwoFactorAuthentication}
                    onCheckedChange={(checked) => {
                      setSettings((prev: Record<string, any>) => ({
                        ...prev,
                        security: {
                          ...(prev?.security || {}),
                          requireTwoFactorAuthentication: checked,
                        },
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Password Expiration</p>
                    <p className="text-sm text-muted-foreground">
                      Force users to change their password periodically.
                    </p>
                  </div>
                  <Switch
                    checked={settings?.security?.allowPasswordExpiration}
                    onCheckedChange={(checked) => {
                      setSettings((prev: Record<string, any>) => ({
                        ...prev,
                        security: {
                          ...(prev?.security || {}),
                          allowPasswordExpiration: checked,
                        },
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Account Lockout</p>
                    <p className="text-sm text-muted-foreground">
                      Lock accounts after multiple failed login attempts.
                    </p>
                  </div>
                  <Switch
                    checked={settings?.security?.allowAccountLockout}
                    onCheckedChange={(checked) => {
                      setSettings((prev: Record<string, any>) => ({
                        ...prev,
                        security: {
                          ...(prev?.security || {}),
                          allowAccountLockout: checked,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Configure external service integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Google Maps</p>
                    <p className="text-sm text-muted-foreground">
                      Enable Google Maps integration for location services.
                    </p>
                  </div>
                  <Switch
                    checked={settings?.integrations?.enableGoogleMaps}
                    onCheckedChange={(checked) => {
                      setSettings((prev: Record<string, any>) => ({
                        ...prev,
                        integrations: {
                          ...(prev?.integrations || {}),
                          enableGoogleMaps: checked,
                        },
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Twilio SMS</p>
                    <p className="text-sm text-muted-foreground">
                      Enable Twilio SMS for mobile notifications.
                    </p>
                  </div>
                  <Switch
                    checked={settings?.integrations?.enableTwilioSMS}
                    onCheckedChange={(checked) => {
                      setSettings((prev: Record<string, any>) => ({
                        ...prev,
                        integrations: {
                          ...(prev?.integrations || {}),
                          enableTwilioSMS: checked,
                        },
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Stripe Payments</p>
                    <p className="text-sm text-muted-foreground">
                      Enable Stripe for payment processing.
                    </p>
                  </div>
                  <Switch
                    checked={settings?.integrations?.enableStripe}
                    onCheckedChange={(checked) => {
                      setSettings((prev: Record<string, any>) => ({
                        ...prev,
                        integrations: {
                          ...(prev?.integrations || {}),
                          enableStripe: checked,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
