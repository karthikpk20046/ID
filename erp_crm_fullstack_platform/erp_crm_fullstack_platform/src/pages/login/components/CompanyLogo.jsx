import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyLogo = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo Icon */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-lg">
          <Icon name="Building2" size={32} color="white" />
        </div>
      </div>
      
      {/* Company Name */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        ERP CRM
      </h1>
      
      {/* Tagline */}
      <p className="text-muted-foreground text-sm">
        Enterprise Resource Planning & Customer Relationship Management
      </p>
      
      {/* Welcome Message */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to access your business management dashboard
        </p>
      </div>
    </div>
  );
};

export default CompanyLogo;