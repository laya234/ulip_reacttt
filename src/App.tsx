import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Suspense, lazy } from 'react';
import './App.css';

import { store } from './store';
import { theme } from './theme';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Layout from './components/Layout';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const AgentDashboard = lazy(() => import('./pages/agent/Dashboard'));
const Pipeline = lazy(() => import('./pages/agent/Pipeline'));
const DocumentVerification = lazy(() => import('./pages/agent/DocumentVerification'));

const ManagerDashboard = lazy(() => import('./pages/manager/Dashboard'));
const Approvals = lazy(() => import('./pages/manager/Approvals'));
const OverduePremiums = lazy(() => import('./pages/manager/OverduePremiums'));
const PremiumManagement = lazy(() => import('./pages/manager/PremiumManagement'));

const Funds = lazy(() => import('./pages/admin/Funds'));
const Users = lazy(() => import('./pages/admin/Users'));

const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const MyPolicies = lazy(() => import('./pages/customer/MyPolicies'));
const PendingProposals = lazy(() => import('./pages/customer/PendingProposals'));
const PolicyDetail = lazy(() => import('./pages/customer/PolicyDetail'));
const FundPortfolio = lazy(() => import('./pages/customer/FundPortfolio'));
const Documents = lazy(() => import('./pages/customer/Documents'));

const Profile = lazy(() => import('./pages/common/Profile'));



function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            
            <Route path="/agent/dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Agent']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <AgentDashboard />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/agent/pipeline" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Agent']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <Pipeline />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/agent/documents" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Agent']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <DocumentVerification />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/manager/dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Manager']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <ManagerDashboard />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/manager/approvals" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Manager']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <Approvals />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/manager/overdue" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Manager']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <OverduePremiums />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/manager/premiums" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Manager']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <PremiumManagement />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/manager/documents" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Manager']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <DocumentVerification />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/funds" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Admin']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <Funds />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Admin']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <Users />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Suspense fallback={<Loader />}>
                    <Profile />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/customer/dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Customer']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <CustomerDashboard />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/customer/policies" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Customer']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <MyPolicies />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/customer/proposals" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Customer']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <PendingProposals />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/customer/policy-detail" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Customer']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <PolicyDetail />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/customer/portfolio" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Customer']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <FundPortfolio />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/customer/documents" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Customer']}>
                  <Layout>
                    <Suspense fallback={<Loader />}>
                      <Documents />
                    </Suspense>
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
    </ErrorBoundary>
  );
}

export default App;
