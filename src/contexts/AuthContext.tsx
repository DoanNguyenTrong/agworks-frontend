
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Sample user data for demo credentials
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

// Define a type for the profile data from Supabase
type ProfileData = {
  id: string;
  name: string;
  role: string;
  email: string;
  created_at: string;
  profile_image?: string | null;
  address?: string | null;
  phone?: string | null;
  logo?: string | null;
  company_name?: string | null;
};

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for an existing session when the component mounts
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          
          if (session?.user) {
            try {
              // Fetch user profile from Supabase
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single<ProfileData>();
              
              if (error && error.code !== 'PGRST116') {
                console.error("Error fetching profile:", error);
              }
              
              if (profileData) {
                // Map Supabase profile to our User type
                const user: User = {
                  id: profileData.id,
                  email: profileData.email,
                  name: profileData.name,
                  role: profileData.role as "admin" | "customer" | "siteManager" | "worker",
                  createdAt: profileData.created_at,
                  profileImage: profileData.profile_image,
                  phone: profileData.phone,
                  address: profileData.address,
                  companyName: profileData.company_name,
                  logo: profileData.logo,
                };
                
                setCurrentUser(user);
              } else {
                setCurrentUser(null);
              }
            } catch (error) {
              console.error("Error processing auth state change:", error);
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
      );
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        try {
          // Fetch user profile from Supabase
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single<ProfileData>();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching initial profile:", error);
          }
          
          if (profileData) {
            // Map Supabase profile to our User type
            const user: User = {
              id: profileData.id,
              email: profileData.email,
              name: profileData.name,
              role: profileData.role as "admin" | "customer" | "siteManager" | "worker",
              createdAt: profileData.created_at,
              profileImage: profileData.profile_image,
              phone: profileData.phone,
              address: profileData.address,
              companyName: profileData.company_name,
              logo: profileData.logo,
            };
            
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  // Check if there's a stored user in localStorage (for demo credentials)
  useEffect(() => {
    if (!currentUser) {
      const storedUser = localStorage.getItem("currentUser");
      const storedSession = localStorage.getItem("session");
      
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      
      if (storedSession) {
        setSession(JSON.parse(storedSession));
      }
    }
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try to find a demo user with matching credentials first
      const demoUser = sampleUsers.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        // Create a mock user and session for demo login
        const mockUser: User = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role as "admin" | "customer" | "siteManager" | "worker",
          createdAt: demoUser.createdAt,
          companyName: demoUser.companyName,
        };
        
        const mockSession = {
          access_token: "mock-token",
          refresh_token: "mock-refresh-token",
          expires_at: Date.now() + 3600000,
          user: {
            id: demoUser.id,
            email: demoUser.email,
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
        return;
      }
      
      // If not a demo user, try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Supabase auth was successful
      if (data.user) {
        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single<ProfileData>();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile during login:", profileError);
        }
        
        if (profileData) {
          // Create a user object from the profile data
          const user: User = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name,
            role: profileData.role as "admin" | "customer" | "siteManager" | "worker",
            createdAt: profileData.created_at,
            profileImage: profileData.profile_image,
            phone: profileData.phone,
            address: profileData.address,
            companyName: profileData.company_name,
            logo: profileData.logo,
          };
          
          setCurrentUser(user);
          setSession(data.session);
        }
      }
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
      
      // Check if demo email already exists
      if (sampleUsers.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Try to register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "customer", // Default role
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // If registration was successful
      if (data.user) {
        // Note: The profile should be created automatically via a Supabase trigger
        // from the auth.users table to the public.profiles table
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
        });
      }
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
      setIsLoading(true);
      
      // Check if we're using a demo account (stored in localStorage)
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        // Clear stored demo user data
        localStorage.removeItem("currentUser");
        localStorage.removeItem("session");
        
        setCurrentUser(null);
        setSession(null);
      } else {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw error;
        }
        
        // Supabase will trigger onAuthStateChange which will update our state
      }
      
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
    } finally {
      setIsLoading(false);
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
