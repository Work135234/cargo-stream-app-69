import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Calculator, Package, MapPin, Users, Settings, BarChart3, Eye } from 'lucide-react';
import FareCalculator from './booking/FareCalculator';
import BookingForm from './booking/BookingForm';
import UserManagement from './admin/UserManagement';
import PricingRules from './admin/PricingRules';
import BookingManagement from './admin/BookingManagement';
import Reports from './admin/Reports';
import DispatcherDashboard from './dispatcher/DispatcherDashboard';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'fare-calculator':
        return <FareCalculator />;
      case 'create-booking':
        return <BookingForm />;
      case 'user-management':
        return <UserManagement />;
      case 'pricing-rules':
        return <PricingRules />;
      case 'booking-management':
        return <BookingManagement />;
      case 'reports':
        return <Reports />;
      case 'dispatcher-dashboard':
        return <DispatcherDashboard />;
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Welcome, {user?.name}!
                </CardTitle>
                <CardDescription>
                  Role: {user?.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Email: {user?.email}
                </p>
              </CardContent>
            </Card>

            {/* Customer Features */}
            {user?.role === 'Customer' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      Fare Calculator
                    </CardTitle>
                    <CardDescription>
                      Calculate delivery fare before booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('fare-calculator')}
                    >
                      Calculate Fare
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      Create Booking
                    </CardTitle>
                    <CardDescription>
                      Create a new delivery booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('create-booking')}
                    >
                      New Booking
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Admin Features */}
            {user?.role === 'Admin' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Manage users and their roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('user-management')}
                    >
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Pricing Rules
                    </CardTitle>
                    <CardDescription>
                      Manage fare calculation rules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('pricing-rules')}
                    >
                      Manage Pricing
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="mr-2 h-5 w-5" />
                      Booking Management
                    </CardTitle>
                    <CardDescription>
                      View and manage all bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('booking-management')}
                    >
                      Manage Bookings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Reports & Analytics
                    </CardTitle>
                    <CardDescription>
                      Generate reports and view analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('reports')}
                    >
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Dispatcher Features */}
            {user?.role === 'Dispatcher' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Active Deliveries
                    </CardTitle>
                    <CardDescription>
                      Manage deliveries and update status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('dispatcher-dashboard')}
                    >
                      View Deliveries
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'fare-calculator':
        return 'Fare Calculator';
      case 'create-booking':
        return 'Create Booking';
      case 'user-management':
        return 'User Management';
      case 'pricing-rules':
        return 'Pricing Rules';
      case 'booking-management':
        return 'Booking Management';
      case 'reports':
        return 'Reports & Analytics';
      case 'dispatcher-dashboard':
        return 'Dispatcher Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">{getTabTitle()}</h1>
            {activeTab !== 'overview' && (
              <Button
                variant="outline"
                onClick={() => setActiveTab('overview')}
              >
                Back to Dashboard
              </Button>
            )}
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
