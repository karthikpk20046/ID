import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerDetailsModal = ({ 
  isOpen, 
  onClose, 
  customer, 
  onEdit 
}) => {
  if (!isOpen || !customer) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const customerDetails = [
    {
      section: 'Contact Information',
      icon: 'User',
      items: [
        { label: 'Full Name', value: customer?.name, icon: 'User' },
        { label: 'Company', value: customer?.company, icon: 'Building2' },
        { label: 'Email', value: customer?.email, icon: 'Mail' },
        { label: 'Phone', value: customer?.phone, icon: 'Phone' }
      ]
    },
    {
      section: 'Address Information',
      icon: 'MapPin',
      items: [
        { label: 'Address', value: customer?.address || 'Not provided', icon: 'MapPin' },
        { label: 'City', value: customer?.city || 'Not provided', icon: 'MapPin' },
        { label: 'State', value: customer?.state || 'Not provided', icon: 'MapPin' },
        { label: 'ZIP Code', value: customer?.zipCode || 'Not provided', icon: 'MapPin' },
        { label: 'Country', value: customer?.country || 'Not provided', icon: 'Globe' }
      ]
    },
    {
      section: 'Business Information',
      icon: 'Briefcase',
      items: [
        { label: 'Industry', value: customer?.industry || 'Not specified', icon: 'Briefcase' },
        { label: 'Customer Since', value: formatDate(customer?.createdAt || new Date()), icon: 'Calendar' },
        { label: 'Last Contact', value: formatDate(customer?.lastContact), icon: 'Clock' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {customer?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{customer?.name}</h2>
              <p className="text-sm text-muted-foreground">{customer?.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(customer?.status)}`}>
              {customer?.status}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {customerDetails?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon name={section?.icon} size={20} className="text-primary" />
                  <h3 className="text-lg font-medium text-foreground">{section?.section}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  {section?.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <Icon name={item?.icon} size={16} className="text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item?.label}</p>
                        <p className="text-sm text-muted-foreground break-words">{item?.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notes Section */}
            {customer?.notes && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} className="text-primary" />
                  <h3 className="text-lg font-medium text-foreground">Notes</h3>
                </div>
                <div className="pl-7">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{customer?.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Summary */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Activity" size={20} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Activity Summary</h3>
              </div>
              <div className="pl-7 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {customer?.totalInvoices || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Invoices</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success mb-1">
                    ${customer?.totalRevenue || '0.00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-warning mb-1">
                    {customer?.openQueries || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Open Queries</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            onClick={() => onEdit(customer)}
          >
            <Icon name="Edit" size={16} />
            Edit Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;