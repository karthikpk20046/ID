import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProjectManagement from './pages/project-management';
import QueryManagement from './pages/query-management';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import InvoiceManagement from './pages/invoice-management';
import CustomerManagement from './pages/customer-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CustomerManagement />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/query-management" element={<QueryManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice-management" element={<InvoiceManagement />} />
        <Route path="/customer-management" element={<CustomerManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
