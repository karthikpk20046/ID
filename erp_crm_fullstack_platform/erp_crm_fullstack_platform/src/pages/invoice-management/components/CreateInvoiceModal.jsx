import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CreateInvoiceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customer: '',
    amount: '',
    status: 'Draft',
    dueDate: '',
    notes: '',
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0, notes: '' }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Overdue', label: 'Overdue' }
  ];

  const customerOptions = [
    { value: 'Acme Corporation', label: 'Acme Corporation' },
    { value: 'Tech Solutions Inc', label: 'Tech Solutions Inc' },
    { value: 'Global Industries', label: 'Global Industries' },
    { value: 'Startup Hub', label: 'Startup Hub' },
    { value: 'Enterprise Co', label: 'Enterprise Co' },
    { value: 'Digital Dynamics', label: 'Digital Dynamics' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customer?.trim()) {
      newErrors.customer = 'Customer is required';
    }

    if (!formData?.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (!formData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    // Validate items
    let hasValidItems = false;
    formData?.items?.forEach((item, index) => {
      if (item?.description?.trim()) {
        hasValidItems = true;
        if (!item?.quantity || item?.quantity <= 0) {
          newErrors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
        }
        if (!item?.rate || item?.rate <= 0) {
          newErrors[`items.${index}.rate`] = 'Rate must be greater than 0';
        }
      }
    });

    if (!hasValidItems) {
      newErrors.items = 'At least one item with description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const calculateItemAmount = (quantity, rate) => {
    return parseFloat(quantity || 0) * parseFloat(rate || 0);
  };

  const calculateTotalAmount = () => {
    return formData?.items?.reduce((total, item) => {
      return total + calculateItemAmount(item?.quantity, item?.rate);
    }, 0);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors?.[field];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData?.items];
    newItems[index] = {
      ...newItems?.[index],
      [field]: value
    };

    // Recalculate amount for quantity/rate changes
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = calculateItemAmount(
        newItems?.[index]?.quantity, 
        newItems?.[index]?.rate
      );
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));

    // Clear specific item errors
    const errorKey = `items.${index}.${field}`;
    if (errors?.[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors?.[errorKey];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev?.items, { description: '', quantity: 1, rate: 0, amount: 0, notes: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData?.items?.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev?.items?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Calculate final amount
      const totalAmount = calculateTotalAmount();
      
      const invoiceData = {
        ...formData,
        amount: totalAmount,
        // Filter out empty items
        items: formData?.items?.filter(item => item?.description?.trim())
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(invoiceData);
      onClose();
      
      // Reset form
      setFormData({
        invoiceNumber: '',
        customer: '',
        amount: '',
        status: 'Draft',
        dueDate: '',
        notes: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0, notes: '' }]
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating invoice:', error);
      setErrors({ submit: 'Failed to create invoice. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Create New Invoice</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            iconName="X"
            disabled={isLoading}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Invoice Number"
                value={formData?.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e?.target?.value)}
                placeholder="INV-2024-001"
                error={errors?.invoiceNumber}
                required
              />
              
              <Select
                label="Customer"
                options={customerOptions}
                value={formData?.customer}
                onChange={(value) => handleInputChange('customer', value)}
                placeholder="Select customer"
                error={errors?.customer}
                required
              />
              
              <Input
                type="date"
                label="Due Date"
                value={formData?.dueDate}
                onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
                error={errors?.dueDate}
                required
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
              />
            </div>

            {/* Invoice Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Invoice Notes
              </label>
              <textarea
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
                placeholder="Add any additional notes or terms for this invoice..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              />
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Line Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Item
                </Button>
              </div>

              {errors?.items && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
                  <p className="text-error text-sm">{errors?.items}</p>
                </div>
              )}

              <div className="space-y-4">
                {formData?.items?.map((item, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-foreground">Item {index + 1}</h4>
                      {formData?.items?.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          iconName="Trash2"
                          className="text-error hover:text-error"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Description"
                          value={item?.description}
                          onChange={(e) => handleItemChange(index, 'description', e?.target?.value)}
                          placeholder="Service or product description"
                          error={errors?.[`items.${index}.description`]}
                        />
                      </div>
                      
                      <Input
                        type="number"
                        label="Quantity"
                        value={item?.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e?.target?.value) || 0)}
                        placeholder="1"
                        min="1"
                        error={errors?.[`items.${index}.quantity`]}
                      />
                      
                      <Input
                        type="number"
                        label="Rate ($)"
                        value={item?.rate}
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e?.target?.value) || 0)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        error={errors?.[`items.${index}.rate`]}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Item Notes
                        </label>
                        <textarea
                          value={item?.notes || ''}
                          onChange={(e) => handleItemChange(index, 'notes', e?.target?.value)}
                          placeholder="Optional notes for this item..."
                          rows={2}
                          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                          <div className="p-3 bg-muted rounded-md">
                            <span className="text-lg font-medium text-foreground">
                              ${calculateItemAmount(item?.quantity, item?.rate)?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 flex justify-end">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${calculateTotalAmount()?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 bg-muted/30">
            {errors?.submit && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
                <p className="text-error text-sm">{errors?.submit}</p>
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;