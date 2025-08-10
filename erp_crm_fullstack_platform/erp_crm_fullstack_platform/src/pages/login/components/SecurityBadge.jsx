import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadge = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      {/* Security Indicators */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">SSL Secured</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">256-bit Encryption</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">Enterprise Grade</span>
        </div>
      </div>
      
      {/* Trust Message */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your data is protected with enterprise-grade security measures
        </p>
      </div>
      
      {/* Demo Credentials Info */}
      <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-md">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={14} className="text-accent mt-0.5 flex-shrink-0" />
          <div className="text-xs text-accent">
            <p className="font-medium mb-1">Demo Credentials Available:</p>
            <p>Admin: admin@erpcrm.com / admin123</p>
            <p>Manager: manager@erpcrm.com / manager123</p>
            <p>User: user@erpcrm.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadge;