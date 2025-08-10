import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BulkOperationsToolbar = ({ 
  selectedCount, 
  onBulkStatusChange, 
  onBulkAssignment, 
  onBulkExport, 
  onBulkDelete,
  onClearSelection 
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkAgent, setBulkAgent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' }
  ];

  const agentOptions = [
    { value: '', label: 'Select Agent' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const handleBulkStatusChange = async () => {
    if (!bulkStatus) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onBulkStatusChange(bulkStatus);
      setBulkStatus('');
      setShowBulkActions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAssignment = async () => {
    if (!bulkAgent) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onBulkAssignment(bulkAgent);
      setBulkAgent('');
      setShowBulkActions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onBulkExport();
      setShowBulkActions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected queries? This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        onBulkDelete();
        setShowBulkActions(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedCount} {selectedCount === 1 ? 'query' : 'queries'} selected
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkActions(!showBulkActions)}
            iconName={showBulkActions ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Bulk Actions
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          iconName="X"
        >
          Clear Selection
        </Button>
      </div>

      {showBulkActions && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Select
                label="Change Status"
                options={statusOptions}
                value={bulkStatus}
                onChange={setBulkStatus}
                placeholder="Select new status"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkStatusChange}
                disabled={!bulkStatus || isLoading}
                loading={isLoading}
                fullWidth
                iconName="RefreshCw"
                iconPosition="left"
              >
                Update Status
              </Button>
            </div>

            <div className="space-y-2">
              <Select
                label="Assign Agent"
                options={agentOptions}
                value={bulkAgent}
                onChange={setBulkAgent}
                placeholder="Select agent"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkAssignment}
                disabled={!bulkAgent || isLoading}
                loading={isLoading}
                fullWidth
                iconName="UserCheck"
                iconPosition="left"
              >
                Assign Agent
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Export Data
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExport}
                disabled={isLoading}
                loading={isLoading}
                fullWidth
                iconName="Download"
                iconPosition="left"
              >
                Export Selected
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Delete Queries
              </label>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isLoading}
                loading={isLoading}
                fullWidth
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Selected
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Info" size={14} />
              <span>Bulk operations will affect all selected queries</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>Changes may take a few moments to process</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperationsToolbar;