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
import { ArrowRight, Mail, MessageCircle, Phone, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiGetConfigSystem } from "@/api/configSystem";
import { get } from "lodash";
import { useAuth } from "@/contexts/AuthContext";

export default function SiteManagerHelp() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { configSystem } = useAuth();

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

  // FAQ Data
  const faqItems = [
    {
      question: "How do I create a new work order?",
      answer:
        "Navigate to the 'Work Orders' section from the main menu, then click on 'Create New Order'. Fill in the required details including site, tasks, and schedule, then assign workers and submit the order.",
    },
    {
      question: "How do I track worker progress?",
      answer:
        "You can track worker progress on any work order by clicking on the order in the 'Work Orders' list. The details page will show which tasks have been completed, hours logged, and current completion percentage.",
    },
    {
      question: "How do I approve time sheets?",
      answer:
        "Time sheets can be approved from the 'Time Sheets' section. Review the hours submitted by workers, make any necessary adjustments, and click 'Approve' to finalize.",
    },
    {
      question: "How do I communicate with workers?",
      answer:
        "You can message workers directly from the work order details page. Click on the 'Message' button next to a worker's name to send them specific instructions or updates.",
    },
    {
      question: "How do I generate work reports?",
      answer:
        "From the 'Reports' section, select the type of report you want to generate (daily, weekly, monthly). Choose the site, date range, and any other filters, then click 'Generate Report'.",
    },
  ];

  // Filter FAQ based on search term
  const filteredFAQ = faqItems.filter(
    (item) =>
      searchTerm === "" ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout pageTitle="Help & Support">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="faq" className="space-y-6">
          <div className="mb-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="faq">
            <div className="mb-6">
              <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {filteredFAQ.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQ.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        {item.question}
                      </CardTitle>
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
                  <p className="text-muted-foreground">
                    No FAQ items match your search.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>
                      Have a question or need assistance? Reach out to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                          {isSubmitting ? "Sending..." : "Submit Request"}
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
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">
                          {configSystem?.general?.supportEmail || ""}
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
                          Mon-Fri, 8am-6pm PT
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Manager Guides</CardTitle>
                <CardDescription>
                  Resources to help you manage your vineyard operations
                  efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Work Order Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Learn how to create, assign, and track work orders
                        effectively.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Guide
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Worker Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Best practices for managing workers, schedules, and
                        performance.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Guide
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Reporting Tutorial
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Step-by-step instructions for creating effective
                        operational reports.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Watch Video
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Mobile App Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Instructions for using the AgWorks mobile app in the
                        field.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Download PDF
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
