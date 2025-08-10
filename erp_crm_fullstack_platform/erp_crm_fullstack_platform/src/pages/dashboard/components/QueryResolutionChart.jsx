import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QueryResolutionChart = () => {
  const resolutionData = [
    { week: 'Week 1', resolved: 85, pending: 15, avgTime: 2.3 },
    { week: 'Week 2', resolved: 92, pending: 8, avgTime: 1.8 },
    { week: 'Week 3', resolved: 78, pending: 22, avgTime: 3.1 },
    { week: 'Week 4', resolved: 95, pending: 5, avgTime: 1.5 },
    { week: 'Week 5', resolved: 88, pending: 12, avgTime: 2.0 },
    { week: 'Week 6', resolved: 91, pending: 9, avgTime: 1.9 },
    { week: 'Week 7', resolved: 87, pending: 13, avgTime: 2.2 },
    { week: 'Week 8', resolved: 94, pending: 6, avgTime: 1.6 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry?.color }}>
              {entry?.dataKey === 'avgTime' 
                ? `Avg Resolution: ${entry?.value} days`
                : `${entry?.dataKey === 'resolved' ? 'Resolved' : 'Pending'}: ${entry?.value}%`
              }
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
        <h3 className="text-lg font-semibold text-foreground">Query Resolution Trends</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Resolved %</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Pending %</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-64" aria-label="Query Resolution Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={resolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="week" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="var(--color-success)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="pending" 
              stroke="var(--color-warning)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-warning)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QueryResolutionChart;