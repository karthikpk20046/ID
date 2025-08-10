import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsToolbar = ({ 
  selectedCount, 
  onBulkDelete, 
  onBulkStatusUpdate, 
  onBulkExport, 
  onClearSelection 
}) => {
  const [bulkAction, setBulkAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Choose action...' },
    { value: 'export', label: 'Export Selected' },
    { value: 'activate', label: 'Mark as Active' },
    { value: 'deactivate', label: 'Mark as Inactive' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleBulkAction = async () => {
    if (!bulkAction || selectedCount === 0) return;

    setIsProcessing(true);

    try {
      switch (bulkAction) {
        case 'export':
          await onBulkExport();
          break;
        case 'activate': await onBulkStatusUpdate('active');
          break;
        case 'deactivate': await onBulkStatusUpdate('inactive');
          break;
        case 'delete':
          await onBulkDelete();
          break;
        default:
          break;
      }
      
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = () => {
    switch (bulkAction) {
      case 'export':
        return 'Download';
      case 'activate': case'deactivate':
        return 'RefreshCw';
      case 'delete':
        return 'Trash2';
      default:
        return 'Play';
    }
  };

  const getActionVariant = () => {
    return bulkAction === 'delete' ? 'destructive' : 'default';
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} customer{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} />
            Clear selection
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="Choose action..."
              className="min-w-[160px]"
            />
            
            <Button
              variant={getActionVariant()}
              size="sm"
              onClick={handleBulkAction}
              disabled={!bulkAction || isProcessing}
              loading={isProcessing}
            >
              <Icon name={getActionIcon()} size={16} />
              {isProcessing ? 'Processing...' : 'Apply'}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkExport()}
          disabled={isProcessing}
          className="text-xs"
        >
          <Icon name="Download" size={14} />
          Export CSV
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusUpdate('active')}
          disabled={isProcessing}
          className="text-xs"
        >
          <Icon name="CheckCircle" size={14} />
          Activate
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusUpdate('inactive')}
          disabled={isProcessing}
          className="text-xs"
        >
          <Icon name="XCircle" size={14} />
          Deactivate
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkDelete()}
          disabled={isProcessing}
          className="text-xs text-error hover:text-error hover:bg-error/10"
        >
          <Icon name="Trash2" size={14} />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;