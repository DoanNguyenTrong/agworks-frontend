
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileQuestion, HeartHandshake, HelpCircle, MessageCircle, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { adminSettings } from "@/lib/data";
import { Link } from "react-router-dom";

export default function SiteManagerHelp() {
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  
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
      question: "How do I create a new work order?",
      answer: "Navigate to the Work Orders page and click 'Create Work Order'. Fill out the form with the work order details, select the site and block, and click 'Create Work Order'."
    },
    {
      question: "How do I approve worker tasks?",
      answer: "Navigate to the work order details page, go to the Tasks tab, and review worker-submitted tasks. Click 'Approve' or 'Reject' for each task."
    },
    {
      question: "How do I mark a work order as complete?",
      answer: "Navigate to the work order details page and click the 'Complete Work Order' button. Review the summary and confirm completion."
    },
    {
      question: "How do workers get assigned to my work orders?",
      answer: "Workers can apply to your work orders through the mobile app. You can review and approve worker applications on the work order details page."
    },
    {
      question: "How do I view worker performance?",
      answer: "Go to the Workers section and select a worker to view their performance metrics, including completed tasks, efficiency, and quality ratings."
    },
    {
      question: "Can I edit a published work order?",
      answer: "Yes, you can edit a published work order as long as it hasn't been started yet. Once work has begun, only certain fields can be modified."
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
          <TabsTrigger value="general" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center">
            <FileQuestion className="mr-2 h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>
        
        {/* General Help Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to AgWorks Site Manager Help</CardTitle>
              <CardDescription>
                Find answers to common questions about managing work orders and vineyard operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                As a site manager, you can create and manage work orders for your assigned vineyard sites.
                Use this help center to learn more about how to use the platform effectively.
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
                        Learn how to manage workers assigned to your work orders.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Quick Start Guide</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">1. Creating a Work Order</h4>
                    <p className="text-sm text-muted-foreground">
                      Start by creating a work order for a specific block in your vineyard. 
                      Specify the type of work needed, the expected duration, and how many workers you'll need.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">2. Managing Worker Applications</h4>
                    <p className="text-sm text-muted-foreground">
                      Once your work order is published, workers can apply to work on it. 
                      Review applications and approve the workers you want to assign to the job.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">3. Monitoring Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      Track the progress of your work orders through the dashboard. 
                      You can see which tasks have been completed and by whom.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">4. Reviewing and Approving Tasks</h4>
                    <p className="text-sm text-muted-foreground">
                      Workers will submit evidence of completed tasks. 
                      Review these submissions and approve or reject them based on quality.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
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
