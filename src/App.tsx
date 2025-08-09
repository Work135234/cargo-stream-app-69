// // import React from 'react';
// // import { AuthProvider, useAuth } from './contexts/AuthContext';
// // import { NotificationProvider } from './contexts/NotificationContext';
// // import AuthContainer from './components/auth/AuthContainer';
// // import Dashboard from './components/Dashboard';
// // import ErrorBoundary from './components/ErrorBoundary';
// // import { Layout } from './components/Layout';

// // const AppContent: React.FC = () => {
// //   const { isAuthenticated, loading } = useAuth();

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   return isAuthenticated ? <Layout> <Dashboard /></Layout> : <AuthContainer />;
// // };

// // const App: React.FC = () => {
// //   return (
// //     <ErrorBoundary>
// //       <AuthProvider>
// //         <NotificationProvider>
// //           <AppContent />
// //         </NotificationProvider>
// //       </AuthProvider>
// //     </ErrorBoundary>
// //   );
// // };

// // export default App;




// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { NotificationProvider } from './contexts/NotificationContext';
// import AuthContainer from './components/auth/AuthContainer';
// import Dashboard from './components/Dashboard';
// import ErrorBoundary from './components/ErrorBoundary';
// import { Layout } from './components/Layout';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
// };

// const AppContent: React.FC = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (

//     <Routes>
//       <Route path="/login" element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" replace />} />
//       <Route path="/register" element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" replace />} />
//       <Route path="/" element={<Navigate to="/dashboard" replace />} />
//       <Route
//         path="/dashboard/*"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Dashboard />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>

//   );
// };

// const App: React.FC = () => {
//   return (
//     <ErrorBoundary>
//       <AuthProvider>
//         <NotificationProvider>
//           <AppContent />
//         </NotificationProvider>
//       </AuthProvider>
//     </ErrorBoundary>
//   );
// };

// export default App;












import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AuthContainer from './components/auth/AuthContainer';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import Tracking from './pages/customer/Tracking';
import Index from './pages/Index';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <AuthContainer /> : <Navigate to="/dashboard" replace />} />
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tracking"
        element={
          <ProtectedRoute>
            <Layout>
              <Tracking />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <Layout>
              <ManageBookings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Layout>
              <ManageUsers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;