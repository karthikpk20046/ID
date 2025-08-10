import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActionButtons = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

  const handleQuickAction = async (actionType, route) => {
    setLoadingStates(prev => ({ ...prev, [actionType]: true }));
    
    try {
      // Simulate brief loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to the appropriate route
      navigate(route);
    } catch (error) {
      console.error('Error performing quick action:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [actionType]: false }));
    }
  };

  const quickActions = [
    {
      id: 'createInvoice',
      label: 'Create Invoice',
      icon: 'FileText',
      variant: 'default',
      route: '/invoice-management',
      description: 'Generate a new invoice for customers'
    },
    {
      id: 'addCustomer',
      label: 'Add Customer',
      icon: 'UserPlus',
      variant: 'outline',
      route: '/customer-management',
      description: 'Add new customer to database'
    },
    {
      id: 'newQuery',
      label: 'New Query',
      icon: 'MessageSquarePlus',
      variant: 'outline',
      route: '/query-management',
      description: 'Create support ticket or query'
    },
    {
      id: 'newProject',
      label: 'New Project',
      icon: 'FolderPlus',
      variant: 'outline',
      route: '/project-management',
      description: 'Start a new project'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="default"
            loading={loadingStates?.[action?.id]}
            onClick={() => handleQuickAction(action?.id, action?.route)}
            className="flex items-center justify-start space-x-3 h-16 p-4"
            title={action?.description}
            fullWidth
          >
            <div className="flex-shrink-0">
              <Icon name={action?.icon} size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{action?.label}</p>
              <p className="text-xs opacity-70 mt-1">{action?.description}</p>
            </div>
          </Button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Keyboard" size={14} />
            <span>Keyboard shortcuts available</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={14} />
            <span>Quick access to common tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionButtons;