import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  customer = null, 
  selectedCount = 0, 
  loading = false 
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isBulkDelete = selectedCount > 0;
  const requiredText = isBulkDelete ? 'DELETE' : customer?.name || '';
  const isConfirmValid = confirmText === requiredText;

  const handleConfirm = async () => {
    if (!isConfirmValid) return;

    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
      setConfirmText('');
    } catch (error) {
      console.error('Delete operation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setConfirmText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-border">
          <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isBulkDelete ? 'Delete Multiple Customers' : 'Delete Customer'}
            </h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-2">
                  {isBulkDelete 
                    ? `You are about to delete ${selectedCount} customer${selectedCount !== 1 ? 's' : ''}.`
                    : `You are about to delete "${customer?.name}".`
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  This will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center space-x-2">
                    <Icon name="Dot" size={12} />
                    <span>Customer information and contact details</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Dot" size={12} />
                    <span>Associated invoices and billing history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Dot" size={12} />
                    <span>Related queries and support tickets</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Dot" size={12} />
                    <span>Project assignments and history</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              To confirm deletion, type{' '}
              <span className="font-mono bg-muted px-1 py-0.5 rounded text-error">
                {requiredText}
              </span>{' '}
              below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e?.target?.value)}
              placeholder={`Type "${requiredText}" to confirm`}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
              disabled={isDeleting}
            />
          </div>

          {!isBulkDelete && customer && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {customer?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{customer?.company}</p>
                  <p className="text-xs text-muted-foreground">{customer?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            loading={isDeleting}
          >
            <Icon name="Trash2" size={16} />
            {isDeleting 
              ? 'Deleting...' 
              : isBulkDelete 
                ? `Delete ${selectedCount} Customer${selectedCount !== 1 ? 's' : ''}` 
                : 'Delete Customer'
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;