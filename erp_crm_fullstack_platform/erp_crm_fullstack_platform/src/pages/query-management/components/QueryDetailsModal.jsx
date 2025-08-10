import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { useGeminiAI } from '../../../hooks/useGeminiAI';

const QueryDetailsModal = ({ isOpen, query, onClose, onUpdateQuery, onAddNote, onEditNote, onDeleteNote }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [responseSuggestions, setResponseSuggestions] = useState([]);

  // Gemini AI Integration
  const { 
    isLoading: isAiLoading, 
    error: aiError, 
    isAvailable: isAiAvailable,
    generateSummary,
    generateResponseSuggestions,
    analyzeSentiment,
    resetError
  } = useGeminiAI();

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' }
  ];

  const agentOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const tabs = [
    { id: 'details', label: 'Details', icon: 'FileText' },
    { id: 'notes', label: 'Notes', icon: 'MessageSquare' },
    { id: 'ai-insights', label: 'AI Insights', icon: 'Sparkles' },
    { id: 'activity', label: 'Activity', icon: 'Clock' }
  ];

  const handleGenerateNotesSummary = async () => {
    if (!query?.notes || query?.notes?.length === 0) {
      alert('No notes available to summarize.');
      return;
    }

    try {
      resetError();
      const summary = await generateSummary(query?.notes, 'notes');
      setAiSummary(summary);
      setActiveTab('ai-insights');
    } catch (error) {
      console.error('Error generating AI summary:', error);
      alert(`Failed to generate summary: ${error?.message}`);
    }
  };

  const handleGenerateResponseSuggestions = async () => {
    try {
      resetError();
      const suggestions = await generateResponseSuggestions(query);
      setResponseSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert(`Failed to generate suggestions: ${error?.message}`);
    }
  };

  const handleAnalyzeSentiment = async (text) => {
    try {
      resetError();
      const analysis = await analyzeSentiment(text);
      return analysis;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  };

  const handleUseSuggestion = (suggestion) => {
    setNewNote(suggestion);
    setShowSuggestions(false);
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdateQuery(query?.id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignmentChange = async (newAgent) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdateQuery(query?.id, { assignedAgent: newAgent });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdateQuery(query?.id, { priority: newPriority });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote?.trim()) return;

    setIsAddingNote(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const note = {
        id: Date.now(),
        content: newNote,
        author: 'Current User',
        createdAt: new Date()?.toISOString()
      };
      onAddNote(query?.id, note);
      setNewNote('');
      
      // Reset AI summary when new note is added
      setAiSummary('');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note?.id);
    setEditNoteContent(note?.content);
  };

  const handleSaveEdit = async () => {
    if (!editNoteContent?.trim()) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onEditNote(query?.id, editingNote, editNoteContent);
      setEditingNote(null);
      setEditNoteContent('');
      
      // Reset AI summary when note is edited
      setAiSummary('');
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        onDeleteNote(query?.id, noteId);
        
        // Reset AI summary when note is deleted
        setAiSummary('');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-accent bg-accent/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-error bg-error/10';
      case 'in-progress': return 'text-warning bg-warning/10';
      case 'closed': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !query) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="MessageSquare" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{query?.subject}</h2>
              <p className="text-sm text-muted-foreground">Query ID: {query?.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAiAvailable && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateNotesSummary}
                  loading={isAiLoading}
                  iconName="Sparkles"
                  iconPosition="left"
                  disabled={!query?.notes || query?.notes?.length === 0}
                >
                  Generate Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateResponseSuggestions}
                  loading={isAiLoading}
                  iconName="MessageCircle"
                  iconPosition="left"
                >
                  AI Suggestions
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.id === 'notes' && query?.notes && (
                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {query?.notes?.length}
                </span>
              )}
              {tab?.id === 'ai-insights' && isAiAvailable && (
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Customer</label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium text-foreground">{query?.customer}</p>
                      <p className="text-sm text-muted-foreground">{query?.customerEmail}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-foreground">{query?.subject}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-foreground whitespace-pre-wrap">{query?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={query?.status}
                    onChange={handleStatusChange}
                    loading={isUpdating}
                  />

                  <Select
                    label="Priority"
                    options={priorityOptions}
                    value={query?.priority}
                    onChange={handlePriorityChange}
                    loading={isUpdating}
                  />

                  <Select
                    label="Assigned Agent"
                    options={agentOptions}
                    value={query?.assignedAgent}
                    onChange={handleAssignmentChange}
                    loading={isUpdating}
                  />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Created</label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-foreground">{formatDate(query?.createdAt)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Updated</label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-foreground">{formatDate(query?.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note with AI Suggestions */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">Add Note</label>
                  {isAiAvailable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateResponseSuggestions}
                      loading={isAiLoading}
                      iconName="Lightbulb"
                      iconPosition="left"
                    >
                      Get AI Suggestions
                    </Button>
                  )}
                </div>
                
                {/* AI Response Suggestions */}
                {showSuggestions && responseSuggestions?.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <h4 className="text-sm font-medium text-foreground">AI Response Suggestions:</h4>
                    {responseSuggestions?.map((suggestion, index) => (
                      <div key={index} className="bg-card border border-border rounded-md p-3">
                        <p className="text-sm text-foreground mb-2">{suggestion}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUseSuggestion(suggestion)}
                          iconName="Plus"
                          iconPosition="left"
                        >
                          Use This
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSuggestions(false)}
                    >
                      Hide Suggestions
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e?.target?.value)}
                    placeholder="Add a note to this query..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote?.trim()}
                    loading={isAddingNote}
                    iconName="Plus"
                    iconPosition="left"
                    size="sm"
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {query?.notes && query?.notes?.length > 0 ? (
                  query?.notes?.map((note) => (
                    <div key={note?.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Icon name="User" size={16} color="white" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{note?.author}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(note?.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {isAiAvailable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAnalyzeSentiment(note?.content)}
                              iconName="Brain"
                              className="h-8 w-8"
                              title="Analyze sentiment"
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNote(note)}
                            iconName="Edit"
                            className="h-8 w-8"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note?.id)}
                            iconName="Trash2"
                            className="h-8 w-8 text-error hover:text-error"
                          />
                        </div>
                      </div>
                      
                      {editingNote === note?.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editNoteContent}
                            onChange={(e) => setEditNoteContent(e?.target?.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                          />
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={handleSaveEdit}
                              size="sm"
                              iconName="Check"
                              iconPosition="left"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingNote(null);
                                setEditNoteContent('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-foreground whitespace-pre-wrap">{note?.content}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
                    <p className="text-muted-foreground">Add the first note to start tracking progress.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              {!isAiAvailable ? (
                <div className="text-center py-8">
                  <Icon name="AlertCircle" size={48} className="text-warning mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">AI Features Unavailable</h3>
                  <p className="text-muted-foreground mb-4">
                    Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                    iconName="ExternalLink"
                    iconPosition="left"
                  >
                    Get API Key
                  </Button>
                </div>
              ) : (
                <>
                  {aiSummary ? (
                    <div className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center">
                          <Icon name="Sparkles" size={20} className="text-primary mr-2" />
                          AI-Generated Summary
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateNotesSummary}
                          loading={isAiLoading}
                          iconName="RefreshCw"
                        >
                          Regenerate
                        </Button>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground whitespace-pre-wrap">{aiSummary}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Icon name="Sparkles" size={48} className="text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">AI Insights</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate AI-powered summaries and insights from query notes.
                      </p>
                      <Button
                        onClick={handleGenerateNotesSummary}
                        loading={isAiLoading}
                        disabled={!query?.notes || query?.notes?.length === 0}
                        iconName="Sparkles"
                        iconPosition="left"
                      >
                        Generate Summary
                      </Button>
                      {(!query?.notes || query?.notes?.length === 0) && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Add some notes first to generate insights.
                        </p>
                      )}
                    </div>
                  )}

                  {aiError && (
                    <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <Icon name="AlertTriangle" size={20} className="text-error mr-2" />
                        <p className="text-error font-medium">AI Error</p>
                      </div>
                      <p className="text-error/80 text-sm mt-1">{aiError}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Activity Timeline</h3>
                <p className="text-muted-foreground">Activity tracking will be available in a future update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryDetailsModal;