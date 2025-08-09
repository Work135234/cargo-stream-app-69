// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { LogOut, User, Calculator, Package, MapPin, Users, Settings, BarChart3, Eye } from 'lucide-react';
// import FareCalculator from './booking/FareCalculator';
// import BookingForm from './booking/BookingForm';
// import UserManagement from './admin/UserManagement';
// import PricingRules from './admin/PricingRules';
// import BookingManagement from './admin/BookingManagement';
// import Reports from './admin/Reports';
// import DispatcherDashboard from './dispatcher/DispatcherDashboard';

// const Dashboard: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');

//   const handleLogout = () => {
//     logout();
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'fare-calculator':
//         return <FareCalculator />;
//       case 'create-booking':
//         return <BookingForm />;
//       case 'user-management':
//         return <UserManagement />;
//       case 'pricing-rules':
//         return <PricingRules />;
//       case 'booking-management':
//         return <BookingManagement />;
//       case 'reports':
//         return <Reports />;
//       case 'dispatcher-dashboard':
//         return <DispatcherDashboard />;
//       default:
//         return (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <User className="mr-2 h-5 w-5" />
//                   Welcome, {user?.name}!
//                 </CardTitle>
//                 <CardDescription>
//                   Role: {user?.role}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600">
//                   Email: {user?.email}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Customer Features */}
//             {user?.role === 'Customer' && (
//               <>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Calculator className="mr-2 h-5 w-5" />
//                       Fare Calculator
//                     </CardTitle>
//                     <CardDescription>
//                       Calculate delivery fare before booking
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('fare-calculator')}
//                     >
//                       Calculate Fare
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Package className="mr-2 h-5 w-5" />
//                       Create Booking
//                     </CardTitle>
//                     <CardDescription>
//                       Create a new delivery booking
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('create-booking')}
//                     >
//                       New Booking
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </>
//             )}

//             {/* Admin Features */}
//             {user?.role === 'Admin' && (
//               <>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Users className="mr-2 h-5 w-5" />
//                       User Management
//                     </CardTitle>
//                     <CardDescription>
//                       Manage users and their roles
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('user-management')}
//                     >
//                       Manage Users
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Settings className="mr-2 h-5 w-5" />
//                       Pricing Rules
//                     </CardTitle>
//                     <CardDescription>
//                       Manage fare calculation rules
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('pricing-rules')}
//                     >
//                       Manage Pricing
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <Eye className="mr-2 h-5 w-5" />
//                       Booking Management
//                     </CardTitle>
//                     <CardDescription>
//                       View and manage all bookings
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('booking-management')}
//                     >
//                       Manage Bookings
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <BarChart3 className="mr-2 h-5 w-5" />
//                       Reports & Analytics
//                     </CardTitle>
//                     <CardDescription>
//                       Generate reports and view analytics
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('reports')}
//                     >
//                       View Reports
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </>
//             )}

//             {/* Dispatcher Features */}
//             {user?.role === 'Dispatcher' && (
//               <>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <MapPin className="mr-2 h-5 w-5" />
//                       Active Deliveries
//                     </CardTitle>
//                     <CardDescription>
//                       Manage deliveries and update status
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button
//                       className="w-full"
//                       onClick={() => setActiveTab('dispatcher-dashboard')}
//                     >
//                       View Deliveries
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </>
//             )}
//           </div>
//         );
//     }
//   };

//   const getTabTitle = () => {
//     switch (activeTab) {
//       case 'fare-calculator':
//         return 'Fare Calculator';
//       case 'create-booking':
//         return 'Create Booking';
//       case 'user-management':
//         return 'User Management';
//       case 'pricing-rules':
//         return 'Pricing Rules';
//       case 'booking-management':
//         return 'Booking Management';
//       case 'reports':
//         return 'Reports & Analytics';
//       case 'dispatcher-dashboard':
//         return 'Dispatcher Dashboard';
//       default:
//         return 'Dashboard';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-3xl font-bold text-gray-900">{getTabTitle()}</h1>
//             {activeTab !== 'overview' && (
//               <Button
//                 variant="outline"
//                 onClick={() => setActiveTab('overview')}
//               >
//                 Back to Dashboard
//               </Button>
//             )}
//           </div>
//           <Button onClick={handleLogout} variant="outline">
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </Button>
//         </div>

//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;














import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Calculator, Package, MapPin, Users, Settings, BarChart3, Eye, Bell } from 'lucide-react';
import FareCalculator from './booking/FareCalculator';
import BookingForm from './booking/BookingForm';
import UserManagement from './admin/UserManagement';
import PricingRules from './admin/PricingRules';
import BookingManagement from './admin/BookingManagement';
import Reports from './admin/Reports';
import DispatcherDashboard from './dispatcher/DispatcherDashboard';
import CustomerDashboard from './customer/CustomerDashboard';
import NotificationCenter from './NotificationCenter';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract active tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/fare-calculator')) return 'fare-calculator';
    if (path.includes('/create-booking')) return 'create-booking';
    if (path.includes('/user-management')) return 'user-management';
    if (path.includes('/pricing-rules')) return 'pricing-rules';
    if (path.includes('/booking-management')) return 'booking-management';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/dispatcher-dashboard')) return 'dispatcher-dashboard';
    if (path.includes('/notifications')) return 'notifications';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update active tab when URL changes
  useEffect(() => {
    const newTab = getActiveTabFromPath();
    setActiveTab(newTab);
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };

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
      case 'notifications':
        return <NotificationCenter />;
      default:
        // Render different dashboards based on user role
        if (user?.role === 'Customer') {
          return <CustomerDashboard />;
        } else if (user?.role === 'Dispatcher') {
          return <DispatcherDashboard />;
        } else {
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
                        onClick={() => handleTabChange('user-management')}
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
                        onClick={() => handleTabChange('pricing-rules')}
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
                        onClick={() => handleTabChange('booking-management')}
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
                        onClick={() => handleTabChange('reports')}
                      >
                        View Reports
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

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
                        onClick={() => handleTabChange('fare-calculator')}
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
                        onClick={() => handleTabChange('create-booking')}
                      >
                        New Booking
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        Notifications
                      </CardTitle>
                      <CardDescription>
                        View your delivery updates and notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => handleTabChange('notifications')}
                      >
                        View Notifications
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
                        onClick={() => handleTabChange('dispatcher-dashboard')}
                      >
                        View Deliveries
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        Notifications
                      </CardTitle>
                      <CardDescription>
                        View your assignment updates and notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => handleTabChange('notifications')}
                      >
                        View Notifications
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          );
        }
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
      case 'notifications':
        return 'Notifications';
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
                onClick={() => handleTabChange('overview')}
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
