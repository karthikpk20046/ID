import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProjectTable = ({ 
  projects, 
  selectedProjects, 
  onSelectProject, 
  onSelectAll, 
  onEditProject, 
  onDeleteProject, 
  onViewTimeline, 
  onGenerateReport,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'planning': return 'bg-warning/10 text-warning border-warning/20';
      case 'on-hold': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 40) return 'bg-warning';
    return 'bg-error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isOverdue = (deadline, status) => {
    if (status === 'completed') return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox
                  checked={selectedProjects?.length === projects?.length && projects?.length > 0}
                  onChange={onSelectAll}
                  indeterminate={selectedProjects?.length > 0 && selectedProjects?.length < projects?.length}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Project Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('client')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Client</span>
                  <Icon name={getSortIcon('client')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('progress')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Progress</span>
                  <Icon name={getSortIcon('progress')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('startDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Start Date</span>
                  <Icon name={getSortIcon('startDate')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('deadline')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Deadline</span>
                  <Icon name={getSortIcon('deadline')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr
                key={project?.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  selectedProjects?.includes(project?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(project?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedProjects?.includes(project?.id)}
                    onChange={() => onSelectProject(project?.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FolderOpen" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{project?.name}</p>
                      <p className="text-sm text-muted-foreground">{project?.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Icon name="Building" size={12} className="text-secondary" />
                    </div>
                    <span className="text-sm text-foreground">{project?.client}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project?.status)}`}>
                    {project?.status?.charAt(0)?.toUpperCase() + project?.status?.slice(1)?.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project?.progress)}`}
                        style={{ width: `${project?.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-12 text-right">
                      {project?.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{formatDate(project?.startDate)}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${isOverdue(project?.deadline, project?.status) ? 'text-error font-medium' : 'text-foreground'}`}>
                      {formatDate(project?.deadline)}
                    </span>
                    {isOverdue(project?.deadline, project?.status) && (
                      <Icon name="AlertTriangle" size={14} className="text-error" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex -space-x-2">
                    {project?.team?.slice(0, 3)?.map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-primary rounded-full border-2 border-card flex items-center justify-center text-xs font-medium text-primary-foreground"
                        title={member?.name}
                      >
                        {member?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </div>
                    ))}
                    {project?.team?.length > 3 && (
                      <div className="w-8 h-8 bg-muted rounded-full border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                        +{project?.team?.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProject(project)}
                      iconName="Edit"
                      className="h-8 w-8 p-0"
                      title="Edit Project"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTimeline(project)}
                      iconName="Calendar"
                      className="h-8 w-8 p-0"
                      title="View Timeline"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGenerateReport(project)}
                      iconName="FileText"
                      className="h-8 w-8 p-0"
                      title="Generate Report"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProject(project)}
                      iconName="Trash2"
                      className="h-8 w-8 p-0 text-error hover:text-error"
                      title="Delete Project"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {projects?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FolderOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Projects Found</h3>
          <p className="text-muted-foreground mb-4">
            No projects match your current filters. Try adjusting your search criteria.
          </p>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Create New Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;