
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Grape, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      // Navigation will be handled by the auth state change listener
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  }

  // Example accounts for demo purposes
  const demoAccounts = [
    { role: "Admin", email: "admin@agworks.com", password: "password" },
    { role: "Vineyard Owner", email: "customer@vineyard.com", password: "password" },
    { role: "Site Manager", email: "manager@vineyard.com", password: "password" },
    { role: "Worker", email: "worker1@example.com", password: "password" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-agworks-lightGreen/10 to-agworks-brown/10 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary p-2 rounded-full">
              <Grape className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Welcome to AgWorks</h1>
          <p className="text-muted-foreground mt-2">
            Vineyard Labor Management Solution
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="youremail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6 mt-6">
          <h3 className="font-medium mb-3">Demo Accounts</h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{account.role}</p>
                <p className="text-muted-foreground">Email: {account.email}</p>
                <p className="text-muted-foreground">Password: {account.password}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
