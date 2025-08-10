import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const DashboardQuickActions = () => {
  const [loadingStates, setLoadingStates] = useState({});

  const handleQuickAction = async (actionType) => {
    setLoadingStates(prev => ({ ...prev, [actionType]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (actionType) {
        case 'newCustomer': console.log('Opening new customer form...');
          // Navigate to customer creation or open modal
          break;
        case 'newInvoice': console.log('Opening new invoice form...');
          // Navigate to invoice creation or open modal
          break;
        case 'newQuery': console.log('Opening new query form...');
          // Navigate to query creation or open modal
          break;
        case 'newProject': console.log('Opening new project form...');
          // Navigate to project creation or open modal
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing quick action:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [actionType]: false }));
    }
  };

  const quickActions = [
    {
      id: 'newCustomer',
      label: 'New Customer',
      icon: 'UserPlus',
      variant: 'default',
      description: 'Add a new customer to the system'
    },
    {
      id: 'newInvoice',
      label: 'Create Invoice',
      icon: 'FileText',
      variant: 'outline',
      description: 'Generate a new invoice'
    },
    {
      id: 'newQuery',
      label: 'New Query',
      icon: 'MessageSquarePlus',
      variant: 'outline',
      description: 'Create a support ticket'
    },
    {
      id: 'newProject',
      label: 'New Project',
      icon: 'FolderPlus',
      variant: 'outline',
      description: 'Start a new project'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="default"
            loading={loadingStates?.[action?.id]}
            onClick={() => handleQuickAction(action?.id)}
            className="flex flex-col items-center justify-center h-20 space-y-2 text-center"
            title={action?.description}
          >
            <Icon name={action?.icon} size={20} />
            <span className="text-sm font-medium">{action?.label}</span>
          </Button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Quick access to frequently used actions. Click any button to get started.
        </p>
      </div>
    </div>
  );
};

export default DashboardQuickActions;