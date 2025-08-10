import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CustomerTable from './components/CustomerTable';
import CustomerFilters from './components/CustomerFilters';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import CustomerFormModal from './components/CustomerFormModal';
import CustomerDetailsModal from './components/CustomerDetailsModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import PaginationControls from './components/PaginationControls';

const CustomerManagement = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    dateRange: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock customer data
  const mockCustomers = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechFlow Solutions",
      email: "sarah.johnson@techflow.com",
      phone: "+1 (555) 123-4567",
      address: "123 Innovation Drive",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "us",
      industry: "technology",
      status: "active",
      lastContact: "2025-01-05T10:30:00Z",
      createdAt: "2024-03-15T09:00:00Z",
      notes: "Key client for enterprise solutions. Prefers email communication and quarterly business reviews.",
      totalInvoices: 12,
      totalRevenue: "45,250.00",
      openQueries: 2
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Global Healthcare Partners",
      email: "m.chen@globalhealthcare.com",
      phone: "+1 (555) 234-5678",
      address: "456 Medical Center Blvd",
      city: "Boston",
      state: "MA",
      zipCode: "02115",
      country: "us",
      industry: "healthcare",
      status: "active",
      lastContact: "2025-01-08T14:15:00Z",
      createdAt: "2024-01-20T11:30:00Z",
      notes: "Large healthcare network requiring HIPAA-compliant solutions. Monthly check-ins scheduled.",
      totalInvoices: 8,
      totalRevenue: "78,900.00",
      openQueries: 0
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Retail Dynamics Inc",
      email: "emily.r@retaildynamics.com",
      phone: "+1 (555) 345-6789",
      address: "789 Commerce Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "us",
      industry: "retail",
      status: "pending",
      lastContact: "2024-12-28T16:45:00Z",
      createdAt: "2024-11-10T13:20:00Z",
      notes: "Evaluating our POS integration services. Decision expected by end of Q1 2025.",
      totalInvoices: 3,
      totalRevenue: "12,750.00",
      openQueries: 1
    },
    {
      id: 4,
      name: "David Thompson",
      company: "Manufacturing Excellence Corp",
      email: "d.thompson@mexcellence.com",
      phone: "+1 (555) 456-7890",
      address: "321 Industrial Way",
      city: "Detroit",
      state: "MI",
      zipCode: "48201",
      country: "us",
      industry: "manufacturing",
      status: "active",
      lastContact: "2025-01-07T09:20:00Z",
      createdAt: "2024-05-08T10:15:00Z",
      notes: "Requires 24/7 support for critical manufacturing systems. Excellent payment history.",
      totalInvoices: 15,
      totalRevenue: "92,400.00",
      openQueries: 3
    },
    {
      id: 5,
      name: "Lisa Wang",
      company: "EduTech Innovations",
      email: "lisa.wang@edutech-innov.com",
      phone: "+1 (555) 567-8901",
      address: "654 University Avenue",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "us",
      industry: "education",
      status: "inactive",
      lastContact: "2024-11-15T12:30:00Z",
      createdAt: "2024-02-28T14:45:00Z",
      notes: "Contract ended in November 2024. Potential for renewal in 2025 academic year.",
      totalInvoices: 6,
      totalRevenue: "28,650.00",
      openQueries: 0
    },
    {
      id: 6,
      name: "Robert Kim",
      company: "Financial Advisory Group",
      email: "robert.kim@finadvgroup.com",
      phone: "+1 (555) 678-9012",
      address: "987 Wall Street",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      country: "us",
      industry: "finance",
      status: "active",
      lastContact: "2025-01-09T11:00:00Z",
      createdAt: "2024-06-12T08:30:00Z",
      notes: "High-security requirements for financial data. Quarterly compliance audits required.",
      totalInvoices: 9,
      totalRevenue: "67,800.00",
      openQueries: 1
    },
    {
      id: 7,
      name: "Amanda Foster",
      company: "Strategic Consulting Partners",
      email: "amanda.foster@stratconsult.com",
      phone: "+1 (555) 789-0123",
      address: "147 Business Plaza",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "us",
      industry: "consulting",
      status: "active",
      lastContact: "2025-01-06T15:30:00Z",
      createdAt: "2024-04-03T16:20:00Z",
      notes: "Specializes in digital transformation projects. Prefers agile project management approach.",
      totalInvoices: 11,
      totalRevenue: "54,300.00",
      openQueries: 2
    },
    {
      id: 8,
      name: "James Wilson",
      company: "Wilson & Associates",
      email: "james@wilsonassoc.com",
      phone: "+1 (555) 890-1234",
      address: "258 Professional Drive",
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      country: "us",
      industry: "other",
      status: "pending",
      lastContact: "2025-01-02T13:45:00Z",
      createdAt: "2024-12-20T10:00:00Z",
      notes: "New client onboarding in progress. Requires custom integration with existing systems.",
      totalInvoices: 1,
      totalRevenue: "8,500.00",
      openQueries: 4
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
        setFilteredCustomers(mockCustomers);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(customer =>
        customer?.name?.toLowerCase()?.includes(query) ||
        customer?.company?.toLowerCase()?.includes(query) ||
        customer?.email?.toLowerCase()?.includes(query)
      );
    }

    // Apply status filter
    if (filters?.status) {
      filtered = filtered?.filter(customer => customer?.status === filters?.status);
    }

    // Apply industry filter
    if (filters?.industry) {
      filtered = filtered?.filter(customer => customer?.industry === filters?.industry);
    }

    // Apply date range filter
    if (filters?.dateRange) {
      const now = new Date();
      const filterDate = new Date();

      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          break;
        case 'quarter':
          filterDate?.setMonth(now?.getMonth() - 3);
          break;
        case 'year':
          filterDate?.setFullYear(now?.getFullYear() - 1);
          break;
        default:
          filterDate?.setFullYear(1970);
      }

      filtered = filtered?.filter(customer => 
        new Date(customer.lastContact) >= filterDate
      );
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [customers, searchQuery, filters]);

  // Pagination logic
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCustomers?.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers?.length / itemsPerPage);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters)?.filter(value => value !== '')?.length;
  }, [filters]);

  // Event handlers
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectCustomer = (customerId, isSelected) => {
    setSelectedCustomers(prev => 
      isSelected 
        ? [...prev, customerId]
        : prev?.filter(id => id !== customerId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedCustomers(isSelected ? paginatedCustomers?.map(c => c?.id) : []);
  };

  const handleClearSelection = () => {
    setSelectedCustomers([]);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowFormModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowFormModal(true);
    setShowDetailsModal(false);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    setSelectedCustomer(null);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedCustomer) {
        // Update existing customer
        const updatedCustomers = customers?.map(customer =>
          customer?.id === selectedCustomer?.id
            ? { ...customer, ...formData, lastContact: new Date()?.toISOString() }
            : customer
        );
        setCustomers(updatedCustomers);
      } else {
        // Add new customer
        const newCustomer = {
          ...formData,
          id: Math.max(...customers?.map(c => c?.id)) + 1,
          createdAt: new Date()?.toISOString(),
          lastContact: new Date()?.toISOString(),
          totalInvoices: 0,
          totalRevenue: "0.00",
          openQueries: 0
        };
        setCustomers(prev => [...prev, newCustomer]);
      }
      
      setShowFormModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedCustomers?.length > 0) {
        // Bulk delete
        const updatedCustomers = customers?.filter(
          customer => !selectedCustomers?.includes(customer?.id)
        );
        setCustomers(updatedCustomers);
        setSelectedCustomers([]);
      } else if (selectedCustomer) {
        // Single delete
        const updatedCustomers = customers?.filter(
          customer => customer?.id !== selectedCustomer?.id
        );
        setCustomers(updatedCustomers);
      }
      
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error deleting customer(s):', error);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      const updatedCustomers = customers?.map(customer =>
        selectedCustomers?.includes(customer?.id)
          ? { ...customer, status, lastContact: new Date()?.toISOString() }
          : customer
      );
      setCustomers(updatedCustomers);
      setSelectedCustomers([]);
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const handleBulkExport = async () => {
    try {
      const selectedCustomerData = customers?.filter(customer =>
        selectedCustomers?.includes(customer?.id)
      );
      
      // Create CSV content
      const headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Industry', 'Last Contact'];
      const csvContent = [
        headers?.join(','),
        ...selectedCustomerData?.map(customer => [
          customer?.name,
          customer?.company,
          customer?.email,
          customer?.phone,
          customer?.status,
          customer?.industry,
          new Date(customer.lastContact)?.toLocaleDateString()
        ]?.join(','))
      ]?.join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL?.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      window.URL?.revokeObjectURL(url);
      
      setSelectedCustomers([]);
    } catch (error) {
      console.error('Error exporting customers:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      industry: '',
      dateRange: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Customer Management - ERP CRM Platform</title>
        <meta name="description" content="Manage customer relationships, contact information, and business interactions with comprehensive CRM tools." />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage customer relationships and contact information
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBulkExport}
                disabled={loading}
              >
                <Icon name="Download" size={16} />
                Export All
              </Button>
              
              <Button
                onClick={handleAddCustomer}
                disabled={loading}
              >
                <Icon name="Plus" size={16} />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Filters */}
          <CustomerFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Bulk Actions */}
          <BulkActionsToolbar
            selectedCount={selectedCustomers?.length}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkExport={handleBulkExport}
            onClearSelection={handleClearSelection}
          />

          {/* Customer Table */}
          <CustomerTable
            customers={paginatedCustomers}
            selectedCustomers={selectedCustomers}
            onSelectCustomer={handleSelectCustomer}
            onSelectAll={handleSelectAll}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onView={handleViewCustomer}
            sortConfig={sortConfig}
            onSort={handleSort}
            loading={loading}
          />

          {/* Pagination */}
          {!loading && filteredCustomers?.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCustomers?.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              loading={loading}
            />
          )}
        </div>
      </main>
      {/* Modals */}
      <CustomerFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer}
        loading={loading}
      />
      <CustomerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onEdit={handleEditCustomer}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDeleteConfirm}
        customer={selectedCustomer}
        selectedCount={selectedCustomers?.length}
        loading={loading}
      />
    </div>
  );
};

export default CustomerManagement;