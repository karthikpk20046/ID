import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ProjectForm = ({ project, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: '',
    status: 'planning',
    progress: 0,
    startDate: '',
    deadline: '',
    budget: '',
    team: [],
    milestones: [],
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '', completed: false });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project?.name || '',
        description: project?.description || '',
        client: project?.client || '',
        status: project?.status || 'planning',
        progress: project?.progress || 0,
        startDate: project?.startDate || '',
        deadline: project?.deadline || '',
        budget: project?.budget || '',
        team: project?.team || [],
        milestones: project?.milestones || [],
        tags: project?.tags || []
      });
    }
  }, [project]);

  const clientOptions = [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc' },
    { value: 'global-industries', label: 'Global Industries' },
    { value: 'innovate-systems', label: 'Innovate Systems' },
    { value: 'digital-dynamics', label: 'Digital Dynamics' }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const teamMemberOptions = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'david-brown', label: 'David Brown' },
    { value: 'lisa-garcia', label: 'Lisa Garcia' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addMilestone = () => {
    if (newMilestone?.title && newMilestone?.date) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev?.milestones, { ...newMilestone, id: Date.now() }]
      }));
      setNewMilestone({ title: '', date: '', completed: false });
    }
  };

  const removeMilestone = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev?.milestones?.filter(m => m?.id !== id)
    }));
  };

  const addTag = () => {
    if (newTag && !formData?.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev?.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev?.tags?.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData?.client) {
      newErrors.client = 'Client selection is required';
    }

    if (!formData?.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData?.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (formData?.startDate && formData?.deadline && new Date(formData.startDate) >= new Date(formData.deadline)) {
      newErrors.deadline = 'Deadline must be after start date';
    }

    if (formData?.progress < 0 || formData?.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel} iconName="X" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Project Name"
                type="text"
                placeholder="Enter project name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <Select
                label="Client"
                placeholder="Select client"
                options={clientOptions}
                value={formData?.client}
                onChange={(value) => handleInputChange('client', value)}
                error={errors?.client}
                required
                searchable
              />

              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Progress (%)"
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={formData?.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e?.target?.value) || 0)}
                error={errors?.progress}
              />

              <Input
                label="Start Date"
                type="date"
                value={formData?.startDate}
                onChange={(e) => handleInputChange('startDate', e?.target?.value)}
                error={errors?.startDate}
                required
              />

              <Input
                label="Deadline"
                type="date"
                value={formData?.deadline}
                onChange={(e) => handleInputChange('deadline', e?.target?.value)}
                error={errors?.deadline}
                required
              />

              <Input
                label="Budget"
                type="text"
                placeholder="$0.00"
                value={formData?.budget}
                onChange={(e) => handleInputChange('budget', e?.target?.value)}
              />

              <Select
                label="Team Members"
                placeholder="Select team members"
                options={teamMemberOptions}
                value={formData?.team}
                onChange={(value) => handleInputChange('team', value)}
                multiple
                searchable
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Project Milestones</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Milestone title"
                value={newMilestone?.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e?.target?.value }))}
              />
              <Input
                type="date"
                value={newMilestone?.date}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e?.target?.value }))}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addMilestone}
                iconName="Plus"
                iconPosition="left"
                disabled={!newMilestone?.title || !newMilestone?.date}
              >
                Add Milestone
              </Button>
            </div>

            <div className="space-y-2">
              {formData?.milestones?.map((milestone) => (
                <div key={milestone?.id} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={milestone?.completed}
                      onChange={(e) => {
                        const updatedMilestones = formData?.milestones?.map(m =>
                          m?.id === milestone?.id ? { ...m, completed: e?.target?.checked } : m
                        );
                        handleInputChange('milestones', updatedMilestones);
                      }}
                    />
                    <div>
                      <p className={`font-medium ${milestone?.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {milestone?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(milestone.date)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(milestone?.id)}
                    iconName="Trash2"
                    className="text-error hover:text-error"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Project Tags</h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e?.target?.value)}
                onKeyPress={(e) => {
                  if (e?.key === 'Enter') {
                    e?.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                iconName="Plus"
                disabled={!newTag}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {formData?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:bg-primary/20 rounded-full p-1"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
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
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;