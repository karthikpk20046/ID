import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockActivities = [
    {
      id: 1,
      type: 'invoice',
      title: 'Invoice INV-2024-001 created',
      description: 'New invoice generated for Acme Corporation - $5,250.00',
      user: 'John Smith',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: 'FileText',
      iconColor: 'bg-primary'
    },
    {
      id: 2,
      type: 'customer',
      title: 'New customer added',
      description: 'Tech Solutions Inc has been added to the customer database',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      icon: 'UserPlus',
      iconColor: 'bg-success'
    },
    {
      id: 3,
      type: 'query',
      title: 'Query QRY-001 resolved',
      description: 'Payment issue for Global Industries has been resolved',
      user: 'Mike Davis',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      icon: 'CheckCircle',
      iconColor: 'bg-success'
    },
    {
      id: 4,
      type: 'project',
      title: 'Project milestone completed',
      description: 'Website Redesign project - Phase 1 completed successfully',
      user: 'Emily Chen',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'Target',
      iconColor: 'bg-accent'
    },
    {
      id: 5,
      type: 'invoice',
      title: 'Payment received',
      description: 'Invoice INV-2024-002 payment confirmed - $3,800.00',
      user: 'System',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: 'CreditCard',
      iconColor: 'bg-success'
    },
    {
      id: 6,
      type: 'query',
      title: 'New support query',
      description: 'Feature request submitted by Innovative Corp',
      user: 'Alex Rodriguez',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      icon: 'MessageSquare',
      iconColor: 'bg-warning'
    },
    {
      id: 7,
      type: 'customer',
      title: 'Customer profile updated',
      description: 'Contact information updated for Digital Dynamics LLC',
      user: 'Lisa Wang',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      icon: 'Edit',
      iconColor: 'bg-secondary'
    },
    {
      id: 8,
      type: 'project',
      title: 'New project created',
      description: 'Mobile App Development project initiated for StartupXYZ',
      user: 'David Brown',
      timestamp: new Date(Date.now() - 18000000), // 5 hours ago
      icon: 'FolderPlus',
      iconColor: 'bg-primary'
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleViewAll = () => {
    console.log('Navigate to full activity log...');
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <div className="animate-pulse w-16 h-4 bg-muted rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)]?.map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button
          onClick={handleViewAll}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150"
        >
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150">
            <div className={`flex-shrink-0 w-8 h-8 ${activity?.iconColor} rounded-full flex items-center justify-center`}>
              <Icon name={activity?.icon} size={16} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity?.title}
                </p>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {activity?.description}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <Icon name="User" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{activity?.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Activity updates automatically every 5 minutes
        </p>
      </div>
    </div>
  );
};

export default RecentActivityFeed;