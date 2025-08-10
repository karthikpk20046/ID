import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GanttChart = ({ projects, onClose }) => {
  const [viewMode, setViewMode] = useState('months');
  const [selectedProject, setSelectedProject] = useState(null);

  const viewModes = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' }
  ];

  const getTimelineData = () => {
    const today = new Date();
    const startDate = new Date(Math.min(...projects.map(p => new Date(p.startDate))));
    const endDate = new Date(Math.max(...projects.map(p => new Date(p.deadline))));
    
    // Extend timeline by 1 month on each side
    startDate?.setMonth(startDate?.getMonth() - 1);
    endDate?.setMonth(endDate?.getMonth() + 1);

    const timeUnits = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      if (viewMode === 'months') {
        timeUnits?.push({
          label: current?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          date: new Date(current),
          key: `${current?.getFullYear()}-${current?.getMonth()}`
        });
        current?.setMonth(current?.getMonth() + 1);
      } else if (viewMode === 'weeks') {
        timeUnits?.push({
          label: `Week ${Math.ceil((current?.getDate()) / 7)}`,
          date: new Date(current),
          key: current?.toISOString()?.split('T')?.[0]
        });
        current?.setDate(current?.getDate() + 7);
      } else {
        timeUnits?.push({
          label: current?.getDate()?.toString(),
          date: new Date(current),
          key: current?.toISOString()?.split('T')?.[0]
        });
        current?.setDate(current?.getDate() + 1);
      }
    }

    return { timeUnits, startDate, endDate };
  };

  const calculateBarPosition = (projectStart, projectEnd, timelineStart, timelineEnd) => {
    const totalDuration = timelineEnd - timelineStart;
    const projectStartOffset = new Date(projectStart) - timelineStart;
    const projectDuration = new Date(projectEnd) - new Date(projectStart);

    const left = (projectStartOffset / totalDuration) * 100;
    const width = (projectDuration / totalDuration) * 100;

    return { left: Math.max(0, left), width: Math.max(1, width) };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'planning': return 'bg-warning';
      case 'on-hold': return 'bg-secondary';
      case 'completed': return 'bg-primary';
      case 'cancelled': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const isOverdue = (deadline, status) => {
    if (status === 'completed') return false;
    return new Date(deadline) < new Date();
  };

  const { timeUnits, startDate, endDate } = getTimelineData();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-foreground">Project Timeline</h2>
            <div className="flex items-center space-x-2">
              {viewModes?.map((mode) => (
                <Button
                  key={mode?.value}
                  variant={viewMode === mode?.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode(mode?.value)}
                >
                  {mode?.label}
                </Button>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
        </div>

        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <div className="min-w-[800px]">
            {/* Timeline Header */}
            <div className="sticky top-0 bg-muted/50 border-b border-border">
              <div className="flex">
                <div className="w-64 p-4 border-r border-border">
                  <span className="font-medium text-foreground">Project</span>
                </div>
                <div className="flex-1 flex">
                  {timeUnits?.map((unit) => (
                    <div
                      key={unit?.key}
                      className="flex-1 p-2 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
                      style={{ minWidth: '60px' }}
                    >
                      {unit?.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Rows */}
            <div className="divide-y divide-border">
              {projects?.map((project) => {
                const barPosition = calculateBarPosition(
                  project?.startDate,
                  project?.deadline,
                  startDate,
                  endDate
                );

                return (
                  <div
                    key={project?.id}
                    className={`flex hover:bg-muted/30 transition-colors ${
                      selectedProject?.id === project?.id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="w-64 p-4 border-r border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="FolderOpen" size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{project?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{project?.client}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 relative p-4">
                      <div className="relative h-8">
                        {/* Project Bar */}
                        <div
                          className={`absolute top-1 h-6 rounded-md ${getStatusColor(project?.status)} ${
                            isOverdue(project?.deadline, project?.status) ? 'ring-2 ring-error' : ''
                          }`}
                          style={{
                            left: `${barPosition?.left}%`,
                            width: `${barPosition?.width}%`
                          }}
                        >
                          <div className="flex items-center justify-between h-full px-2">
                            <span className="text-xs font-medium text-white truncate">
                              {project?.progress}%
                            </span>
                            {isOverdue(project?.deadline, project?.status) && (
                              <Icon name="AlertTriangle" size={12} className="text-white" />
                            )}
                          </div>
                        </div>

                        {/* Progress Indicator */}
                        <div
                          className="absolute top-1 h-6 bg-white/30 rounded-md"
                          style={{
                            left: `${barPosition?.left}%`,
                            width: `${(barPosition?.width * project?.progress) / 100}%`
                          }}
                        />

                        {/* Today Indicator */}
                        {(() => {
                          const todayPosition = calculateBarPosition(
                            new Date()?.toISOString()?.split('T')?.[0],
                            new Date()?.toISOString()?.split('T')?.[0],
                            startDate,
                            endDate
                          );
                          return (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-error z-10"
                              style={{ left: `${todayPosition?.left}%` }}
                            />
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Details Panel */}
        {selectedProject && (
          <div className="border-t border-border p-6 bg-muted/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedProject?.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Client:</span>
                    <p className="font-medium text-foreground">{selectedProject?.client}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium text-foreground capitalize">
                      {selectedProject?.status?.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Progress:</span>
                    <p className="font-medium text-foreground">{selectedProject?.progress}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium text-foreground">
                      {Math.ceil(
                        (new Date(selectedProject.deadline) - new Date(selectedProject.startDate)) /
                        (1000 * 60 * 60 * 24)
                      )} days
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProject(null)}
                iconName="X"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;