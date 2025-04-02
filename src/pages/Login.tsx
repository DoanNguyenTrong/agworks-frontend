import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sample credentials for demo purposes
      const validCredentials = [
        { email: "admin@example.com", password: "admin123" },
        { email: "customer@example.com", password: "customer123" },
        { email: "manager@example.com", password: "manager123" },
        { email: "worker@example.com", password: "worker123" }
      ];

      // Check if using one of the demo credentials
      const isDemoCredential = validCredentials.some(
        (cred) => cred.email === email && cred.password === password
      );

      // If using demo credentials, use the context login method (uses localStorage)
      if (isDemoCredential) {
        await login(email, password);
        toast({
          title: "Login successful",
          description: "Welcome to AgWorks! You're now logged in with demo credentials.",
        });
        navigate("/");
        return;
      }

      // Otherwise, try to log in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // If successful with Supabase, check for user profile
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          // We'll still let them log in even if profile fetch fails
        }

        toast({
          title: "Login successful",
          description: `Welcome back${profileData?.name ? ', ' + profileData.name : ''}!`,
        });

        // Navigate based on the user's role
        if (profileData?.role === 'admin') {
          navigate('/admin');
        } else if (profileData?.role === 'customer') {
          navigate('/customer');
        } else if (profileData?.role === 'siteManager') {
          navigate('/manager');
        } else if (profileData?.role === 'worker') {
          navigate('/worker');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.svg" alt="AgWorks Logo" className="h-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700">
              <strong>Sample Logins:</strong>
              <ul className="mt-1 space-y-1">
                <li>Admin: admin@example.com / admin123</li>
                <li>Customer: customer@example.com / customer123</li>
                <li>Manager: manager@example.com / manager123</li>
                <li>Worker: worker@example.com / worker123</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="px-0 h-auto font-normal" size="sm">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
