import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import SiteManagerDashboard from "./pages/SiteManagerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import SiteManagementPage from "./pages/SiteManagementPage";
import BlockManagementPage from "./pages/BlockManagementPage";
import WorkOrderManagement from "./pages/WorkOrderManagement";
import WorkOrderDetails from "./pages/WorkOrderDetails";
import AdminCustomers from "./pages/AdminCustomers";
import AdminWorkers from "./pages/AdminWorkers";
import AdminSettings from "./pages/AdminSettings";
import SiteForm from "./pages/SiteForm";
import SiteDetails from "./pages/SiteDetails";
import BlockForm from "./pages/BlockForm";
import BlockDetails from "./pages/BlockDetails";
import CustomerAccounts from "./pages/CustomerAccounts";
import CustomerSettings from "./pages/CustomerSettings";
import CreateWorkOrder from "./pages/CreateWorkOrder";
import ManagerSettings from "./pages/ManagerSettings";
import AdminCustomerView from "./pages/AdminCustomerView";
import AdminCustomerEdit from "./pages/AdminCustomerEdit";
import AdminWorkerView from "./pages/AdminWorkerView";
import AdminWorkerEdit from "./pages/AdminWorkerEdit";
import HelpPage from "./pages/HelpPage";
import CustomerManagerEdit from "./pages/CustomerManagerEdit";
import WorkerTasks from "./pages/WorkerTasks";
import WorkerTaskDetails from "./pages/WorkerTaskDetails";
import WorkerSettings from "./pages/WorkerSettings";
import WorkerHelp from "./pages/WorkerHelp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/customers" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminCustomers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/customers/:id" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminCustomerView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/customers/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminCustomerEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/workers" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminWorkers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/workers/:id" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminWorkerView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/workers/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminWorkerEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/help" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <HelpPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/sites" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <SiteManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/sites/new" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <SiteForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/sites/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <SiteForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/sites/:id" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <SiteDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/blocks" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <BlockManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/blocks/new" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <BlockForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/blocks/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <BlockForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/blocks/:id" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <BlockDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/accounts" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerAccounts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/managers/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerManagerEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/settings" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/help" 
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <HelpPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/manager" 
              element={
                <ProtectedRoute allowedRoles={["siteManager"]}>
                  <SiteManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager/orders" 
              element={
                <ProtectedRoute allowedRoles={["siteManager"]}>
                  <WorkOrderManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager/orders/new" 
              element={
                <ProtectedRoute allowedRoles={["siteManager"]}>
                  <CreateWorkOrder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager/orders/:id" 
              element={
                <ProtectedRoute allowedRoles={["siteManager"]}>
                  <WorkOrderDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager/settings" 
              element={
                <ProtectedRoute allowedRoles={["siteManager"]}>
                  <ManagerSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager/help" 
              element={
                <ProtectedRoute allowedRoles={["siteManager"]}>
                  <HelpPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/worker" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker/tasks" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerTasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker/tasks/:id" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerTaskDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker/settings" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker/help" 
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <WorkerHelp />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
