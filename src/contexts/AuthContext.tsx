
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

// Sample user data
const sampleUsers = [
  {
    id: "admin-id",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    password: "admin123",
    createdAt: new Date().toISOString(),
    companyName: "AgWorks Admin",
  },
  {
    id: "customer-id",
    email: "customer@example.com",
    name: "Vineyard Owner",
    role: "customer",
    password: "customer123",
    createdAt: new Date().toISOString(),
    companyName: "Napa Valley Vineyards",
  },
  {
    id: "manager-id",
    email: "manager@example.com",
    name: "Site Manager",
    role: "siteManager",
    password: "manager123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "worker-id",
    email: "worker@example.com",
    name: "Field Worker",
    role: "worker",
    password: "worker123",
    createdAt: new Date().toISOString(),
  },
];

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if there's a stored user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedSession = localStorage.getItem("session");
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Find user with matching email and password
      const user = sampleUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid login credentials");
      }
      
      // Create a mock user and session
      const mockUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "admin" | "customer" | "siteManager" | "worker",
        createdAt: user.createdAt,
        companyName: user.companyName,
      };
      
      const mockSession = {
        access_token: "mock-token",
        refresh_token: "mock-refresh-token",
        expires_at: Date.now() + 3600000,
        user: {
          id: user.id,
          email: user.email,
        }
      };
      
      // Store in state and localStorage
      setCurrentUser(mockUser);
      setSession(mockSession as unknown as Session);
      
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      localStorage.setItem("session", JSON.stringify(mockSession));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Check if email already exists
      if (sampleUsers.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // In a real app, this would create a new user in the database
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear stored user and session
      localStorage.removeItem("currentUser");
      localStorage.removeItem("session");
      
      setCurrentUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: error.message || "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, session, isLoading, login, logout, register }}>
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
