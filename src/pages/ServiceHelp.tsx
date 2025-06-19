
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  BookOpen, 
  Users, 
  ClipboardList,
  Search,
  ChevronRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ServiceHelp() {
  const handleContactSubmit = () => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to our support team. We'll get back to you soon!",
    });
  };

  const faqItems = [
    {
      question: "How do I assign workers to work orders?",
      answer: "Navigate to the Work Orders page, find the order you want to assign workers to, and click 'Assign Workers'. Select from your available workers and confirm the assignment."
    },
    {
      question: "How do I add new workers to my company?",
      answer: "Contact the system administrator to add new workers to your company. They will be able to create worker accounts and assign them to your service company."
    },
    {
      question: "How are payments calculated for completed work?",
      answer: "Payments are calculated based on the hourly rate specified in each work order multiplied by the actual hours worked by your workers."
    },
    {
      question: "Can I view worker performance metrics?",
      answer: "Yes, you can view basic performance metrics for your workers including completed tasks and ratings on the Workers page."
    },
    {
      question: "How do I update my company information?",
      answer: "Go to Settings > Company Information to update your business details, contact information, and notification preferences."
    }
  ];

  const quickActions = [
    {
      title: "Manage Workers",
      description: "View and manage your company workers",
      icon: Users,
      path: "/service/workers"
    },
    {
      title: "View Work Orders",
      description: "See available and assigned work orders",
      icon: ClipboardList,
      path: "/service/orders"
    },
    {
      title: "Company Settings",
      description: "Update your company preferences",
      icon: HelpCircle,
      path: "/service/settings"
    }
  ];

  return (
    <MainLayout pageTitle="Help & Support">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get help with managing your service company operations, workers, and work orders.
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and features for service company management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="bg-primary/10 p-2 rounded">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-sm">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                  {index < faqItems.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Need help? Send us a message and we'll get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="How can we help you?" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Describe your issue or question..."
                  rows={4}
                />
              </div>
              
              <Button onClick={handleContactSubmit} className="w-full">
                Send Message
              </Button>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Other ways to reach us:</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>1-800-AGWORKS (1-800-249-6757)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@agworks.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current status of AgWorks services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Work Order Management</span>
                <Badge className="bg-green-100 text-green-700">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Worker Management</span>
                <Badge className="bg-green-100 text-green-700">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <Badge className="bg-green-100 text-green-700">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile App</span>
                <Badge className="bg-green-100 text-green-700">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
