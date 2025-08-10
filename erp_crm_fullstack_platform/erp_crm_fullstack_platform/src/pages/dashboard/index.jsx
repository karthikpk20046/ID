import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import RevenueChart from './components/RevenueChart';
import ProjectTimelineChart from './components/ProjectTimelineChart';
import QueryResolutionChart from './components/QueryResolutionChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActionButtons from './components/QuickActionButtons';
import AIInsightsDashboard from './components/AIInsightsDashboard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock dashboard data - in real app this would come from API
  const mockDashboardData = {
    metrics: {
      totalRevenue: 125780.50,
      monthlyGrowth: 15.2,
      activeProjects: 24,
      pendingQueries: 18,
      completedTasks: 342,
      teamMembers: 12
    },
    revenueData: [
      { month: 'Jan', revenue: 15400, target: 18000 },
      { month: 'Feb', revenue: 18200, target: 19000 },
      { month: 'Mar', revenue: 22100, target: 21000 },
      { month: 'Apr', revenue: 19800, target: 22000 },
      { month: 'May', revenue: 25600, target: 24000 },
      { month: 'Jun', revenue: 24580, target: 25000 }
    ],
    projectTimeline: [
      { project: 'Website Redesign', progress: 85, dueDate: '2024-02-15' },
      { project: 'Mobile App', progress: 65, dueDate: '2024-03-01' },
      { project: 'Database Migration', progress: 40, dueDate: '2024-02-28' },
      { project: 'API Integration', progress: 90, dueDate: '2024-02-10' }
    ],
    queryResolution: [
      { status: 'Open', count: 18, color: '#ef4444' },
      { status: 'In Progress', count: 25, color: '#f59e0b' },
      { status: 'Resolved', count: 156, color: '#10b981' },
      { status: 'Closed', count: 89, color: '#6b7280' }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'invoice',
        action: 'created',
        title: 'Invoice INV-2024-001 created',
        description: 'New invoice for Acme Corporation - $5,250.00',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        user: 'John Doe'
      },
      {
        id: 2,
        type: 'project',
        action: 'updated',
        title: 'Website Redesign progress updated',
        description: 'Project moved to 85% completion',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        user: 'Sarah Wilson'
      },
      {
        id: 3,
        type: 'query',
        action: 'resolved',
        title: 'Query QRY-003 resolved',
        description: 'Account access problem fixed for Global Industries',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        user: 'Mike Johnson'
      },
      {
        id: 4,
        type: 'invoice',
        action: 'paid',
        title: 'Payment received',
        description: 'Invoice INV-2024-005 marked as paid - $12,500.00',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        user: 'System'
      },
      {
        id: 5,
        type: 'project',
        action: 'created',
        title: 'New project started',
        description: 'API Integration project created and assigned',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        user: 'Emily Davis'
      }
    ],
    invoices: [
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
          { description: 'Web Development Services', quantity: 1, rate: 5000, amount: 5000, notes: 'Complete frontend and backend development' },
          { description: 'Domain Registration', quantity: 1, rate: 250, amount: 250, notes: 'Annual domain registration and SSL certificate' }
        ],
        notes: 'Thank you for your business! Payment received on time.'
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
          { description: 'Mobile App Development', quantity: 1, rate: 3500, amount: 3500, notes: 'iOS and Android app development with admin panel' },
          { description: 'App Store Submission', quantity: 1, rate: 300, amount: 300, notes: 'App store submission and optimization' }
        ],
        notes: 'Payment due within 30 days. App delivery scheduled for end of February.'
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
          { description: 'System Integration', quantity: 1, rate: 7000, amount: 7000, notes: 'Legacy system integration with new CRM platform' },
          { description: 'Training Sessions', quantity: 5, rate: 100, amount: 500, notes: 'Staff training on new system functionality' }
        ],
        notes: 'URGENT: Payment overdue. Please contact billing department immediately.'
      }
    ]
  };

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    // Handle quick actions like creating invoice, project, etc.
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
                <p className="text-muted-foreground">Loading dashboard...</p>
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
        <title>Dashboard - ERP CRM Platform</title>
        <meta name="description" content="Comprehensive business dashboard with AI-powered insights, revenue tracking, and project management overview." />
      </Helmet>
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={handleRefresh}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
              <Button
                onClick={() => handleQuickAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Revenue"
              value={`${dashboardData?.metrics?.totalRevenue?.toLocaleString()}`}
              change={`+${dashboardData?.metrics?.monthlyGrowth}%`}
              changeType="positive"
              icon="DollarSign"
              iconColor="#10b981"
              description="Total revenue generated this month with growth percentage"
            />
            <MetricsCard
              title="Active Projects"
              value={dashboardData?.metrics?.activeProjects}
              change="+3 this month"
              changeType="positive"
              icon="FolderOpen"
              iconColor="#3b82f6"
              description="Number of currently active projects in progress"
            />
            <MetricsCard
              title="Pending Queries"
              value={dashboardData?.metrics?.pendingQueries}
              change="-2 from yesterday"
              changeType="positive"
              icon="MessageSquare"
              iconColor="#f59e0b"
              description="Customer queries awaiting response or resolution"
            />
            <MetricsCard
              title="Team Members"
              value={dashboardData?.metrics?.teamMembers}
              change="Fully staffed"
              changeType="neutral"
              icon="Users"
              iconColor="#6b7280"
              description="Total number of active team members"
            />
          </div>

          {/* AI Business Insights */}
          <div className="mb-8">
            <AIInsightsDashboard 
              invoices={dashboardData?.invoices} 
              queries={[]} 
              onRefresh={handleRefresh}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart data={dashboardData?.revenueData} />
            <QueryResolutionChart data={dashboardData?.queryResolution} />
          </div>

          {/* Project Timeline */}
          <div className="mb-8">
            <ProjectTimelineChart data={dashboardData?.projectTimeline} />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentActivityFeed activities={dashboardData?.recentActivity} />
            </div>
            
            {/* Quick Actions - Takes 1 column */}
            <div>
              <QuickActionButtons onAction={handleQuickAction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;