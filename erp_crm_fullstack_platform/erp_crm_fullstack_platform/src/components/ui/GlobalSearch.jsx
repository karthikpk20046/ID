import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalSearch = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Mock search data
  const mockData = {
    customers: [
      { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', type: 'customer' },
      { id: 2, name: 'Tech Solutions Inc', email: 'info@techsolutions.com', type: 'customer' },
      { id: 3, name: 'Global Industries', email: 'hello@global.com', type: 'customer' }
    ],
    invoices: [
      { id: 'INV-001', customer: 'Acme Corporation', amount: '$5,250.00', status: 'paid', type: 'invoice' },
      { id: 'INV-002', customer: 'Tech Solutions Inc', amount: '$3,800.00', status: 'pending', type: 'invoice' },
      { id: 'INV-003', customer: 'Global Industries', amount: '$7,500.00', status: 'overdue', type: 'invoice' }
    ],
    queries: [
      { id: 'QRY-001', title: 'Payment Issue', customer: 'Acme Corporation', status: 'open', type: 'query' },
      { id: 'QRY-002', title: 'Feature Request', customer: 'Tech Solutions Inc', status: 'in-progress', type: 'query' },
      { id: 'QRY-003', title: 'Technical Support', customer: 'Global Industries', status: 'resolved', type: 'query' }
    ],
    projects: [
      { id: 'PRJ-001', name: 'Website Redesign', client: 'Acme Corporation', status: 'active', type: 'project' },
      { id: 'PRJ-002', name: 'Mobile App Development', client: 'Tech Solutions Inc', status: 'planning', type: 'project' },
      { id: 'PRJ-003', name: 'System Integration', client: 'Global Industries', status: 'completed', type: 'project' }
    ]
  };

  const performSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const results = [];
    const searchTerm = query?.toLowerCase();

    // Search customers
    mockData?.customers?.forEach(customer => {
      if (customer?.name?.toLowerCase()?.includes(searchTerm) || 
          customer?.email?.toLowerCase()?.includes(searchTerm)) {
        results?.push(customer);
      }
    });

    // Search invoices
    mockData?.invoices?.forEach(invoice => {
      if (invoice?.id?.toLowerCase()?.includes(searchTerm) || 
          invoice?.customer?.toLowerCase()?.includes(searchTerm)) {
        results?.push(invoice);
      }
    });

    // Search queries
    mockData?.queries?.forEach(query => {
      if (query?.title?.toLowerCase()?.includes(searchTerm) || 
          query?.customer?.toLowerCase()?.includes(searchTerm)) {
        results?.push(query);
      }
    });

    // Search projects
    mockData?.projects?.forEach(project => {
      if (project?.name?.toLowerCase()?.includes(searchTerm) || 
          project?.client?.toLowerCase()?.includes(searchTerm)) {
        results?.push(project);
      }
    });

    setSearchResults(results?.slice(0, 8)); // Limit to 8 results
    setShowResults(true);
    setIsLoading(false);
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    performSearch(value);
  };

  const handleResultClick = (result) => {
    switch (result?.type) {
      case 'customer': navigate('/customer-management', { state: { selectedCustomer: result?.id } });
        break;
      case 'invoice': navigate('/invoice-management', { state: { selectedInvoice: result?.id } });
        break;
      case 'query': navigate('/query-management', { state: { selectedQuery: result?.id } });
        break;
      case 'project': navigate('/project-management', { state: { selectedProject: result?.id } });
        break;
      default:
        break;
    }
    handleClose();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      searchInputRef?.current?.focus();
    }, 100);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'customer': return 'User';
      case 'invoice': return 'FileText';
      case 'query': return 'MessageSquare';
      case 'project': return 'FolderOpen';
      default: return 'Search';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': case 'resolved': case 'completed': case 'active':
        return 'text-success';
      case 'pending': case 'in-progress': case 'planning':
        return 'text-warning';
      case 'overdue': case 'open':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef?.current && !searchContainerRef?.current?.contains(event?.target)) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.key === 'Escape') {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="Search" size={16} />
        </Button>
      ) : (
        <div className="flex items-center">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" 
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search customers, invoices, queries..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-80 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="ml-2"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}
      {/* Search Results Dropdown */}
      {showResults && isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults?.length > 0 ? (
            <div className="py-2">
              {searchResults?.map((result, index) => (
                <button
                  key={`${result?.type}-${result?.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-150 flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    <Icon name={getResultIcon(result?.type)} size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {result?.name || result?.title || result?.id}
                      </p>
                      <span className="text-xs text-muted-foreground capitalize ml-2">
                        {result?.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {result?.email || result?.customer || result?.client || result?.amount}
                    </p>
                    {result?.status && (
                      <span className={`text-xs capitalize ${getStatusColor(result?.status)}`}>
                        {result?.status}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery?.trim() && !isLoading ? (
            <div className="px-4 py-6 text-center">
              <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching for customers, invoices, queries, or projects</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;