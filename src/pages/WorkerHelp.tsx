
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function WorkerHelp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Helper function to check if content matches search
  const matchesSearch = (content: string) => {
    if (!searchTerm) return true;
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <MainLayout pageTitle="Help & Support">
      <div className="mb-6">
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help topics..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto mb-6 grid grid-cols-4 md:inline-flex">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Help</CardTitle>
                <CardDescription>
                  Frequently asked questions about using the worker portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {matchesSearch("How do I use the worker portal? What is this app for?") && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        How do I use the worker portal?
                      </AccordionTrigger>
                      <AccordionContent>
                        The worker portal allows you to view assigned tasks, report completed work, 
                        track your earnings, and manage your profile. You can find your assigned tasks 
                        on the dashboard or in the My Tasks section, and upload photos of completed work.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("How do I navigate the dashboard? What information is displayed on the dashboard?") && (
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        What information is displayed on the dashboard?
                      </AccordionTrigger>
                      <AccordionContent>
                        The dashboard shows your upcoming tasks, recent activity, 
                        earnings summary, and quick links to important features.
                        You can see your performance metrics and payment history at a glance.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("Why can't I see certain features? What are the minimum requirements?") && (
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Why can't I see certain features?
                      </AccordionTrigger>
                      <AccordionContent>
                        Some features may be restricted based on your account permissions 
                        or the tasks assigned to you. If you believe you're missing access to 
                        features you need, please contact your site manager.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Help</CardTitle>
                <CardDescription>
                  Managing your worker account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {matchesSearch("How do I change my password? Reset password? Forgot password?") && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        How do I change my password?
                      </AccordionTrigger>
                      <AccordionContent>
                        To change your password, go to Settings → Security tab, 
                        enter your current password and your new password twice to confirm.
                        If you've forgotten your password, use the "Forgot Password" link 
                        on the login page to reset it.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("How do I update my contact information? Change email? Update phone number?") && (
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        How do I update my contact information?
                      </AccordionTrigger>
                      <AccordionContent>
                        Go to Settings → Profile tab to update your name, email address, and phone number.
                        Keep your contact information up to date to ensure you receive important notifications 
                        about tasks and payments.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("What happens if I'm locked out of my account? Account locked?") && (
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        What happens if I'm locked out of my account?
                      </AccordionTrigger>
                      <AccordionContent>
                        If you're locked out of your account due to too many failed login attempts,
                        you'll need to wait 30 minutes before trying again or use the password reset option.
                        If you continue to have issues, contact your site manager for assistance.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Help</CardTitle>
                <CardDescription>
                  Finding and completing work tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {matchesSearch("How do I find available tasks? View tasks? Task list?") && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        How do I find available tasks?
                      </AccordionTrigger>
                      <AccordionContent>
                        Available tasks are shown on your dashboard and in the My Tasks section.
                        You can filter and search for specific tasks by location, date, or type.
                        Double-click on any task to view more details about it.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("How do I report completed work? Submit task completion? Upload task photos?") && (
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        How do I report completed work?
                      </AccordionTrigger>
                      <AccordionContent>
                        When you complete a task, open the task details page and use the 
                        "Upload Completion Photo" button to submit evidence of your work.
                        Take clear photos that show the completed work according to the task requirements.
                        Once approved, your payment will be processed.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("What if I can't complete a task? Task problems? Issues with tasks?") && (
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        What if I can't complete a task?
                      </AccordionTrigger>
                      <AccordionContent>
                        If you encounter issues that prevent you from completing a task,
                        notify your site manager as soon as possible. Document any obstacles 
                        with photos if applicable and explain the situation clearly.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payments Help</CardTitle>
                <CardDescription>
                  Understanding and tracking your earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {matchesSearch("How are my payments calculated? Pay rates? Earnings calculations?") && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        How are my payments calculated?
                      </AccordionTrigger>
                      <AccordionContent>
                        Payments are calculated based on the number of tasks completed and the 
                        pay rate for each task type. Different tasks have different rates, which 
                        are shown on the task details page. Your earnings summaries show a breakdown 
                        of tasks completed and amounts earned.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("When will I get paid? Payment schedule? Payment timing?") && (
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        When will I get paid?
                      </AccordionTrigger>
                      <AccordionContent>
                        Payment schedules vary by employer. Typically, payments are processed 
                        weekly or bi-weekly for approved completed tasks. Check with your site 
                        manager for the specific payment schedule and method for your work.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  {matchesSearch("How do I view my payment history? Earnings history? Past payments?") && (
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        How do I view my payment history?
                      </AccordionTrigger>
                      <AccordionContent>
                        You can view your payment history on the dashboard under the Earnings section.
                        This shows a summary of your earnings by day, week, and month. For detailed 
                        information, check the Payments tab which lists all your historical payments 
                        and the tasks they cover.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            If you couldn't find what you're looking for, contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p>Contact your site manager or reach out to support:</p>
            <p className="text-muted-foreground">Email: support@agworks.com</p>
            <p className="text-muted-foreground">Phone: (555) 123-4567</p>
            <p className="text-muted-foreground">Support hours: Monday - Friday, 8am - 5pm PT</p>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
