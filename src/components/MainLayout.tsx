import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Home, Users, Grape, Map, ClipboardList, 
  LogOut, Settings, Menu, X, Building, UserPlus, 
  DollarSign, BarChart, FileText, Cog, HelpCircle, User
} from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function MainLayout({ children, pageTitle = "AgWorks" }: MainLayoutProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const getNavItems = () => {
    switch (currentUser.role) {
      case "admin":
        return [
          { name: "Dashboard", path: "/admin", icon: Home },
          { name: "Customers", path: "/admin/customers", icon: Building },
          { name: "Workers", path: "/admin/workers", icon: Users },
        ];
      case "customer":
        return [
          { name: "Dashboard", path: "/customer", icon: Home },
          { name: "Sites", path: "/customer/sites", icon: Map },
          { name: "Blocks", path: "/customer/blocks", icon: Grape },
          { name: "Site Managers", path: "/customer/accounts", icon: UserPlus },
        ];
      case "siteManager":
        return [
          { name: "Dashboard", path: "/manager", icon: Home },
          { name: "Work Orders", path: "/manager/orders", icon: ClipboardList },
        ];
      case "worker":
        return [
          { name: "Dashboard", path: "/worker", icon: Home },
          { name: "My Tasks", path: "/worker/tasks", icon: ClipboardList }
        ];
      default:
        return [];
    }
  };

  const getSettingsPath = () => {
    switch (currentUser.role) {
      case "admin":
        return "/admin/settings";
      case "customer":
        return "/customer/settings";
      case "siteManager":
        return "/manager/settings";
      case "worker":
        return "/worker/settings";
      default:
        return "/";
    }
  };
  
  const getHelpPath = () => {
    switch (currentUser.role) {
      case "admin":
        return "/admin/help";
      case "customer":
        return "/customer/help";
      case "siteManager":
        return "/manager/help";
      case "worker":
        return "/worker/help";
      default:
        return "/";
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="hidden md:block">
          <SidebarHeader className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">AgWorks</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="px-4 py-2">
                <div className="flex items-center gap-4 mb-6 mt-2">
                  <Avatar>
                    <AvatarImage src={currentUser.logo} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                  </div>
                </div>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        data-active={location.pathname === item.path}
                      >
                        <Link to={item.path} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="sm" className="justify-start" asChild>
                <Link to={getSettingsPath()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="justify-start" asChild>
                <Link to={getHelpPath()}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </Button>
              <Separator className="my-1" />
              <Button variant="ghost" size="sm" className="justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-4 md:hidden">
            <div className="flex items-center">
              <Button variant="ghost" className="p-0 mr-4" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
                {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
              <span className="text-xl font-bold text-primary">AgWorks</span>
            </div>
            <SidebarTrigger className="md:flex hidden" />
          </header>

          {isMobileNavOpen && (
            <div className="fixed inset-0 bg-background z-50 pt-16 md:hidden">
              <div className="p-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar>
                    <AvatarImage src={currentUser.logo} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </p>
                  </div>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileNavOpen(false);
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </nav>
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(getSettingsPath());
                      setIsMobileNavOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(getHelpPath());
                      setIsMobileNavOpen(false);
                    }}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </Button>
                  <Separator className="my-1" />
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-auto p-4 md:p-6 agworks-scrollbar">
            {pageTitle && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{pageTitle}</h1>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
