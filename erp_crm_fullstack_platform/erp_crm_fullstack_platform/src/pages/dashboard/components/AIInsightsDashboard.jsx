import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useGeminiAI } from '../../../hooks/useGeminiAI';

const AIInsightsDashboard = ({ invoices, queries, onRefresh }) => {
  const [businessInsights, setBusinessInsights] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { 
    isLoading: isAiLoading, 
    error: aiError, 
    isAvailable: isAiAvailable,
    generateSummary,
    resetError
  } = useGeminiAI();

  useEffect(() => {
    if (isAiAvailable && invoices?.length > 0) {
      generateInsights();
    }
  }, [invoices?.length, isAiAvailable]);

  const generateInsights = async () => {
    if (!isAiAvailable || !invoices || invoices?.length === 0) {
      return;
    }

    try {
      resetError();
      const insights = await generateSummary(invoices, 'business');
      setBusinessInsights(insights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating business insights:', error);
    }
  };

  const handleRefreshInsights = async () => {
    await generateInsights();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (!isAiAvailable) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon name="Brain" size={20} className="text-muted-foreground mr-2" />
            <h3 className="text-lg font-semibold text-foreground">AI Business Insights</h3>
          </div>
          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
            Unavailable
          </span>
        </div>
        
        <div className="text-center py-8">
          <Icon name="AlertCircle" size={48} className="text-warning mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">AI Features Unavailable</h4>
          <p className="text-muted-foreground mb-4 text-sm">
            Configure your Gemini API key to unlock AI-powered business insights
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
            iconName="ExternalLink"
            iconPosition="left"
          >
            Get API Key
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon name="Sparkles" size={20} className="text-primary mr-2" />
          <h3 className="text-lg font-semibold text-foreground">AI Business Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated?.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshInsights}
            loading={isAiLoading}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>

      {aiError && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
          <div className="flex items-center">
            <Icon name="AlertTriangle" size={16} className="text-error mr-2" />
            <p className="text-error text-sm">{aiError}</p>
          </div>
        </div>
      )}

      {isAiLoading && !businessInsights && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Generating AI insights...</p>
        </div>
      )}

      {businessInsights && (
        <div className="space-y-4">
          <div className={`prose prose-sm max-w-none ${isExpanded ? '' : 'line-clamp-6'}`}>
            <div className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {businessInsights}
            </div>
          </div>
          
          {businessInsights?.length > 500 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="left"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </Button>
          )}
        </div>
      )}

      {!businessInsights && !isAiLoading && !aiError && (
        <div className="text-center py-8">
          <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No Insights Available</h4>
          <p className="text-muted-foreground mb-4 text-sm">
            Add some invoice data to generate AI-powered business insights
          </p>
          <Button
            onClick={generateInsights}
            iconName="Sparkles"
            iconPosition="left"
            size="sm"
            disabled={!invoices || invoices?.length === 0}
          >
            Generate Insights
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      {invoices?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{invoices?.length}</p>
              <p className="text-xs text-muted-foreground">Total Invoices</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">
                {invoices?.filter(inv => inv?.status === 'Paid')?.length}
              </p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {invoices?.filter(inv => inv?.status === 'Sent')?.length}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-error">
                {invoices?.filter(inv => inv?.status === 'Overdue')?.length}
              </p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsDashboard;