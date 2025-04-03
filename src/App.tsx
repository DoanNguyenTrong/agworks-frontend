
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCustomerView from "./pages/AdminCustomerView";
import AdminCustomerEdit from "./pages/AdminCustomerEdit";
import AdminWorkers from "./pages/AdminWorkers";
import AdminWorkerView from "./pages/AdminWorkerView";
import AdminWorkerEdit from "./pages/AdminWorkerEdit";
import AdminSettings from "./pages/AdminSettings";

// Customer pages
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerAccounts from "./pages/CustomerAccounts";
import CustomerSettings from "./pages/CustomerSettings";
import CustomerManagerEdit from "./pages/CustomerManagerEdit";
import SiteManagement from "./pages/SiteManagement";
import SiteManagementPage from "./pages/SiteManagementPage";
import SiteDetails from "./pages/SiteDetails";
import SiteForm from "./pages/SiteForm";
import BlockManagement from "./pages/BlockManagement";
import BlockManagementPage from "./pages/BlockManagementPage";
import BlockDetails from "./pages/BlockDetails";
import BlockForm from "./pages/BlockForm";

// Site Manager pages
import SiteManagerDashboard from "./pages/SiteManagerDashboard";
import ManagerSettings from "./pages/ManagerSettings";
import CreateWorkOrder from "./pages/CreateWorkOrder";
import WorkOrderManagement from "./pages/WorkOrderManagement";
import WorkOrderDetails from "./pages/WorkOrderDetails";

// Worker pages
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerTasks from "./pages/WorkerTasks";
import WorkerTaskDetails from "./pages/WorkerTaskDetails";
import WorkerSettings from "./pages/WorkerSettings";
import WorkerHelp from "./pages/WorkerHelp";

// Shared pages
import HelpPage from "./pages/HelpPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/customers/:id" element={<AdminCustomerView />} />
            <Route path="/admin/customers/edit/:id" element={<AdminCustomerEdit />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            <Route path="/admin/workers/:id" element={<AdminWorkerView />} />
            <Route path="/admin/workers/edit/:id" element={<AdminWorkerEdit />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Customer routes */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/accounts" element={<CustomerAccounts />} />
            <Route path="/customer/managers/edit/:id" element={<CustomerManagerEdit />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
            <Route path="/customer/sites" element={<SiteManagement />} />
            <Route path="/customer/sites/manage" element={<SiteManagementPage />} />
            <Route path="/customer/sites/:id" element={<SiteDetails />} />
            <Route path="/customer/sites/new" element={<SiteForm />} />
            <Route path="/customer/sites/edit/:id" element={<SiteForm />} />
            <Route path="/customer/blocks" element={<BlockManagement />} />
            <Route path="/customer/blocks/manage" element={<BlockManagementPage />} />
            <Route path="/customer/blocks/:id" element={<BlockDetails />} />
            <Route path="/customer/blocks/new" element={<BlockForm />} />
            <Route path="/customer/blocks/edit/:id" element={<BlockForm />} />
          </Route>

          {/* Site Manager routes */}
          <Route element={<ProtectedRoute allowedRoles={["siteManager"]} />}>
            <Route path="/manager/dashboard" element={<SiteManagerDashboard />} />
            <Route path="/manager/settings" element={<ManagerSettings />} />
            <Route path="/manager/orders/new" element={<CreateWorkOrder />} />
            <Route path="/manager/orders" element={<WorkOrderManagement />} />
            <Route path="/manager/orders/:id" element={<WorkOrderDetails />} />
          </Route>

          {/* Worker routes */}
          <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/tasks" element={<WorkerTasks />} />
            <Route path="/worker/tasks/:taskId" element={<WorkerTaskDetails />} />
            <Route path="/worker/settings" element={<WorkerSettings />} />
            <Route path="/worker/help" element={<WorkerHelp />} />
          </Route>

          {/* Shared routes */}
          <Route path="/help" element={<HelpPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
