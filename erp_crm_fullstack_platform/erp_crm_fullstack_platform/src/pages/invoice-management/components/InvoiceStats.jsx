import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceStats = ({ invoices }) => {
  const calculateStats = () => {
    const stats = {
      total: invoices?.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0
    };

    invoices?.forEach(invoice => {
      const status = invoice?.status?.toLowerCase();
      const amount = invoice?.amount;

      stats.totalAmount += amount;

      switch (status) {
        case 'draft':
          stats.draft++;
          break;
        case 'sent':
          stats.sent++;
          stats.pendingAmount += amount;
          break;
        case 'paid':
          stats.paid++;
          stats.paidAmount += amount;
          break;
        case 'overdue':
          stats.overdue++;
          stats.overdueAmount += amount;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats?.total,
      icon: 'FileText',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Paid',
      value: stats?.paid,
      subtitle: formatCurrency(stats?.paidAmount),
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Pending',
      value: stats?.sent,
      subtitle: formatCurrency(stats?.pendingAmount),
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Overdue',
      value: stats?.overdue,
      subtitle: formatCurrency(stats?.overdueAmount),
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((card, index) => (
        <div
          key={index}
          className={`bg-card rounded-lg border ${card?.borderColor} p-6 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card?.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {card?.value?.toLocaleString()}
              </p>
              {card?.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {card?.subtitle}
                </p>
              )}
            </div>
            <div className={`${card?.bgColor} ${card?.color} p-3 rounded-full`}>
              <Icon name={card?.icon} size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceStats;