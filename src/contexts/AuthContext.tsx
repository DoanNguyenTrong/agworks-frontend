
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/data";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock local storage for persistent login
const AUTH_STORAGE_KEY = "agworks_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "customer":
        navigate("/customer/dashboard");
        break;
      case "siteManager":
        navigate("/manager/dashboard");
        break;
      case "worker":
        navigate("/worker/dashboard");
        break;
      default:
        navigate("/");
        break;
    }
  };

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user with matching email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // In a real app, we'd check password hash. For demo, just check if password is "password"
      if (!user || password !== "password") {
        throw new Error("Invalid email or password");
      }
      
      // Save user to state and localStorage
      setCurrentUser(user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect based on role
      redirectBasedOnRole(user.role);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error; // Rethrow for component handling
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user with this email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists");
      }
      
      // In a real app, we would create a new user in the database.
      // Here we just show a success message.
      
      toast({
        title: "Signup successful",
        description: "Your account has been created. You can now log in.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear user from state and localStorage
      setCurrentUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
