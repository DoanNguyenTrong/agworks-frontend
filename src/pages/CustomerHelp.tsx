import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  Search,
  HelpCircle,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiGetConfigSystem } from "@/api/configSystem";
import { get } from "lodash";

export default function CustomerHelp() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [general, setGeneral] = useState<any>({});

  const getgeneral = async () => {
    const res = await apiGetConfigSystem();
    setGeneral(get(res, "data.metaData.general", {}));
  };

  useEffect(() => {
    getgeneral();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a production app, you would send the message to your support system
      // For now, just simulate a success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });

      setMessage("");
      setSubject("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Help & Support">
      <div className="mb-8">
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help topics..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Need immediate help?
                </h3>
                <p className="text-muted-foreground mb-4 md:mb-0">
                  Our support team is available Monday-Friday, 8am-5pm PT
                </p>
              </div>
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px] mx-auto">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about managing your vineyard
                operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I add a new site manager?
                  </AccordionTrigger>
                  <AccordionContent>
                    To add a new site manager, navigate to the "Accounts" page
                    from the main menu, then click on "Add Manager" and fill in
                    the required information. The new manager will receive an
                    email invitation to join your account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How can I view work order progress?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can view the progress of all work orders from your
                    dashboard or by going to the "Sites" section and selecting a
                    specific site. Each work order will display its current
                    status, assigned workers, and completion percentage.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How do I approve worker payments?
                  </AccordionTrigger>
                  <AccordionContent>
                    Worker payments can be approved from the "Payments" section.
                    Select the relevant work order, review the completed tasks
                    and hours, then click "Approve Payments" to authorize the
                    transaction.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can I edit a site after it's been created?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can edit any site details by going to the "Sites"
                    section, selecting the site you want to modify, and clicking
                    on the "Edit" button. You can update the site name, address,
                    size, and other details.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    How do I reset a site manager's password?
                  </AccordionTrigger>
                  <AccordionContent>
                    To reset a site manager's password, go to the "Accounts"
                    page, find the manager in the list, click "Edit," and use
                    the "Reset Password" option. The manager will receive an
                    email with instructions to set a new password.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to
                you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Briefly describe your issue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please provide as much detail as possible"
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p className="text-sm text-muted-foreground">
                            {general.supportEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Response within 24 hours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Phone Support</p>
                          <p className="text-sm text-muted-foreground">
                            1-800-555-FARM
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mon-Fri, 8am-5pm PT
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Live Chat</p>
                          <p className="text-sm text-muted-foreground">
                            Available during business hours
                          </p>
                          <Button size="sm" variant="link" className="px-0">
                            Start Chat <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resources & Guides</CardTitle>
              <CardDescription>
                Helpful materials to get the most out of your AgWorks platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Getting Started Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Learn the basics of setting up your account, adding sites,
                      and managing workers.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Video Tutorials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Watch step-by-step video tutorials on how to use all
                      platform features.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Watch Videos
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Tips and tricks for optimizing your vineyard management
                      workflow.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Technical information for developers integrating with our
                      platform.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Docs
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Help</CardTitle>
              <CardDescription>
                Managing your customer account and profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Update personal information</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Change profile photo</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Manage contact details</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Email preferences</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>SMS/text alerts</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>In-app notifications</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Change password</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Enable two-factor auth</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>Manage login sessions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <div className="flex items-start">
                  <HelpCircle className="h-6 w-6 mr-3 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">
                      Need to Delete Your Account?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you need to close your account, please contact our
                      support team. We may need to ensure all outstanding work
                      orders are completed first.
                    </p>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
