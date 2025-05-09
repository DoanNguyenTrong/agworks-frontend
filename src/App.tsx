import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

// Admin pages
import AdminCustomerEdit from "./pages/AdminCustomerEdit";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCustomerView from "./pages/AdminCustomerView";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHelp from "./pages/AdminHelp";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import AdminWorkerEdit from "./pages/AdminWorkerEdit";
import AdminWorkers from "./pages/AdminWorkers";
import AdminWorkerView from "./pages/AdminWorkerView";

// Customer pages
import BlockDetails from "./pages/BlockDetails";
import BlockEditPage from "./pages/BlockEditPage";
import BlockForm from "./pages/BlockForm";
import BlockManagement from "./pages/BlockManagement";
import BlockManagementPage from "./pages/BlockManagementPage";
import CustomerAccounts from "./pages/CustomerAccounts";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerHelp from "./pages/CustomerHelp";
import CustomerManagerEdit from "./pages/CustomerManagerEdit";
import CustomerSettings from "./pages/CustomerSettings";
import SiteDetails from "./pages/SiteDetails";
import SiteEditPage from "./pages/SiteEditPage";
import SiteForm from "./pages/SiteForm";
import SiteManagement from "./pages/SiteManagement";
import SiteManagementPage from "./pages/SiteManagementPage";

// Site Manager pages
import CreateWorkOrder from "./pages/CreateWorkOrder";
import ManagerSettings from "./pages/ManagerSettings";
import SiteManagerDashboard from "./pages/SiteManagerDashboard";
import WorkOrderDetails from "./pages/WorkOrderDetails";
import WorkOrderManagement from "./pages/WorkOrderManagement";

// Worker pages
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerHelp from "./pages/WorkerHelp";
import WorkerSettings from "./pages/WorkerSettings";
import WorkerTaskDetails from "./pages/WorkerTaskDetails";
import WorkerTasks from "./pages/WorkerTasks";

// Shared pages
import SiteManagerHelp from "@/pages/SiteManagerHelp";
import { MAP_ROLE } from "./lib/utils/role";
import EditWorkOrder from "./pages/EidtWorkOrder";
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
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["Admin"]} />}
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerView />} />
            <Route path="customers/edit/:id" element={<AdminCustomerEdit />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="workers/:id" element={<AdminWorkerView />} />
            <Route path="workers/edit/:id" element={<AdminWorkerEdit />} />
            <Route path="sites" element={<SiteManagement />} />
            <Route path="orders" element={<WorkOrderManagement />} />
            <Route path="sites/:id" element={<SiteDetails />} />
            <Route path="sites/new" element={<SiteForm />} />
            <Route path="sites/edit/:id" element={<SiteEditPage />} />
            <Route path="sites/new" element={<SiteForm />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="help" element={<AdminHelp />} />
          </Route>

          {/* Customer routes */}
          <Route
            path="/customer"
            element={<ProtectedRoute allowedRoles={["Customer"]} />}
          >
            <Route
              index
              element={<Navigate to="/customer/dashboard" replace />}
            />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="accounts" element={<CustomerAccounts />} />
            <Route path="managers/edit/:id" element={<CustomerManagerEdit />} />
            <Route path="settings" element={<CustomerSettings />} />
            <Route path="help" element={<CustomerHelp />} />
            <Route path="sites" element={<SiteManagement />} />
            <Route path="sites/manage" element={<SiteManagementPage />} />
            <Route path="sites/:id" element={<SiteDetails />} />
            <Route path="sites/new" element={<SiteForm />} />
            <Route path="sites/edit/:id" element={<SiteEditPage />} />
            <Route path="blocks" element={<BlockManagement />} />
            <Route path="blocks/manage" element={<BlockManagementPage />} />
            <Route path="blocks/:id" element={<BlockDetails />} />
            <Route path="blocks/new" element={<BlockForm />} />
            <Route path="blocks/edit/:id" element={<BlockEditPage />} />
            <Route
              path="work-order/detail/:id"
              element={<WorkOrderDetails />}
            />
          </Route>

          {/* Site Manager routes */}
          <Route
            path="/manager"
            element={<ProtectedRoute allowedRoles={["SiteManager"]} />}
          >
            <Route
              index
              element={<Navigate to="/manager/dashboard" replace />}
            />
            <Route path="dashboard" element={<SiteManagerDashboard />} />
            <Route path="settings" element={<ManagerSettings />} />
            <Route path="orders/new" element={<CreateWorkOrder />} />
            <Route path="orders/edit/:id" element={<EditWorkOrder />} />
            <Route path="orders" element={<WorkOrderManagement />} />
            <Route path="orders/:id" element={<WorkOrderDetails />} />
          </Route>

          {/* Worker routes */}
          <Route
            path="/worker"
            element={<ProtectedRoute allowedRoles={["Worker"]} />}
          >
            <Route
              index
              element={<Navigate to="/worker/dashboard" replace />}
            />
            <Route path="dashboard" element={<WorkerDashboard />} />
            <Route path="tasks" element={<WorkerTasks />} />
            <Route path="tasks/:taskId" element={<WorkerTaskDetails />} />
            <Route path="settings" element={<WorkerSettings />} />
            <Route path="help" element={<WorkerHelp />} />
          </Route>

          {/* Shared routes */}
          <Route path="/help" element={<HelpPage />} />

          {/* Site Manager Help route */}
          <Route
            path="/manager/help"
            element={
              <ProtectedRoute allowedRoles={[MAP_ROLE.SITE_MANAGER]}>
                <SiteManagerHelp />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
