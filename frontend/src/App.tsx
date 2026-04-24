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
import Warehouses from "./pages/warehouses/index";

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
            <Route path="/purchases" element={<PagePlaceholder title="Purchases" description="Create and approve purchase orders." />} />
            <Route path="/sales" element={<PagePlaceholder title="Sales" description="Sales orders and customer transactions." />} />
            <Route path="/contacts" element={<PagePlaceholder title="Suppliers & Customers" description="Manage your supplier and customer directory." />} />
            <Route path="/audit" element={<PagePlaceholder title="Audit Logs" description="Full audit trail of every change in the workspace." />} />
            <Route path="/reports" element={<PagePlaceholder title="Reports" description="Generate and export inventory and sales reports." />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
