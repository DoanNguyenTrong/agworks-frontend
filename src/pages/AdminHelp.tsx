
import React from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, FileText, MessageSquare, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { adminSettings } from "@/lib/data";

export default function AdminHelp() {
  const [activeTab, setActiveTab] = React.useState("faq");
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Your support request has been submitted. We'll get back to you shortly.",
    });
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  // FAQ Data
  const faqItems = [
    {
      question: "How do I add a new customer?",
      answer: "Navigate to the Customer Management page and click on the 'Add Customer' button. Fill out the form with the customer's information and click 'Save' to create the customer account."
    },
    {
      question: "How do I manage worker permissions?",
      answer: "Worker permissions are managed through their role assignments. To change a worker's permissions, go to the Worker Management page, find the worker, click 'Edit', and adjust their role settings."
    },
    {
      question: "How can I track work orders?",
      answer: "All work orders can be tracked through the Work Order Management page. You can filter and sort orders by status, date, and other criteria to easily monitor progress."
    },
    {
      question: "How do I generate reports?",
      answer: "Go to the Reports section in the dashboard. From there, you can select the type of report you want to generate, set parameters like date range and data points, then export the report as CSV or PDF."
    },
    {
      question: "How do I reset a user's password?",
      answer: "Navigate to the user's profile page, click on the 'Security' tab, and use the 'Reset Password' option. An email with password reset instructions will be sent to the user."
    },
    {
      question: "Can I customize email notifications?",
      answer: "Yes, go to Admin Settings > Email to customize notification templates and settings for different types of system events and alerts."
    }
  ];
  
  // Filter FAQ based on search term
  const filteredFAQ = faqItems.filter(item => 
    searchTerm === "" || 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout pageTitle="Help & Support">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto justify-start border-b pb-0">
          <TabsTrigger value="faq" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>
        
        {/* FAQ Tab */}
        <TabsContent value="faq">
          <div className="mb-6">
            <div className="relative max-w-md mx-auto md:mx-0">
              <Input
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
          </div>
          
          {filteredFAQ.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQ.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No FAQ items match your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Documentation Tab */}
        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>System Documentation</CardTitle>
              <CardDescription>
                Comprehensive guides and documentation for AgWorks administration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Admin Guide</h3>
                <p className="text-muted-foreground mb-2">Complete guide for system administrators covering all features and functions.</p>
                <Button variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Admin Guide (PDF)
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Management</h3>
                <p className="text-muted-foreground mb-2">Learn how to effectively manage customer accounts, sites, and billing.</p>
                <Button variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Customer Management Guide
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Worker Management</h3>
                <p className="text-muted-foreground mb-2">Comprehensive documentation on worker registration, scheduling, and performance tracking.</p>
                <Button variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Worker Management Guide
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Work Order System</h3>
                <p className="text-muted-foreground mb-2">In-depth guide to creating, assigning, and tracking work orders.</p>
                <Button variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Work Order Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Support Tab */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Have a question or need assistance? Reach out to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input id="email" type="email" placeholder="Your email" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input id="subject" placeholder="Support request subject" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea 
                        id="message" 
                        placeholder="Describe your issue or question in detail" 
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full md:w-auto">
                        Submit Support Request
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Support Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Email Support</h3>
                    <p className="text-sm flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {adminSettings.general.supportEmail}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Support Hours</h3>
                    <p className="text-sm text-muted-foreground">Monday - Friday</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM PST</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Response Time</h3>
                    <p className="text-sm text-muted-foreground">We aim to respond to all support requests within 24 hours during business days.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
