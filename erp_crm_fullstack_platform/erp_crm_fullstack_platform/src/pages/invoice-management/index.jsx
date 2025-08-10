import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceTable from './components/InvoiceTable';
import BulkActions from './components/BulkActions';
import InvoiceStats from './components/InvoiceStats';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import Pagination from './components/Pagination';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceNumber', direction: 'desc' });

  // Mock invoice data
  const mockInvoices = [
    {
      id: 'inv-001',
      invoiceNumber: 'INV-2024-001',
      customer: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      amount: 5250.00,
      status: 'Paid',
      dueDate: '2024-01-15',
      createdDate: '2024-01-01',
      items: [
        { description: 'Web Development Services', quantity: 1, rate: 5000, amount: 5000 },
        { description: 'Domain Registration', quantity: 1, rate: 250, amount: 250 }
      ],
      notes: 'Thank you for your business!'
    },
    {
      id: 'inv-002',
      invoiceNumber: 'INV-2024-002',
      customer: 'Tech Solutions Inc',
      customerEmail: 'accounts@techsolutions.com',
      amount: 3800.00,
      status: 'Sent',
      dueDate: '2024-02-20',
      createdDate: '2024-01-20',
      items: [
        { description: 'Mobile App Development', quantity: 1, rate: 3500, amount: 3500 },
        { description: 'App Store Submission', quantity: 1, rate: 300, amount: 300 }
      ],
      notes: 'Payment due within 30 days'
    },
    {
      id: 'inv-003',
      invoiceNumber: 'INV-2024-003',
      customer: 'Global Industries',
      customerEmail: 'finance@global.com',
      amount: 7500.00,
      status: 'Overdue',
      dueDate: '2024-01-10',
      createdDate: '2023-12-15',
      items: [
        { description: 'System Integration', quantity: 1, rate: 7000, amount: 7000 },
        { description: 'Training Sessions', quantity: 5, rate: 100, amount: 500 }
      ],
      notes: 'Urgent: Payment overdue'
    },
    {
      id: 'inv-004',
      invoiceNumber: 'INV-2024-004',
      customer: 'Startup Hub',
      customerEmail: 'billing@startuphub.com',
      amount: 2200.00,
      status: 'Draft',
      dueDate: '2024-03-01',
      createdDate: '2024-02-01',
      items: [
        { description: 'Logo Design', quantity: 1, rate: 1500, amount: 1500 },
        { description: 'Brand Guidelines', quantity: 1, rate: 700, amount: 700 }
      ],
      notes: 'Draft - pending client approval'
    },
    {
      id: 'inv-005',
      invoiceNumber: 'INV-2024-005',
      customer: 'Enterprise Co',
      customerEmail: 'payments@enterprise.com',
      amount: 12500.00,
      status: 'Sent',
      dueDate: '2024-03-15',
      createdDate: '2024-02-15',
      items: [
        { description: 'Enterprise Software License', quantity: 1, rate: 10000, amount: 10000 },
        { description: 'Implementation Services', quantity: 1, rate: 2500, amount: 2500 }
      ],
      notes: 'Annual license renewal'
    },
    {
      id: 'inv-006',
      invoiceNumber: 'INV-2024-006',
      customer: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      amount: 1800.00,
      status: 'Paid',
      dueDate: '2024-02-28',
      createdDate: '2024-02-01',
      items: [
        { description: 'Monthly Maintenance', quantity: 1, rate: 1500, amount: 1500 },
        { description: 'Security Updates', quantity: 1, rate: 300, amount: 300 }
      ],
      notes: 'Monthly recurring service'
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInvoices(mockInvoices);
        setFilteredInvoices(mockInvoices);
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Filter invoices
  const handleFiltersChange = (filters) => {
    let filtered = [...invoices];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(invoice =>
        invoice?.invoiceNumber?.toLowerCase()?.includes(searchTerm) ||
        invoice?.customer?.toLowerCase()?.includes(searchTerm) ||
        invoice?.customerEmail?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(invoice =>
        invoice?.status?.toLowerCase() === filters?.status?.toLowerCase()
      );
    }

    // Customer filter
    if (filters?.customer) {
      filtered = filtered?.filter(invoice =>
        invoice?.customer?.toLowerCase()?.includes(filters?.customer?.toLowerCase())
      );
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(invoice =>
        new Date(invoice.createdDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(invoice =>
        new Date(invoice.createdDate) <= new Date(filters.dateTo)
      );
    }

    // Amount range filter
    if (filters?.amountMin) {
      filtered = filtered?.filter(invoice =>
        invoice?.amount >= parseFloat(filters?.amountMin)
      );
    }

    if (filters?.amountMax) {
      filtered = filtered?.filter(invoice =>
        invoice?.amount <= parseFloat(filters?.amountMax)
      );
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Sort invoices
  const sortedInvoices = useMemo(() => {
    if (!sortConfig?.key) return filteredInvoices;

    return [...filteredInvoices]?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      // Handle different data types
      if (sortConfig?.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortConfig?.key === 'dueDate' || sortConfig?.key === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredInvoices, sortConfig]);

  // Paginate invoices
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedInvoices?.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedInvoices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedInvoices?.length / itemsPerPage);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle invoice actions
  const handleEdit = (invoiceId) => {
    console.log('Editing invoice:', invoiceId);
    // Implement edit functionality
  };

  const handleDuplicate = (invoiceId) => {
    const originalInvoice = invoices?.find(inv => inv?.id === invoiceId);
    if (originalInvoice) {
      const duplicatedInvoice = {
        ...originalInvoice,
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2024-${String(invoices?.length + 1)?.padStart(3, '0')}`,
        status: 'Draft',
        createdDate: new Date()?.toISOString()?.split('T')?.[0]
      };
      
      setInvoices(prev => [duplicatedInvoice, ...prev]);
      setFilteredInvoices(prev => [duplicatedInvoice, ...prev]);
      console.log('Invoice duplicated:', duplicatedInvoice);
    }
  };

  const handleSend = (invoiceId) => {
    setInvoices(prev => prev?.map(invoice =>
      invoice?.id === invoiceId
        ? { ...invoice, status: 'Sent' }
        : invoice
    ));
    setFilteredInvoices(prev => prev?.map(invoice =>
      invoice?.id === invoiceId
        ? { ...invoice, status: 'Sent' }
        : invoice
    ));
    console.log('Invoice sent:', invoiceId);
  };

  const handleGeneratePDF = (invoiceId) => {
    console.log('Generating PDF for invoice:', invoiceId);
    // Implement PDF generation
  };

  const handleGenerateSummary = async (invoiceId) => {
    const invoice = invoices?.find(inv => inv?.id === invoiceId);
    if (invoice) {
      // Simulate AI summary generation
      const summary = `AI-Generated Summary: Invoice ${invoice?.invoiceNumber} for ${invoice?.customer} includes ${invoice?.items?.length} line items totaling ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })?.format(invoice?.amount)}. Services include ${invoice?.items?.map(item => item?.description)?.join(', ')}. Status: ${invoice?.status}.`;
      
      console.log('AI Summary generated:', summary);
      alert(`AI Summary:\n\n${summary}`);
    }
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      setInvoices(prev => prev?.filter(invoice => invoice?.id !== invoiceId));
      setFilteredInvoices(prev => prev?.filter(invoice => invoice?.id !== invoiceId));
      setSelectedInvoices(prev => prev?.filter(id => id !== invoiceId));
      console.log('Invoice deleted:', invoiceId);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action, invoiceIds) => {
    console.log('Bulk action:', action, 'on invoices:', invoiceIds);
    
    switch (action) {
      case 'mark-sent':
        setInvoices(prev => prev?.map(invoice =>
          invoiceIds?.includes(invoice?.id)
            ? { ...invoice, status: 'Sent' }
            : invoice
        ));
        setFilteredInvoices(prev => prev?.map(invoice =>
          invoiceIds?.includes(invoice?.id)
            ? { ...invoice, status: 'Sent' }
            : invoice
        ));
        break;
      case 'mark-paid':
        setInvoices(prev => prev?.map(invoice =>
          invoiceIds?.includes(invoice?.id)
            ? { ...invoice, status: 'Paid' }
            : invoice
        ));
        setFilteredInvoices(prev => prev?.map(invoice =>
          invoiceIds?.includes(invoice?.id)
            ? { ...invoice, status: 'Paid' }
            : invoice
        ));
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${invoiceIds?.length} invoices? This action cannot be undone.`)) {
          setInvoices(prev => prev?.filter(invoice => !invoiceIds?.includes(invoice?.id)));
          setFilteredInvoices(prev => prev?.filter(invoice => !invoiceIds?.includes(invoice?.id)));
        }
        break;
      default:
        console.log('Bulk action not implemented:', action);
    }
  };

  // Handle create invoice
  const handleCreateInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      customerEmail: 'customer@example.com', // This would come from customer data
      createdDate: new Date()?.toISOString()?.split('T')?.[0]
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
    setFilteredInvoices(prev => [newInvoice, ...prev]);
    console.log('New invoice created:', newInvoice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading invoices...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Invoice Management - ERP CRM</title>
        <meta name="description" content="Manage invoices, track payments, and streamline billing processes with our comprehensive invoice management system." />
      </Helmet>
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Invoice Management</h1>
              <p className="text-muted-foreground">
                Create, manage, and track invoices with AI-powered features
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => console.log('Exporting invoices...')}
              >
                Export
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Invoice
              </Button>
            </div>
          </div>

          {/* Invoice Stats */}
          <InvoiceStats invoices={filteredInvoices} />

          {/* Filters */}
          <InvoiceFilters
            onFiltersChange={handleFiltersChange}
            totalInvoices={invoices?.length}
            filteredCount={filteredInvoices?.length}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedInvoices={selectedInvoices}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedInvoices([])}
          />

          {/* Invoice Table */}
          <InvoiceTable
            invoices={paginatedInvoices}
            selectedInvoices={selectedInvoices}
            onSelectionChange={setSelectedInvoices}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onSend={handleSend}
            onGeneratePDF={handleGeneratePDF}
            onGenerateSummary={handleGenerateSummary}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedInvoices?.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>
      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateInvoice}
      />
    </div>
  );
};

export default InvoiceManagement;