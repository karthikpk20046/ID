import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useGeminiAI } from '../../../hooks/useGeminiAI';

const InvoiceTable = ({
  invoices,
  selectedInvoices,
  onSelectionChange,
  onEdit,
  onDuplicate,
  onSend,
  onGeneratePDF,
  onGenerateSummary,
  onDelete,
  sortConfig,
  onSort
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [notesSummaries, setNotesSummaries] = useState({});

  // Gemini AI Integration
  const { 
    isLoading: isAiLoading, 
    error: aiError, 
    isAvailable: isAiAvailable,
    generateSummary,
    resetError
  } = useGeminiAI();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-success bg-success/10';
      case 'sent': return 'text-accent bg-accent/10';
      case 'overdue': return 'text-error bg-error/10';
      case 'draft': return 'text-muted-foreground bg-muted/50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(invoices?.map(invoice => invoice?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      onSelectionChange([...selectedInvoices, invoiceId]);
    } else {
      onSelectionChange(selectedInvoices?.filter(id => id !== invoiceId));
    }
  };

  const toggleExpandRow = (invoiceId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(invoiceId)) {
      newExpanded?.delete(invoiceId);
    } else {
      newExpanded?.add(invoiceId);
    }
    setExpandedRows(newExpanded);
  };

  // AI-powered invoice summary generation
  const handleGenerateAISummary = async (invoice) => {
    if (!isAiAvailable) {
      alert('AI features are not available. Please check your Gemini API key configuration.');
      return;
    }

    try {
      resetError();
      const summary = await generateSummary(invoice, 'invoice');
      setNotesSummaries(prev => ({
        ...prev,
        [invoice?.id]: summary
      }));
    } catch (error) {
      console.error('Error generating AI summary:', error);
      alert(`Failed to generate AI summary: ${error?.message}`);
    }
  };

  if (!invoices || invoices?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No invoices found</h3>
          <p className="text-muted-foreground">Create your first invoice to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left py-3 px-4 w-12">
                <Checkbox
                  checked={selectedInvoices?.length === invoices?.length}
                  indeterminate={selectedInvoices?.length > 0 && selectedInvoices?.length < invoices?.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('invoiceNumber')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Invoice #</span>
                  <Icon name={getSortIcon('invoiceNumber')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('customer')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Customer</span>
                  <Icon name={getSortIcon('customer')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('amount')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('dueDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Due Date</span>
                  <Icon name={getSortIcon('dueDate')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground">
                <button
                  onClick={() => onSort('createdDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <span>Created</span>
                  <Icon name={getSortIcon('createdDate')} size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-foreground w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((invoice, index) => (
              <React.Fragment key={invoice?.id}>
                <tr className={`border-t border-border hover:bg-muted/30 transition-colors ${
                  selectedInvoices?.includes(invoice?.id) ? 'bg-primary/5' : ''
                }`}>
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={selectedInvoices?.includes(invoice?.id)}
                      onChange={(checked) => handleSelectInvoice(invoice?.id, checked)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleExpandRow(invoice?.id)}
                        className="mr-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon 
                          name={expandedRows?.has(invoice?.id) ? "ChevronDown" : "ChevronRight"} 
                          size={16} 
                        />
                      </button>
                      <span className="font-medium text-foreground">{invoice?.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{invoice?.customer}</p>
                      <p className="text-sm text-muted-foreground">{invoice?.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-foreground">
                      {formatCurrency(invoice?.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice?.status)}`}>
                      {invoice?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-foreground">{formatDate(invoice?.dueDate)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-foreground">{formatDate(invoice?.createdDate)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(invoice?.id)}
                        iconName="Edit"
                        className="h-8 w-8"
                        title="Edit invoice"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(invoice?.id)}
                        iconName="Copy"
                        className="h-8 w-8"
                        title="Duplicate invoice"
                      />
                      {invoice?.status !== 'Sent' && invoice?.status !== 'Paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSend(invoice?.id)}
                          iconName="Send"
                          className="h-8 w-8"
                          title="Send invoice"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onGeneratePDF(invoice?.id)}
                        iconName="Download"
                        className="h-8 w-8"
                        title="Download PDF"
                      />
                      {isAiAvailable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateAISummary(invoice)}
                          iconName="Sparkles"
                          className="h-8 w-8 text-primary"
                          title="Generate AI Summary"
                          loading={isAiLoading}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(invoice?.id)}
                        iconName="Trash2"
                        className="h-8 w-8 text-error hover:text-error"
                        title="Delete invoice"
                      />
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows?.has(invoice?.id) && (
                  <tr className="border-t border-border bg-muted/20">
                    <td colSpan="8" className="py-4 px-4">
                      <div className="space-y-4">
                        {/* Line Items */}
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Line Items:</h4>
                          <div className="bg-card rounded-md border border-border overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left py-2 px-3 font-medium text-foreground">Description</th>
                                  <th className="text-right py-2 px-3 font-medium text-foreground w-20">Qty</th>
                                  <th className="text-right py-2 px-3 font-medium text-foreground w-24">Rate</th>
                                  <th className="text-right py-2 px-3 font-medium text-foreground w-24">Amount</th>
                                  <th className="text-center py-2 px-3 font-medium text-foreground w-32">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoice?.items?.map((item, itemIndex) => (
                                  <tr key={itemIndex} className="border-t border-border">
                                    <td className="py-2 px-3 text-foreground">{item?.description}</td>
                                    <td className="py-2 px-3 text-right text-foreground">{item?.quantity}</td>
                                    <td className="py-2 px-3 text-right text-foreground">{formatCurrency(item?.rate)}</td>
                                    <td className="py-2 px-3 text-right font-medium text-foreground">
                                      {formatCurrency(item?.amount)}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      {item?.notes ? (
                                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                          {item?.notes?.length > 50 ? `${item?.notes?.substring(0, 50)}...` : item?.notes}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-muted-foreground italic">No notes</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Invoice Notes */}
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Invoice Notes:</h4>
                          <div className="bg-card rounded-md border border-border p-3">
                            <p className="text-sm text-foreground">
                              {invoice?.notes || 'No additional notes'}
                            </p>
                          </div>
                        </div>

                        {/* AI Summary Section */}
                        {notesSummaries?.[invoice?.id] && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2 flex items-center">
                              <Icon name="Sparkles" size={16} className="text-primary mr-1" />
                              AI-Generated Summary:
                            </h4>
                            <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {notesSummaries?.[invoice?.id]}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(invoice?.id)}
                            iconName="Edit"
                            iconPosition="left"
                          >
                            Edit Invoice
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onGeneratePDF(invoice?.id)}
                            iconName="Download"
                            iconPosition="left"
                          >
                            Download PDF
                          </Button>
                          {isAiAvailable && !notesSummaries?.[invoice?.id] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateAISummary(invoice)}
                              iconName="Sparkles"
                              iconPosition="left"
                              loading={isAiLoading}
                            >
                              Generate AI Summary
                            </Button>
                          )}
                          {isAiAvailable && notesSummaries?.[invoice?.id] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateAISummary(invoice)}
                              iconName="RefreshCw"
                              iconPosition="left"
                              loading={isAiLoading}
                            >
                              Regenerate Summary
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;