import MainLayout from "@/components/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { MAP_ROLE } from "@/lib/utils/role";
import {
  BookOpen,
  FileQuestion,
  HeartHandshake,
  HelpCircle,
  MessageCircle,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function HelpPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  // Role-specific help content
  const getHelpContent = () => {
    switch (currentUser?.role) {
      case MAP_ROLE.ADMIN:
        return (
          <>
            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to AgWorks Admin Help</CardTitle>
                  <CardDescription>
                    Find answers to common questions about administering the
                    AgWorks platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    As an administrator, you have full control over the AgWorks
                    platform. You can manage customers, vineyard sites, workers,
                    and system settings.
                  </p>
                  <p>
                    Use the tabs above to find specific help topics, or browse
                    through our frequently asked questions below.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Link to="/admin/help/customers" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Customer Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to add, edit, and manage customer
                            accounts.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/admin/help/workers" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Worker Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to add, edit, and manage worker accounts.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common questions about the AgWorks
                    platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I add a new customer?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the Customers page and click "Add Customer".
                      Fill out the form with the customer's information and
                      click "Create Customer".
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I edit a worker's information?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the Workers page, find the worker you want to
                      edit, and click the edit icon. Update the information as
                      needed and save your changes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Can I delete a customer account?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, you can delete a customer account by navigating to
                      the Customers page, finding the customer, and clicking the
                      delete icon. Note that this will also delete all
                      associated sites and blocks.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I reset a user's password?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the user's profile page, click "Reset
                      Password", and follow the prompts. A temporary password
                      will be generated and sent to the user's email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need more help? Reach out to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      If you can't find the answers you need in our help
                      documentation, our support team is available to assist
                      you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                            Email Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Send us an email and we'll respond within 24 hours.
                          </p>
                          <a
                            href="mailto:support@agworks.com"
                            className="text-primary hover:underline"
                          >
                            support@agworks.com
                          </a>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <HeartHandshake className="h-5 w-5 mr-2 text-primary" />
                            Phone Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Call us directly for immediate assistance.
                          </p>
                          <a
                            href="tel:+18005551234"
                            className="text-primary hover:underline"
                          >
                            +1 (800) 555-1234
                          </a>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        );

      case MAP_ROLE.CUSTOIMER:
        return (
          <>
            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to AgWorks Customer Help</CardTitle>
                  <CardDescription>
                    Find answers to common questions about managing your
                    vineyard sites.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    As a vineyard owner, you can manage your sites, blocks, and
                    site managers through the AgWorks platform. Use this help
                    center to learn more about how to use the platform
                    effectively.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Link to="/customer/help/sites" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Site Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to add, edit, and manage your vineyard
                            sites.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/customer/help/blocks" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Block Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to add, edit, and manage vineyard blocks.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common customer questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I add a new vineyard site?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the Sites page and click "Add Site". Fill out
                      the form with the site's information and click "Create
                      Site".
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I add blocks to my vineyard?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the Blocks page and click "Add Block". Select
                      the site, fill out the block details, and click "Create
                      Block".
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I add a site manager?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the Site Managers page and click "Add Site
                      Manager". Fill out the form with the manager's
                      information, select a site to assign them to, and click
                      "Create Site Manager".
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I view work orders for my sites?
                    </h3>
                    <p className="text-muted-foreground">
                      Work orders are managed by your site managers. You can see
                      a summary of all work orders on your dashboard, or
                      navigate to a specific site to see work orders for that
                      site.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need more help? Reach out to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      If you can't find the answers you need in our help
                      documentation, our support team is available to assist
                      you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                            Email Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Send us an email and we'll respond within 24 hours.
                          </p>
                          <a
                            href="mailto:support@agworks.com"
                            className="text-primary hover:underline"
                          >
                            support@agworks.com
                          </a>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <HeartHandshake className="h-5 w-5 mr-2 text-primary" />
                            Phone Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Call us directly for immediate assistance.
                          </p>
                          <a
                            href="tel:+18005551234"
                            className="text-primary hover:underline"
                          >
                            +1 (800) 555-1234
                          </a>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        );

      case MAP_ROLE.SITE_MANAGER:
        return (
          <>
            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to AgWorks Site Manager Help</CardTitle>
                  <CardDescription>
                    Find answers to common questions about managing work orders.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    As a site manager, you can create and manage work orders for
                    your assigned vineyard sites. Use this help center to learn
                    more about how to use the platform effectively.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Link to="/manager/help/orders" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Work Order Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to create, edit, and manage work orders.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/manager/help/workers" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Worker Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to manage workers assigned to your work
                            orders.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common site manager questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I create a new work order?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the Work Orders page and click "Create Work
                      Order". Fill out the form with the work order details,
                      select the site and block, and click "Create Work Order".
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I approve worker tasks?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the work order details page, go to the Tasks
                      tab, and review worker-submitted tasks. Click "Approve" or
                      "Reject" for each task.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I mark a work order as complete?
                    </h3>
                    <p className="text-muted-foreground">
                      Navigate to the work order details page and click the
                      "Complete Work Order" button. Review the summary and
                      confirm completion.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do workers get assigned to my work orders?
                    </h3>
                    <p className="text-muted-foreground">
                      Workers can apply to your work orders through the mobile
                      app. You can review and approve worker applications on the
                      work order details page.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need more help? Reach out to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      If you can't find the answers you need in our help
                      documentation, our support team is available to assist
                      you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                            Email Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Send us an email and we'll respond within 24 hours.
                          </p>
                          <a
                            href="mailto:support@agworks.com"
                            className="text-primary hover:underline"
                          >
                            support@agworks.com
                          </a>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <HeartHandshake className="h-5 w-5 mr-2 text-primary" />
                            Phone Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Call us directly for immediate assistance.
                          </p>
                          <a
                            href="tel:+18005551234"
                            className="text-primary hover:underline"
                          >
                            +1 (800) 555-1234
                          </a>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        );

      case MAP_ROLE.WORKER:
        return (
          <>
            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to AgWorks Worker Help</CardTitle>
                  <CardDescription>
                    Find answers to common questions about using the worker app.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    As a worker, you can apply for work orders, track your
                    tasks, and get paid through the AgWorks platform. Use this
                    help center to learn more about how to use the platform
                    effectively.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <Link to="/worker/help/tasks" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Task Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to submit and track your tasks.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/worker/help/payments" className="group">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Payment Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Learn how to track your earnings and get paid.
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common worker questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I apply for work orders?
                    </h3>
                    <p className="text-muted-foreground">
                      From your dashboard, browse available work orders and
                      click "Apply" on any order you're interested in. The site
                      manager will review your application and notify you if
                      you're accepted.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I submit a completed task?
                    </h3>
                    <p className="text-muted-foreground">
                      When you complete a task, take a photo of your work and
                      submit it through the app. The site manager will review
                      and approve it if it meets the requirements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      How do I track my earnings?
                    </h3>
                    <p className="text-muted-foreground">
                      You can view your earnings on the dashboard or in the
                      payments section. Your earnings are based on the number of
                      approved tasks and the pay rate for each work order.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">When do I get paid?</h3>
                    <p className="text-muted-foreground">
                      Payments are processed after a work order is completed and
                      all tasks are reviewed. Funds are typically deposited into
                      your account within 3-5 business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need more help? Reach out to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      If you can't find the answers you need in our help
                      documentation, our support team is available to assist
                      you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                            Email Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Send us an email and we'll respond within 24 hours.
                          </p>
                          <a
                            href="mailto:support@agworks.com"
                            className="text-primary hover:underline"
                          >
                            support@agworks.com
                          </a>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <HeartHandshake className="h-5 w-5 mr-2 text-primary" />
                            Phone Support
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            Call us directly for immediate assistance.
                          </p>
                          <a
                            href="tel:+18005551234"
                            className="text-primary hover:underline"
                          >
                            +1 (800) 555-1234
                          </a>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        );

      default:
        return (
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to AgWorks Help</CardTitle>
                <CardDescription>
                  Find answers to common questions about using the AgWorks
                  platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Please log in to access role-specific help content.</p>
              </CardContent>
            </Card>
          </TabsContent>
        );
    }
  };

  return (
    <MainLayout pageTitle="Help & Support">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <HelpCircle className="h-6 w-6 mr-2 text-primary" />
                Help & Support
              </CardTitle>
              <CardDescription>
                Find answers to your questions about using AgWorks.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general" className="flex items-center">
              <FileQuestion className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">General Help</span>
              <span className="sm:hidden">General</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Contact Support</span>
              <span className="sm:hidden">Contact</span>
            </TabsTrigger>
          </TabsList>

          {getHelpContent()}
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Learn how to use AgWorks with our video tutorials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <HelpCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm mt-2">
                      A quick introduction to the AgWorks platform.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Advanced Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <HelpCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm mt-2">
                      Learn about the advanced features of AgWorks.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
