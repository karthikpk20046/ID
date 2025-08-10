import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectStats = ({ projects }) => {
  const stats = {
    total: projects?.length,
    active: projects?.filter(p => p?.status === 'active')?.length,
    planning: projects?.filter(p => p?.status === 'planning')?.length,
    completed: projects?.filter(p => p?.status === 'completed')?.length,
    overdue: projects?.filter(p => {
      if (p?.status === 'completed') return false;
      return new Date(p.deadline) < new Date();
    })?.length
  };

  const avgProgress = projects?.length > 0 
    ? Math.round(projects?.reduce((sum, p) => sum + p?.progress, 0) / projects?.length)
    : 0;

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.total,
      icon: 'FolderOpen',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Projects',
      value: stats?.active,
      icon: 'Play',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'In Planning',
      value: stats?.planning,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Completed',
      value: stats?.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Overdue',
      value: stats?.overdue,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat?.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStats;