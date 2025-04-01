
import MainLayout from "@/components/MainLayout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, FileText, Video, Lightbulb } from "lucide-react";

export default function WorkerHelp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("getting-started");

  const faqItems = [
    {
      question: "How do I sign up for available jobs?",
      answer: "You can view available jobs on your dashboard and click 'Browse Available Jobs' to see what's currently open. To apply, select a job and click 'Apply' to submit your application."
    },
    {
      question: "How do I submit task completion photos?",
      answer: "After completing a task, open the job from your active jobs list, click 'Upload Task Photo', take a clear photo of your completed work, add any notes if necessary, and submit."
    },
    {
      question: "When do I get paid for my work?",
      answer: "Payments are processed after your submitted task photos are approved by the site manager. Once approved, you'll see the payment reflected in your earnings on your dashboard and receive payment according to the schedule (typically weekly)."
    },
    {
      question: "What happens if my task photo is rejected?",
      answer: "If a task photo is rejected, you'll receive a notification with the reason. You can then take a new photo that addresses the issue and resubmit it for approval."
    },
    {
      question: "How do I track my earnings?",
      answer: "Your earnings are displayed on your dashboard. You can also view detailed payment information in the 'My Tasks' section, which shows approved tasks and their associated payments."
    },
    {
      question: "Can I work at multiple vineyards?",
      answer: "Yes, you can apply for and work at multiple vineyards. Your dashboard will show all your active jobs across different vineyards."
    }
  ];

  const filteredFaqs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout pageTitle="Help & Support">
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search help topics..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="getting-started" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="getting-started" className="flex gap-2 items-center">
              <BookOpen className="h-4 w-4" />
              <span>Getting Started</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              <span>Tasks & Photos</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex gap-2 items-center">
              <Lightbulb className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex gap-2 items-center">
              <Video className="h-4 w-4" />
              <span>Video Tutorials</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started as a Field Worker</CardTitle>
                <CardDescription>
                  Learn the basics of using the AgWorks platform as a field worker
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Your Dashboard</h3>
                    <p className="text-muted-foreground text-sm">
                      Your dashboard is your home base for viewing active jobs, completed tasks, and earnings. Here you can:
                    </p>
                    <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                      <li>See current assigned jobs</li>
                      <li>Track completed tasks</li>
                      <li>View your earnings</li>
                      <li>Browse new job opportunities</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Finding Jobs</h3>
                    <p className="text-muted-foreground text-sm">
                      To find and apply for new jobs in vineyards:
                    </p>
                    <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                      <li>Click "Browse Available Jobs" on your dashboard</li>
                      <li>Review job details including location, dates, and pay rates</li>
                      <li>Apply for jobs that match your skills and availability</li>
                      <li>Track your application status on your dashboard</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-2">Frequently Asked Questions</h3>
                  
                  {searchTerm ? (
                    <>
                      {filteredFaqs.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {filteredFaqs.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                              <AccordionTrigger>{item.question}</AccordionTrigger>
                              <AccordionContent>{item.answer}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                      )}
                    </>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.slice(0, 3).map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks & Photo Documentation</CardTitle>
                <CardDescription>
                  Learn how to complete tasks and document your work properly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Completing Tasks</h3>
                  <p className="text-muted-foreground text-sm">
                    Tasks must be properly documented to ensure payment. Follow these steps:
                  </p>
                  <ol className="text-sm space-y-2 list-decimal pl-5 text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">Complete the assigned work</span> - Follow all instructions from your site manager carefully.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Take clear photos</span> - Photos should clearly show your completed work. Ensure good lighting and that the entire work area is visible.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Submit through the app</span> - Use the "Upload Task Photo" button to submit your documentation.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Add relevant notes</span> - Include any important information about the task completion.
                    </li>
                  </ol>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Photo Requirements:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Clear, well-lit images</li>
                    <li>Show the entire work area</li>
                    <li>Include identifying vineyard markers when possible</li>
                    <li>Photos must be taken on location (GPS verified)</li>
                    <li>Submit photos on the same day as completion</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Tracking Your Tasks</h3>
                  <p className="text-muted-foreground text-sm">
                    You can track all your tasks in the "My Tasks" section, which shows:
                  </p>
                  <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                    <li>Pending tasks awaiting approval</li>
                    <li>Approved tasks and associated payments</li>
                    <li>Rejected tasks that need to be addressed</li>
                    <li>Historical record of all completed work</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Your Payments</CardTitle>
                <CardDescription>
                  Learn how payments work and how to track your earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Payment Process</h3>
                  <p className="text-muted-foreground text-sm">
                    AgWorks processes payments for completed and approved tasks on a regular schedule:
                  </p>
                  <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                    <li>Tasks must be approved by site managers before payment is processed</li>
                    <li>Payments are typically processed weekly</li>
                    <li>You'll receive notification when payments are approved</li>
                    <li>Payments are made via direct deposit to your registered bank account</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Tracking Your Earnings</h3>
                  <p className="text-muted-foreground text-sm">
                    You can monitor your earnings in several ways:
                  </p>
                  <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                    <li>Dashboard shows your total earnings to date</li>
                    <li>"My Tasks" page shows individual payments for each task</li>
                    <li>Weekly and monthly earnings reports are available in the settings area</li>
                    <li>Payment history shows all past transactions</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment FAQs:</h4>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>When will I receive my payment?</AccordionTrigger>
                      <AccordionContent>
                        Payments are typically processed weekly for all approved tasks. Once approved, payment will be issued on the next payment cycle and deposited directly to your registered bank account.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What if my task is rejected?</AccordionTrigger>
                      <AccordionContent>
                        If your task is rejected, you'll receive a notification with the reason. You can address the issue and resubmit the task for approval. Payment will be processed after the resubmission is approved.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How are pay rates determined?</AccordionTrigger>
                      <AccordionContent>
                        Pay rates are set by vineyard owners and vary based on the type of work, location, and complexity of the task. Rates are clearly shown when you apply for a job.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tutorials">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step guides for using the AgWorks platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      <Video className="h-16 w-16 text-muted-foreground opacity-50" />
                      <Button className="absolute" variant="secondary">
                        Watch Video
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Getting Started as a Field Worker</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        A complete overview of the AgWorks platform for field workers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      <Video className="h-16 w-16 text-muted-foreground opacity-50" />
                      <Button className="absolute" variant="secondary">
                        Watch Video
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">How to Submit Task Photos</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learn how to properly document and submit your completed work.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      <Video className="h-16 w-16 text-muted-foreground opacity-50" />
                      <Button className="absolute" variant="secondary">
                        Watch Video
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Understanding Your Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        A guide to tracking and understanding your earnings.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                      <Video className="h-16 w-16 text-muted-foreground opacity-50" />
                      <Button className="absolute" variant="secondary">
                        Watch Video
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Using the Mobile App in the Field</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tips for using the mobile app effectively while on location.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
