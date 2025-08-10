import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceFilters = ({ onFiltersChange, totalInvoices, filteredCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    customer: '',
    amountMin: '',
    amountMax: ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const customerOptions = [
    { value: '', label: 'All Customers' },
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc' },
    { value: 'global-industries', label: 'Global Industries' },
    { value: 'startup-hub', label: 'Startup Hub' },
    { value: 'enterprise-co', label: 'Enterprise Co' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      customer: '',
      amountMin: '',
      amountMax: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
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
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalInvoices} invoices
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search invoices, customers..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Customer Filter */}
        <Select
          placeholder="Filter by customer"
          options={customerOptions}
          value={filters?.customer}
          onChange={(value) => handleFilterChange('customer', value)}
          searchable
        />

        {/* Date Range */}
        <Input
          type="date"
          label="From Date"
          value={filters?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
        />

        <Input
          type="date"
          label="To Date"
          value={filters?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
        />

        {/* Amount Range */}
        <Input
          type="number"
          placeholder="Min amount"
          label="Min Amount ($)"
          value={filters?.amountMin}
          onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
          min="0"
          step="0.01"
        />

        <Input
          type="number"
          placeholder="Max amount"
          label="Max Amount ($)"
          value={filters?.amountMax}
          onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default InvoiceFilters;