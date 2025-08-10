import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

import QueryFilters from './components/QueryFilters';
import QueryTable from './components/QueryTable';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import CreateQueryModal from './components/CreateQueryModal';
import QueryDetailsModal from './components/QueryDetailsModal';
import QueryPagination from './components/QueryPagination';

const QueryManagement = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [selectedQueries, setSelectedQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedAgent: '',
    dateRange: '',
    searchQuery: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockQueries = [
    {
      id: 'QRY-001',
      customer: 'Acme Corporation',
      customerEmail: 'contact@acme.com',
      subject: 'Payment Processing Issue',
      description: `We are experiencing difficulties with payment processing on our account. The system shows an error message when trying to process customer payments.\n\nThis is affecting our daily operations and needs urgent attention.`,
      priority: 'urgent',
      status: 'open',
      assignedAgent: 'john-doe',
      createdAt: '2025-01-08T10:30:00Z',
      updatedAt: '2025-01-08T14:45:00Z',
      notes: [
        {
          id: 1,
          content: 'Initial investigation shows this might be related to the recent payment gateway update.',
          author: 'John Doe',
          createdAt: '2025-01-08T11:00:00Z'
        },
        {
          id: 2,
          content: 'Escalated to technical team for further analysis.',
          author: 'John Doe',
          createdAt: '2025-01-08T14:45:00Z'
        }
      ]
    },
    {
      id: 'QRY-002',
      customer: 'Tech Solutions Inc',
      customerEmail: 'info@techsolutions.com',
      subject: 'Feature Request - Advanced Reporting',
      description: `We would like to request an enhancement to the reporting module to include more detailed analytics and custom dashboard capabilities.\n\nSpecific requirements:\n- Custom date ranges\n- Export to multiple formats\n- Scheduled reports`,
      priority: 'medium',
      status: 'in-progress',
      assignedAgent: 'sarah-wilson',
      createdAt: '2025-01-07T09:15:00Z',
      updatedAt: '2025-01-08T16:20:00Z',
      notes: [
        {
          id: 1,
          content: 'Requirements gathered and documented. Moving to development phase.',
          author: 'Sarah Wilson',
          createdAt: '2025-01-08T16:20:00Z'
        }
      ]
    },
    {
      id: 'QRY-003',
      customer: 'Global Industries',
      customerEmail: 'hello@global.com',
      subject: 'Account Access Problem',
      description: `Multiple users in our organization are unable to access their accounts. They receive a "Session Expired" error even after successful login.`,
      priority: 'high',
      status: 'closed',
      assignedAgent: 'mike-johnson',
      createdAt: '2025-01-06T14:20:00Z',
      updatedAt: '2025-01-07T10:30:00Z',
      notes: [
        {
          id: 1,
          content: 'Issue identified as browser cache problem. Provided solution to clear cache and cookies.',
          author: 'Mike Johnson',
          createdAt: '2025-01-07T09:15:00Z'
        },
        {
          id: 2,
          content: 'Customer confirmed issue is resolved. Closing ticket.',
          author: 'Mike Johnson',
          createdAt: '2025-01-07T10:30:00Z'
        }
      ]
    },
    {
      id: 'QRY-004',
      customer: 'Innovate Systems',
      customerEmail: 'support@innovate.com',
      subject: 'Data Export Functionality',
      description: `Need assistance with bulk data export. The current export feature seems to timeout for large datasets.`,
      priority: 'medium',
      status: 'open',
      assignedAgent: 'emily-davis',
      createdAt: '2025-01-05T11:45:00Z',
      updatedAt: '2025-01-05T11:45:00Z',
      notes: []
    },
    {
      id: 'QRY-005',
      customer: 'Future Tech Ltd',
      customerEmail: 'contact@futuretech.com',
      subject: 'Integration API Documentation',
      description: `Requesting updated API documentation for the latest version. Current documentation seems outdated.`,
      priority: 'low',
      status: 'in-progress',
      assignedAgent: 'john-doe',
      createdAt: '2025-01-04T16:30:00Z',
      updatedAt: '2025-01-06T09:00:00Z',
      notes: [
        {
          id: 1,
          content: 'Working on updating the API documentation. Should be ready by end of week.',
          author: 'John Doe',
          createdAt: '2025-01-06T09:00:00Z'
        }
      ]
    },
    {
      id: 'QRY-006',
      customer: 'Digital Dynamics',
      customerEmail: 'info@digitaldynamics.com',
      subject: 'Performance Issues',
      description: `The application has been running slowly during peak hours. Page load times are significantly increased.`,
      priority: 'high',
      status: 'open',
      assignedAgent: 'unassigned',
      createdAt: '2025-01-03T13:20:00Z',
      updatedAt: '2025-01-03T13:20:00Z',
      notes: []
    }
  ];

  // Initialize data
  useEffect(() => {
    const loadQueries = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQueries(mockQueries);
        setFilteredQueries(mockQueries);
      } finally {
        setIsLoading(false);
      }
    };

    loadQueries();
  }, []);

  // Filter and search queries
  const processedQueries = useMemo(() => {
    let result = [...queries];

    // Apply filters
    if (filters?.status) {
      result = result?.filter(query => query?.status === filters?.status);
    }
    if (filters?.priority) {
      result = result?.filter(query => query?.priority === filters?.priority);
    }
    if (filters?.assignedAgent) {
      result = result?.filter(query => query?.assignedAgent === filters?.assignedAgent);
    }
    if (filters?.searchQuery) {
      const searchTerm = filters?.searchQuery?.toLowerCase();
      result = result?.filter(query =>
        query?.subject?.toLowerCase()?.includes(searchTerm) ||
        query?.customer?.toLowerCase()?.includes(searchTerm) ||
        query?.description?.toLowerCase()?.includes(searchTerm) ||
        query?.id?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply date range filter
    if (filters?.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result?.filter(query => {
        const queryDate = new Date(query.createdAt);
        switch (filters?.dateRange) {
          case 'today':
            return queryDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday?.setDate(yesterday?.getDate() - 1);
            return queryDate >= yesterday && queryDate < today;
          case 'this-week':
            const weekStart = new Date(today);
            weekStart?.setDate(weekStart?.getDate() - weekStart?.getDay());
            return queryDate >= weekStart;
          case 'last-week':
            const lastWeekStart = new Date(today);
            lastWeekStart?.setDate(lastWeekStart?.getDate() - lastWeekStart?.getDay() - 7);
            const lastWeekEnd = new Date(lastWeekStart);
            lastWeekEnd?.setDate(lastWeekEnd?.getDate() + 7);
            return queryDate >= lastWeekStart && queryDate < lastWeekEnd;
          case 'this-month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return queryDate >= monthStart;
          case 'last-month':
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
            return queryDate >= lastMonthStart && queryDate < lastMonthEnd;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'createdAt' || sortConfig?.key === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [queries, filters, sortConfig]);

  // Paginate queries
  const paginatedQueries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedQueries?.slice(startIndex, startIndex + itemsPerPage);
  }, [processedQueries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedQueries?.length / itemsPerPage);

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSelectedQueries([]);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setSelectedQueries([]);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectQuery = (queryId, isSelected) => {
    if (isSelected) {
      setSelectedQueries(prev => [...prev, queryId]);
    } else {
      setSelectedQueries(prev => prev?.filter(id => id !== queryId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedQueries(paginatedQueries?.map(query => query?.id));
    } else {
      setSelectedQueries([]);
    }
  };

  const handleStatusChange = (queryId, newStatus) => {
    setQueries(prev => prev?.map(query =>
      query?.id === queryId
        ? { ...query, status: newStatus, updatedAt: new Date()?.toISOString() }
        : query
    ));
  };

  const handleAssignmentChange = (queryId, newAgent) => {
    setQueries(prev => prev?.map(query =>
      query?.id === queryId
        ? { ...query, assignedAgent: newAgent, updatedAt: new Date()?.toISOString() }
        : query
    ));
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setIsDetailsModalOpen(true);
  };

  const handleCreateQuery = (newQuery) => {
    setQueries(prev => [newQuery, ...prev]);
  };

  const handleUpdateQuery = (queryId, updates) => {
    setQueries(prev => prev?.map(query =>
      query?.id === queryId
        ? { ...query, ...updates, updatedAt: new Date()?.toISOString() }
        : query
    ));
    
    if (selectedQuery && selectedQuery?.id === queryId) {
      setSelectedQuery(prev => ({ ...prev, ...updates }));
    }
  };

  const handleAddNote = (queryId, note) => {
    setQueries(prev => prev?.map(query =>
      query?.id === queryId
        ? { 
            ...query, 
            notes: [...(query?.notes || []), note],
            updatedAt: new Date()?.toISOString()
          }
        : query
    ));
    
    if (selectedQuery && selectedQuery?.id === queryId) {
      setSelectedQuery(prev => ({ 
        ...prev, 
        notes: [...(prev?.notes || []), note]
      }));
    }
  };

  const handleEditNote = (queryId, noteId, newContent) => {
    setQueries(prev => prev?.map(query =>
      query?.id === queryId
        ? {
            ...query,
            notes: query?.notes?.map(note =>
              note?.id === noteId ? { ...note, content: newContent } : note
            ),
            updatedAt: new Date()?.toISOString()
          }
        : query
    ));
    
    if (selectedQuery && selectedQuery?.id === queryId) {
      setSelectedQuery(prev => ({
        ...prev,
        notes: prev?.notes?.map(note =>
          note?.id === noteId ? { ...note, content: newContent } : note
        )
      }));
    }
  };

  const handleDeleteNote = (queryId, noteId) => {
    setQueries(prev => prev?.map(query =>
      query?.id === queryId
        ? {
            ...query,
            notes: query?.notes?.filter(note => note?.id !== noteId),
            updatedAt: new Date()?.toISOString()
          }
        : query
    ));
    
    if (selectedQuery && selectedQuery?.id === queryId) {
      setSelectedQuery(prev => ({
        ...prev,
        notes: prev?.notes?.filter(note => note?.id !== noteId)
      }));
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    setQueries(prev => prev?.map(query =>
      selectedQueries?.includes(query?.id)
        ? { ...query, status: newStatus, updatedAt: new Date()?.toISOString() }
        : query
    ));
    setSelectedQueries([]);
  };

  const handleBulkAssignment = (newAgent) => {
    setQueries(prev => prev?.map(query =>
      selectedQueries?.includes(query?.id)
        ? { ...query, assignedAgent: newAgent, updatedAt: new Date()?.toISOString() }
        : query
    ));
    setSelectedQueries([]);
  };

  const handleBulkExport = () => {
    const selectedQueriesData = queries?.filter(query => selectedQueries?.includes(query?.id));
    const csvContent = [
      ['ID', 'Customer', 'Subject', 'Priority', 'Status', 'Assigned Agent', 'Created'],
      ...selectedQueriesData?.map(query => [
        query?.id,
        query?.customer,
        query?.subject,
        query?.priority,
        query?.status,
        query?.assignedAgent,
        new Date(query.createdAt)?.toLocaleDateString()
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `queries-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
    
    setSelectedQueries([]);
  };

  const handleBulkDelete = () => {
    setQueries(prev => prev?.filter(query => !selectedQueries?.includes(query?.id)));
    setSelectedQueries([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedQueries([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedQueries([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading queries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Query Management</h1>
              <p className="text-muted-foreground">
                Manage customer support tickets and track resolution progress
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              className="mt-4 sm:mt-0"
            >
              Create Query
            </Button>
          </div>

          {/* Filters */}
          <QueryFilters
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalQueries={queries?.length}
            filteredCount={processedQueries?.length}
          />

          {/* Bulk Operations */}
          <BulkOperationsToolbar
            selectedCount={selectedQueries?.length}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkAssignment={handleBulkAssignment}
            onBulkExport={handleBulkExport}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedQueries([])}
          />

          {/* Query Table */}
          <QueryTable
            queries={paginatedQueries}
            selectedQueries={selectedQueries}
            onSelectQuery={handleSelectQuery}
            onSelectAll={handleSelectAll}
            onStatusChange={handleStatusChange}
            onAssignmentChange={handleAssignmentChange}
            onViewQuery={handleViewQuery}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <QueryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={processedQueries?.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}

          {/* Modals */}
          <CreateQueryModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateQuery={handleCreateQuery}
          />

          <QueryDetailsModal
            isOpen={isDetailsModalOpen}
            query={selectedQuery}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedQuery(null);
            }}
            onUpdateQuery={handleUpdateQuery}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </div>
    </div>
  );
};

export default QueryManagement;