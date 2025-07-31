import React, { useEffect, createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth, handleWebSocketUserUpdate } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PorterDashboard from './pages/PorterDashboard';
import UserDashboard from './pages/UserDashboard';
import BookDelivery from './pages/BookDelivery';
import PorterDeliveryHistory from './components/porter/PorterDeliveryHistory';
import DeliveryHistory from './pages/DeliveryHistory';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import MyTasks from './components/porter/MyTasks';
import ForgetPassword from './pages/ForgetPassword';
import AdminUsers from './pages/AdminUsers';
import AdminDeliveries from './pages/AdminDeliveries';
import ResetPassword from './pages/ResetPassword';
import OrderTracking from './pages/OrderTracking';
import { connectWebSocket, disconnectWebSocket } from './services/websocketService';
import { DeliveryEventContext } from './contexts/DeliveryEventContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    connectWebSocket(
      (deliveryData) => {
        console.log('Delivery update received:', deliveryData);
        setReloadFlag(flag => !flag);
      },
      (userData) => {
        console.log('User update received:', userData);
        if (handleWebSocketUserUpdate) handleWebSocketUserUpdate(userData);
        setReloadFlag(flag => !flag);
      },
      (porterData) => {
        console.log('Porter update received:', porterData);
        if (handleWebSocketUserUpdate) handleWebSocketUserUpdate(porterData);
        setReloadFlag(flag => !flag);
      },
      (adminData) => {
        console.log('Admin update received:', adminData);
        setReloadFlag(flag => !flag);
      }
    );
    
    return () => disconnectWebSocket();
  }, []);

  const triggerReload = () => setReloadFlag(flag => !flag);

  return (
    <DeliveryEventContext.Provider value={{ reloadFlag, triggerReload }}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/track/:deliveryId" element={<OrderTracking />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={['ADMIN']}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/porter"
                element={
                  <PrivateRoute allowedRoles={['PORTER']}>
                    <Layout>
                      <PorterDashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/porter/tasks"
                element={
                  <PrivateRoute allowedRoles={['PORTER']}>
                    <Layout>
                      <MyTasks />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/porter/history"
                element={
                  <PrivateRoute allowedRoles={['PORTER']}>
                    <Layout>
                      <PorterDeliveryHistory />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <PrivateRoute allowedRoles={['USER']}>
                    <Layout>
                      <UserDashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/BookDelivery"
                element={
                  <PrivateRoute allowedRoles={['USER']}>
                    <Layout>
                      <BookDelivery />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <Layout>
                      <DeliveryHistory />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <PrivateRoute allowedRoles={['ADMIN']}>
                    <Layout>
                      <AdminUsers />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/deliveries"
                element={
                  <PrivateRoute allowedRoles={['ADMIN']}>
                    <Layout>
                      <AdminDeliveries />
                    </Layout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </DeliveryEventContext.Provider>
  );
};

export default App; 