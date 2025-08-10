import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProjectFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const clientOptions = [
    { value: '', label: 'All Clients' },
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc' },
    { value: 'global-industries', label: 'Global Industries' },
    { value: 'innovate-systems', label: 'Innovate Systems' },
    { value: 'digital-dynamics', label: 'Digital Dynamics' }
  ];

  const teamMemberOptions = [
    { value: '', label: 'All Team Members' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'david-brown', label: 'David Brown' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Projects</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search projects..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />

        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          placeholder="Filter by client"
          options={clientOptions}
          value={filters?.client}
          onChange={(value) => handleFilterChange('client', value)}
          searchable
        />

        <Select
          placeholder="Filter by team member"
          options={teamMemberOptions}
          value={filters?.teamMember}
          onChange={(value) => handleFilterChange('teamMember', value)}
          searchable
        />
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
          <Input
            type="date"
            label="Start Date From"
            value={filters?.startDateFrom}
            onChange={(e) => handleFilterChange('startDateFrom', e?.target?.value)}
          />

          <Input
            type="date"
            label="Start Date To"
            value={filters?.startDateTo}
            onChange={(e) => handleFilterChange('startDateTo', e?.target?.value)}
          />

          <Input
            type="date"
            label="Deadline From"
            value={filters?.deadlineFrom}
            onChange={(e) => handleFilterChange('deadlineFrom', e?.target?.value)}
          />

          <Input
            type="date"
            label="Deadline To"
            value={filters?.deadlineTo}
            onChange={(e) => handleFilterChange('deadlineTo', e?.target?.value)}
          />

          <Input
            type="number"
            label="Min Progress %"
            placeholder="0"
            min="0"
            max="100"
            value={filters?.minProgress}
            onChange={(e) => handleFilterChange('minProgress', e?.target?.value)}
          />

          <Input
            type="number"
            label="Max Progress %"
            placeholder="100"
            min="0"
            max="100"
            value={filters?.maxProgress}
            onChange={(e) => handleFilterChange('maxProgress', e?.target?.value)}
          />
        </div>
      )}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {filters?.search && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Search" size={14} className="mr-1" />
              Search: {filters?.search}
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-2 hover:bg-primary/20 rounded-full p-1"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {filters?.status && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Filter" size={14} className="mr-1" />
              Status: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
              <button
                onClick={() => handleFilterChange('status', '')}
                className="ml-2 hover:bg-primary/20 rounded-full p-1"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {filters?.client && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Icon name="Building" size={14} className="mr-1" />
              Client: {clientOptions?.find(opt => opt?.value === filters?.client)?.label}
              <button
                onClick={() => handleFilterChange('client', '')}
                className="ml-2 hover:bg-primary/20 rounded-full p-1"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;