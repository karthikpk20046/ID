import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedInvoices, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'mark-sent', label: 'Mark as Sent' },
    { value: 'mark-paid', label: 'Mark as Paid' },
    { value: 'send-reminders', label: 'Send Payment Reminders' },
    { value: 'export-pdf', label: 'Export as PDF' },
    { value: 'export-csv', label: 'Export as CSV' },
    { value: 'duplicate', label: 'Duplicate Invoices' },
    { value: 'delete', label: 'Delete Invoices', disabled: false }
  ];

  const handleBulkAction = async () => {
    if (!selectedAction || selectedInvoices?.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onBulkAction(selectedAction, selectedInvoices);
      
      // Reset selection after successful action
      setSelectedAction('');
      onClearSelection();
      
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'mark-sent': return 'Send';
      case 'mark-paid': return 'CheckCircle';
      case 'send-reminders': return 'Bell';
      case 'export-pdf': return 'FileDown';
      case 'export-csv': return 'Download';
      case 'duplicate': return 'Copy';
      case 'delete': return 'Trash2';
      default: return 'Play';
    }
  };

  const getActionVariant = (action) => {
    return action === 'delete' ? 'destructive' : 'default';
  };

  if (selectedInvoices?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
            <Icon name="CheckSquare" size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedInvoices?.length} invoice{selectedInvoices?.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-muted-foreground">
              Choose an action to apply to selected invoices
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none sm:w-64">
            <Select
              placeholder="Select action..."
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              disabled={isProcessing}
            />
          </div>

          <Button
            variant={getActionVariant(selectedAction)}
            onClick={handleBulkAction}
            disabled={!selectedAction || isProcessing}
            loading={isProcessing}
            iconName={getActionIcon(selectedAction)}
            iconPosition="left"
          >
            {isProcessing ? 'Processing...' : 'Apply'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
            iconName="X"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
      {/* Action Preview */}
      {selectedAction && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md border-l-4 border-primary">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Action Preview: {bulkActionOptions?.find(opt => opt?.value === selectedAction)?.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This action will be applied to {selectedInvoices?.length} selected invoice{selectedInvoices?.length !== 1 ? 's' : ''}. 
                {selectedAction === 'delete' && ' This action cannot be undone.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;