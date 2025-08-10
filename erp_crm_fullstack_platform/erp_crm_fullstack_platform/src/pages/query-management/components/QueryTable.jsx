import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const QueryTable = ({ 
  queries, 
  selectedQueries, 
  onSelectQuery, 
  onSelectAll, 
  onStatusChange, 
  onAssignmentChange, 
  onViewQuery, 
  sortConfig, 
  onSort 
}) => {
  const [loadingStates, setLoadingStates] = useState({});

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' }
  ];

  const agentOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-accent bg-accent/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-error bg-error/10';
      case 'in-progress': return 'text-warning bg-warning/10';
      case 'closed': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleStatusChange = async (queryId, newStatus) => {
    setLoadingStates(prev => ({ ...prev, [`status-${queryId}`]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onStatusChange(queryId, newStatus);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`status-${queryId}`]: false }));
    }
  };

  const handleAssignmentChange = async (queryId, newAgent) => {
    setLoadingStates(prev => ({ ...prev, [`agent-${queryId}`]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onAssignmentChange(queryId, newAgent);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`agent-${queryId}`]: false }));
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = queries?.length > 0 && selectedQueries?.length === queries?.length;
  const isIndeterminate = selectedQueries?.length > 0 && selectedQueries?.length < queries?.length;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('id')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Query ID</span>
                  <Icon name={getSortIcon('id')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('customer')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Customer</span>
                  <Icon name={getSortIcon('customer')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('subject')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Subject</span>
                  <Icon name={getSortIcon('subject')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('priority')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Priority</span>
                  <Icon name={getSortIcon('priority')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Assigned Agent</th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('createdAt')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Created</span>
                  <Icon name={getSortIcon('createdAt')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queries?.map((query) => (
              <tr key={query?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedQueries?.includes(query?.id)}
                    onChange={(e) => onSelectQuery(query?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-primary">{query?.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{query?.customer}</p>
                    <p className="text-sm text-muted-foreground">{query?.customerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground truncate max-w-xs" title={query?.subject}>
                    {query?.subject}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(query?.priority)}`}>
                    {query?.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Select
                    options={statusOptions}
                    value={query?.status}
                    onChange={(value) => handleStatusChange(query?.id, value)}
                    loading={loadingStates?.[`status-${query?.id}`]}
                    className="w-32"
                  />
                </td>
                <td className="px-4 py-3">
                  <Select
                    options={agentOptions}
                    value={query?.assignedAgent}
                    onChange={(value) => handleAssignmentChange(query?.id, value)}
                    loading={loadingStates?.[`agent-${query?.id}`]}
                    className="w-36"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(query?.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewQuery(query)}
                      iconName="Eye"
                      className="h-8 w-8"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {queries?.map((query) => (
          <div key={query?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedQueries?.includes(query?.id)}
                  onChange={(e) => onSelectQuery(query?.id, e?.target?.checked)}
                />
                <div>
                  <p className="font-mono text-sm text-primary">{query?.id}</p>
                  <p className="font-medium text-foreground">{query?.customer}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewQuery(query)}
                iconName="Eye"
              />
            </div>
            
            <div className="space-y-2 mb-3">
              <p className="font-medium text-foreground">{query?.subject}</p>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(query?.priority)}`}>
                  {query?.priority}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(query?.createdAt)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Select
                label="Status"
                options={statusOptions}
                value={query?.status}
                onChange={(value) => handleStatusChange(query?.id, value)}
                loading={loadingStates?.[`status-${query?.id}`]}
              />
              <Select
                label="Assigned Agent"
                options={agentOptions}
                value={query?.assignedAgent}
                onChange={(value) => handleAssignmentChange(query?.id, value)}
                loading={loadingStates?.[`agent-${query?.id}`]}
              />
            </div>
          </div>
        ))}
      </div>
      {queries?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No queries found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or create a new query.</p>
        </div>
      )}
    </div>
  );
};

export default QueryTable;