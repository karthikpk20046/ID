import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const QueryFilters = ({ onFiltersChange, onClearFilters, totalQueries, filteredCount }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedAgent: '',
    dateRange: '',
    searchQuery: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const agentOptions = [
    { value: '', label: 'All Agents' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      status: '',
      priority: '',
      assignedAgent: '',
      dateRange: '',
      searchQuery: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalQueries} queries
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Filter by status"
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => handleFilterChange('priority', value)}
          placeholder="Filter by priority"
        />

        <Select
          label="Assigned Agent"
          options={agentOptions}
          value={filters?.assignedAgent}
          onChange={(value) => handleFilterChange('assignedAgent', value)}
          placeholder="Filter by agent"
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Filter by date"
        />

        <Input
          label="Search"
          type="search"
          placeholder="Search queries..."
          value={filters?.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
        />
      </div>
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters?.status && (
              <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-sm">
                Status: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            )}
            {filters?.priority && (
              <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-sm">
                Priority: {priorityOptions?.find(opt => opt?.value === filters?.priority)?.label}
                <button
                  onClick={() => handleFilterChange('priority', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            )}
            {filters?.assignedAgent && (
              <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-sm">
                Agent: {agentOptions?.find(opt => opt?.value === filters?.assignedAgent)?.label}
                <button
                  onClick={() => handleFilterChange('assignedAgent', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            )}
            {filters?.dateRange && (
              <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-sm">
                Date: {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}
                <button
                  onClick={() => handleFilterChange('dateRange', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            )}
            {filters?.searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-muted rounded-md text-sm">
                Search: "{filters?.searchQuery}"
                <button
                  onClick={() => handleFilterChange('searchQuery', '')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default QueryFilters;