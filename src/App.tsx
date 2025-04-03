
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerView />} />
            <Route path="customers/edit/:id" element={<AdminCustomerEdit />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="workers/:id" element={<AdminWorkerView />} />
            <Route path="workers/edit/:id" element={<AdminWorkerEdit />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Customer routes */}
          <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="accounts" element={<CustomerAccounts />} />
            <Route path="managers/edit/:id" element={<CustomerManagerEdit />} />
            <Route path="settings" element={<CustomerSettings />} />
            <Route path="sites" element={<SiteManagement />} />
            <Route path="sites/manage" element={<SiteManagementPage />} />
            <Route path="sites/:id" element={<SiteDetails />} />
            <Route path="sites/new" element={<SiteForm />} />
            <Route path="sites/edit/:id" element={<SiteForm />} />
            <Route path="blocks" element={<BlockManagement />} />
            <Route path="blocks/manage" element={<BlockManagementPage />} />
            <Route path="blocks/:id" element={<BlockDetails />} />
            <Route path="blocks/new" element={<BlockForm />} />
            <Route path="blocks/edit/:id" element={<BlockForm />} />
          </Route>

          {/* Site Manager routes */}
          <Route path="/manager" element={<ProtectedRoute allowedRoles={["siteManager"]} />}>
            <Route index element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="dashboard" element={<SiteManagerDashboard />} />
            <Route path="settings" element={<ManagerSettings />} />
            <Route path="orders/new" element={<CreateWorkOrder />} />
            <Route path="orders" element={<WorkOrderManagement />} />
            <Route path="orders/:id" element={<WorkOrderDetails />} />
          </Route>

          {/* Worker routes */}
          <Route path="/worker" element={<ProtectedRoute allowedRoles={["worker"]} />}>
            <Route index element={<Navigate to="/worker/dashboard" replace />} />
            <Route path="dashboard" element={<WorkerDashboard />} />
            <Route path="tasks" element={<WorkerTasks />} />
            <Route path="tasks/:taskId" element={<WorkerTaskDetails />} />
            <Route path="settings" element={<WorkerSettings />} />
            <Route path="help" element={<WorkerHelp />} />
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
