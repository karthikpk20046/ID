import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CreateQueryModal = ({ isOpen, onClose, onCreateQuery }) => {
  const [formData, setFormData] = useState({
    customer: '',
    customerEmail: '',
    subject: '',
    description: '',
    priority: 'medium',
    assignedAgent: 'unassigned',
    initialNotes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerOptions = [
    { value: '', label: 'Select Customer' },
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc' },
    { value: 'global-industries', label: 'Global Industries' },
    { value: 'innovate-systems', label: 'Innovate Systems' },
    { value: 'future-tech', label: 'Future Tech Ltd' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const agentOptions = [
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-davis', label: 'Emily Davis' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-populate customer email based on selection
    if (field === 'customer') {
      const customerEmails = {
        'acme-corp': 'contact@acme.com',
        'tech-solutions': 'info@techsolutions.com',
        'global-industries': 'hello@global.com',
        'innovate-systems': 'support@innovate.com',
        'future-tech': 'contact@futuretech.com'
      };
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        customerEmail: customerEmails?.[value] || ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customer) {
      newErrors.customer = 'Customer is required';
    }
    if (!formData?.customerEmail) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    if (!formData?.subject || formData?.subject?.trim()?.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters long';
    }
    if (!formData?.description || formData?.description?.trim()?.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newQuery = {
        id: `QRY-${String(Date.now())?.slice(-3)}`,
        customer: customerOptions?.find(opt => opt?.value === formData?.customer)?.label || formData?.customer,
        customerEmail: formData?.customerEmail,
        subject: formData?.subject,
        description: formData?.description,
        priority: formData?.priority,
        status: 'open',
        assignedAgent: formData?.assignedAgent,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        notes: formData?.initialNotes ? [{
          id: 1,
          content: formData?.initialNotes,
          author: 'System',
          createdAt: new Date()?.toISOString()
        }] : []
      };

      onCreateQuery(newQuery);
      handleClose();
    } catch (error) {
      console.error('Error creating query:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customer: '',
      customerEmail: '',
      subject: '',
      description: '',
      priority: 'medium',
      assignedAgent: 'unassigned',
      initialNotes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="MessageSquarePlus" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Create New Query</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            iconName="X"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer"
              options={customerOptions}
              value={formData?.customer}
              onChange={(value) => handleInputChange('customer', value)}
              error={errors?.customer}
              required
              searchable
            />

            <Input
              label="Customer Email"
              type="email"
              value={formData?.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e?.target?.value)}
              error={errors?.customerEmail}
              required
              placeholder="customer@example.com"
            />
          </div>

          <Input
            label="Subject"
            type="text"
            value={formData?.subject}
            onChange={(e) => handleInputChange('subject', e?.target?.value)}
            error={errors?.subject}
            required
            placeholder="Brief description of the issue"
            description="Provide a clear, concise subject line"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              placeholder="Detailed description of the query or issue..."
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
            />
            {errors?.description && (
              <p className="text-sm text-error">{errors?.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Provide as much detail as possible to help resolve the query quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              value={formData?.priority}
              onChange={(value) => handleInputChange('priority', value)}
              required
            />

            <Select
              label="Assign to Agent"
              options={agentOptions}
              value={formData?.assignedAgent}
              onChange={(value) => handleInputChange('assignedAgent', value)}
              description="Leave unassigned for automatic routing"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Initial Notes
            </label>
            <textarea
              value={formData?.initialNotes}
              onChange={(e) => handleInputChange('initialNotes', e?.target?.value)}
              placeholder="Any additional notes or context..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add any additional context or notes
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
            >
              Create Query
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQueryModal;