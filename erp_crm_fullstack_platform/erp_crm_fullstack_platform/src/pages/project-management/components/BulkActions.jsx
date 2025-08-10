import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BulkActions = ({ selectedProjects, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const actionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'update-status', label: 'Update Status' },
    { value: 'assign-team', label: 'Assign Team Members' },
    { value: 'set-deadline', label: 'Set New Deadline' },
    { value: 'export-reports', label: 'Export Reports' },
    { value: 'archive', label: 'Archive Projects' },
    { value: 'delete', label: 'Delete Projects' }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const teamMemberOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'david-brown', label: 'David Brown' }
  ];

  const handleBulkAction = async (actionData) => {
    setIsLoading(true);
    try {
      await onBulkAction(selectedAction, actionData);
      setSelectedAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionForm = () => {
    switch (selectedAction) {
      case 'update-status':
        return (
          <StatusUpdateForm
            onSubmit={handleBulkAction}
            onCancel={() => setSelectedAction('')}
            isLoading={isLoading}
            statusOptions={statusOptions}
          />
        );
      case 'assign-team':
        return (
          <TeamAssignForm
            onSubmit={handleBulkAction}
            onCancel={() => setSelectedAction('')}
            isLoading={isLoading}
            teamOptions={teamMemberOptions}
          />
        );
      case 'set-deadline':
        return (
          <DeadlineUpdateForm
            onSubmit={handleBulkAction}
            onCancel={() => setSelectedAction('')}
            isLoading={isLoading}
          />
        );
      case 'export-reports':
        return (
          <ExportForm
            onSubmit={handleBulkAction}
            onCancel={() => setSelectedAction('')}
            isLoading={isLoading}
          />
        );
      case 'archive': case'delete':
        return (
          <ConfirmationForm
            action={selectedAction}
            onConfirm={() => handleBulkAction({})}
            onCancel={() => setSelectedAction('')}
            isLoading={isLoading}
            selectedCount={selectedProjects?.length}
          />
        );
      default:
        return null;
    }
  };

  if (selectedProjects?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedProjects?.length} project{selectedProjects?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-xs">
          <Select
            placeholder="Choose bulk action"
            options={actionOptions}
            value={selectedAction}
            onChange={setSelectedAction}
          />
        </div>
      </div>
      {renderActionForm()}
    </div>
  );
};

const StatusUpdateForm = ({ onSubmit, onCancel, isLoading, statusOptions }) => {
  const [newStatus, setNewStatus] = useState('');

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-foreground mb-3">Update Project Status</h4>
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-xs">
          <Select
            placeholder="Select new status"
            options={statusOptions}
            value={newStatus}
            onChange={setNewStatus}
          />
        </div>
        <Button
          variant="default"
          onClick={() => onSubmit({ status: newStatus })}
          disabled={!newStatus || isLoading}
          loading={isLoading}
        >
          Update Status
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const TeamAssignForm = ({ onSubmit, onCancel, isLoading, teamOptions }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-foreground mb-3">Assign Team Members</h4>
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <Select
            placeholder="Select team members"
            options={teamOptions}
            value={selectedMembers}
            onChange={setSelectedMembers}
            multiple
            searchable
          />
        </div>
        <Button
          variant="default"
          onClick={() => onSubmit({ teamMembers: selectedMembers })}
          disabled={selectedMembers?.length === 0 || isLoading}
          loading={isLoading}
        >
          Assign Members
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const DeadlineUpdateForm = ({ onSubmit, onCancel, isLoading }) => {
  const [newDeadline, setNewDeadline] = useState('');

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-foreground mb-3">Set New Deadline</h4>
      <div className="flex items-center space-x-4">
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e?.target?.value)}
          className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          variant="default"
          onClick={() => onSubmit({ deadline: newDeadline })}
          disabled={!newDeadline || isLoading}
          loading={isLoading}
        >
          Update Deadline
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const ExportForm = ({ onSubmit, onCancel, isLoading }) => {
  const [exportFormat, setExportFormat] = useState('pdf');

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' }
  ];

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <h4 className="font-medium text-foreground mb-3">Export Project Reports</h4>
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-xs">
          <Select
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />
        </div>
        <Button
          variant="default"
          onClick={() => onSubmit({ format: exportFormat })}
          disabled={isLoading}
          loading={isLoading}
          iconName="Download"
          iconPosition="left"
        >
          Export Reports
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const ConfirmationForm = ({ action, onConfirm, onCancel, isLoading, selectedCount }) => {
  const actionText = action === 'delete' ? 'delete' : 'archive';
  const actionColor = action === 'delete' ? 'destructive' : 'warning';

  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-3 mb-4">
        <Icon 
          name={action === 'delete' ? 'AlertTriangle' : 'Archive'} 
          size={20} 
          className={action === 'delete' ? 'text-error' : 'text-warning'} 
        />
        <h4 className="font-medium text-foreground">
          Confirm {actionText?.charAt(0)?.toUpperCase() + actionText?.slice(1)}
        </h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Are you sure you want to {actionText} {selectedCount} project{selectedCount !== 1 ? 's' : ''}? 
        {action === 'delete' && ' This action cannot be undone.'}
      </p>
      <div className="flex items-center space-x-4">
        <Button
          variant={actionColor}
          onClick={onConfirm}
          disabled={isLoading}
          loading={isLoading}
        >
          {actionText?.charAt(0)?.toUpperCase() + actionText?.slice(1)} Projects
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;