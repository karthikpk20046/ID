import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectTimelineChart = () => {
  const timelineData = [
    { month: 'Jan', active: 12, completed: 8, planned: 5 },
    { month: 'Feb', active: 15, completed: 10, planned: 7 },
    { month: 'Mar', active: 18, completed: 12, planned: 6 },
    { month: 'Apr', active: 22, completed: 15, planned: 8 },
    { month: 'May', active: 20, completed: 18, planned: 10 },
    { month: 'Jun', active: 25, completed: 20, planned: 12 },
    { month: 'Jul', active: 28, completed: 23, planned: 9 },
    { month: 'Aug', active: 24, completed: 25, planned: 11 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`${label} 2024`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry?.color }}>
              {`${entry?.dataKey?.charAt(0)?.toUpperCase() + entry?.dataKey?.slice(1)}: ${entry?.value} projects`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Project Timeline</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Planned</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-64" aria-label="Project Timeline Area Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stackId="1"
              stroke="var(--color-success)" 
              fill="var(--color-success)"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="active" 
              stackId="1"
              stroke="var(--color-primary)" 
              fill="var(--color-primary)"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="planned" 
              stackId="1"
              stroke="var(--color-accent)" 
              fill="var(--color-accent)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectTimelineChart;