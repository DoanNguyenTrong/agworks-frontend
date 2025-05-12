import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function WorkerHelp() {
  const [searchQuery, setSearchQuery] = useState("");

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
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px] mx-auto">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about using the worker platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I apply for a job?</AccordionTrigger>
                  <AccordionContent>
                    You can browse available jobs and apply directly from the
                    dashboard. Click on "Browse Available Jobs" to see current
                    openings in your area. Then click "Apply" on any job you're
                    interested in.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do I upload my work photos?
                  </AccordionTrigger>
                  <AccordionContent>
                    After completing work, go to the active job from your
                    dashboard or tasks page. Click "Upload Task Photo" to add
                    photos of your completed work. You can upload multiple
                    photos for each task you complete.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>When will I get paid?</AccordionTrigger>
                  <AccordionContent>
                    Payments are typically processed every Friday for all
                    approved tasks from the previous week. You'll receive
                    payment via direct deposit or your preferred payment method
                    set in your profile settings.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What if my application is rejected?
                  </AccordionTrigger>
                  <AccordionContent>
                    If your application is rejected, you may apply for other
                    available jobs. Application decisions are made by site
                    managers based on current needs and your previous work
                    history. Having a complete profile with relevant experience
                    improves your chances of acceptance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    How are earnings calculated?
                  </AccordionTrigger>
                  <AccordionContent>
                    Your earnings are calculated based on the number of task
                    photos you submit that are approved, multiplied by the pay
                    rate for the specific job. For example, if a job pays $0.75
                    per photo and you submit 10 approved photos, you'll earn
                    $7.50 for that job.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Help</CardTitle>
              <CardDescription>
                Learn how to manage your tasks and upload work evidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Uploading Task Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to properly document your work with quality
                      photos
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      View Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Understanding Task Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn about the different task statuses and what they mean
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      View Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Tracking Completed Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      How to monitor your progress and track completed tasks
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      View Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Task Photo Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Guidelines for taking clear, acceptable work photos
                    </p>
                    <Button variant="outline" className="w-full" size="sm">
                      View Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments Help</CardTitle>
              <CardDescription>
                Information about payment processing and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-1">
                  <AccordionTrigger>
                    How is my payment calculated?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Your payment is calculated based on the number of approved
                      task photos multiplied by the job's pay rate.
                    </p>
                    <p className="mb-2">
                      For example, if you submit 10 photos for a job that pays
                      $0.75 per photo:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>10 photos × $0.75 = $7.50 total earnings</li>
                    </ul>
                    <p>
                      Only photos that are approved by the site manager are
                      counted toward your payment.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-2">
                  <AccordionTrigger>
                    When are payments processed?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Payments are processed weekly, typically every Friday, for
                      all approved work from the previous week (Monday through
                      Sunday).
                    </p>
                    <p>
                      Depending on your payment method, funds may take 1-3
                      business days to appear in your account after processing.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-3">
                  <AccordionTrigger>
                    How do I change my payment method?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To change your payment method:</p>
                    <ol className="list-decimal pl-6 mb-2 space-y-1">
                      <li>Go to Settings</li>
                      <li>Select the "Payment" tab</li>
                      <li>
                        Click "Add Payment Method" or "Edit" next to your
                        existing method
                      </li>
                      <li>
                        Follow the prompts to add or update your payment
                        information
                      </li>
                    </ol>
                    <p>
                      Changes to payment methods may take 1-2 business days to
                      process and verify.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-4">
                  <AccordionTrigger>
                    Where can I view my earnings history?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      You can view your complete earnings history in the
                      "Payments" section of your account. This includes:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Weekly payment summaries</li>
                      <li>Earnings breakdowns by job</li>
                      <li>Payment statuses (processing, paid, etc.)</li>
                      <li>Downloadable payment receipts</li>
                    </ul>
                    <p>
                      You can filter your earnings by date, job type, or payment
                      status.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Help</CardTitle>
              <CardDescription>
                Managing your worker account and profile
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
                      If you need to deactivate or delete your account, please
                      contact our support team. We may need to ensure all
                      payments are finalized before processing account deletion.
                    </p>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
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
