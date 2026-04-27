import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import PagePlaceholder from "./components/PagePlaceholder";
import NotFound from "./pages/NotFound.tsx";

// Auth Pages
import SignIn from "./pages/auth/SignIn";
import SignOut from "./pages/auth/SignOut";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Products from "./pages/products/index";
import Inventory from "./pages/inventory/index";
import Transfers from "./pages/inventory/transfers/index";
import Warehouses from "./pages/warehouses/index";
import Purchases from "./pages/purchases/index";
import Sales from "./pages/sales/index";
import Contacts from "./pages/contacts/index";
import AuditLogs from "./pages/AuditLogs";
import AlertsOverview from "./pages/alerts/AlertsOverview";
import AlertRules from "./pages/alerts/AlertRules";
import NotificationsPage from "./pages/alerts/NotificationsPage";
import AlertSettings from "./pages/alerts/AlertSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/logout" element={<SignOut />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes enclosed in AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/transfers" element={<Transfers />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/audit" element={<AuditLogs />} />
            
            {/* Smart Alerts */}
            <Route path="/alerts" element={<AlertsOverview />} />
            <Route path="/alerts/rules" element={<AlertRules />} />
            <Route path="/alerts/notifications" element={<NotificationsPage />} />
            <Route path="/alerts/settings" element={<AlertSettings />} />

            <Route path="/reports" element={<PagePlaceholder title="Reports" description="Generate and export inventory and sales reports." />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
