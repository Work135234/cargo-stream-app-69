import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/customer/Dashboard";
import Booking from "./pages/customer/Booking";
import Tracking from "./pages/customer/Tracking";
import Notifications from "./pages/customer/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageUsers from "./pages/admin/ManageUsers";
import PricingSettings from "./pages/admin/PricingSettings";
import Reports from "./pages/admin/Reports";
import DispatcherDashboard from "./pages/dispatcher/DispatcherDashboard";
import UpdateStatus from "./pages/dispatcher/UpdateStatus";
import Notes from "./pages/dispatcher/Notes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Customer Routes */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <AuthenticatedLayout><CustomerDashboard /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/booking" 
        element={isAuthenticated ? <AuthenticatedLayout><Booking /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/tracking" 
        element={isAuthenticated ? <AuthenticatedLayout><Tracking /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/notifications" 
        element={isAuthenticated ? <AuthenticatedLayout><Notifications /></AuthenticatedLayout> : <Login />} 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={isAuthenticated ? <AuthenticatedLayout><AdminDashboard /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/admin/bookings" 
        element={isAuthenticated ? <AuthenticatedLayout><ManageBookings /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/admin/users" 
        element={isAuthenticated ? <AuthenticatedLayout><ManageUsers /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/admin/pricing" 
        element={isAuthenticated ? <AuthenticatedLayout><PricingSettings /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/admin/reports" 
        element={isAuthenticated ? <AuthenticatedLayout><Reports /></AuthenticatedLayout> : <Login />} 
      />
      
      {/* Dispatcher Routes */}
      <Route 
        path="/dispatcher" 
        element={isAuthenticated ? <AuthenticatedLayout><DispatcherDashboard /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/dispatcher/status" 
        element={isAuthenticated ? <AuthenticatedLayout><UpdateStatus /></AuthenticatedLayout> : <Login />} 
      />
      <Route 
        path="/dispatcher/notes" 
        element={isAuthenticated ? <AuthenticatedLayout><Notes /></AuthenticatedLayout> : <Login />} 
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
