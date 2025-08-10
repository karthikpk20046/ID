import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CustomerFilters = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters,
  activeFiltersCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const industryOptions = [
    { value: '', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onClearFilters();
    setIsExpanded(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search customers by name, company, or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <Icon name="Filter" size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={14} 
              className="transition-transform duration-200" 
            />
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
              Clear All
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Select status"
            />

            <Select
              label="Industry"
              options={industryOptions}
              value={filters?.industry || ''}
              onChange={(value) => handleFilterChange('industry', value)}
              placeholder="Select industry"
            />

            <Select
              label="Last Contact"
              options={dateRangeOptions}
              value={filters?.dateRange || ''}
              onChange={(value) => handleFilterChange('dateRange', value)}
              placeholder="Select date range"
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsExpanded(false)}
                className="w-full"
              >
                <Icon name="Check" size={16} />
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {filters?.status && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  <span>Status: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}</span>
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="hover:bg-primary/20 rounded p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}

              {filters?.industry && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  <span>Industry: {industryOptions?.find(opt => opt?.value === filters?.industry)?.label}</span>
                  <button
                    onClick={() => handleFilterChange('industry', '')}
                    className="hover:bg-primary/20 rounded p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}

              {filters?.dateRange && (
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                  <span>Date: {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}</span>
                  <button
                    onClick={() => handleFilterChange('dateRange', '')}
                    className="hover:bg-primary/20 rounded p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerFilters;