import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressAnalytics = ({ analyticsData }) => {
  const completionTrendData = [
    { month: 'Jan', completed: 12, inProgress: 8, notStarted: 5 },
    { month: 'Feb', completed: 18, inProgress: 12, notStarted: 3 },
    { month: 'Mar', completed: 25, inProgress: 15, notStarted: 2 },
    { month: 'Apr', completed: 32, inProgress: 18, notStarted: 1 },
    { month: 'May', completed: 38, inProgress: 20, notStarted: 1 },
    { month: 'Jun', completed: 45, inProgress: 22, notStarted: 0 }
  ];

  const assessmentScoreData = [
    { range: '90-100', count: 15, percentage: 25 },
    { range: '80-89', count: 22, percentage: 37 },
    { range: '70-79', count: 18, percentage: 30 },
    { range: '60-69', count: 4, percentage: 7 },
    { range: 'Below 60', count: 1, percentage: 1 }
  ];

  const departmentProgressData = [
    { department: 'Engineering', avgCompletion: 85, totalTrainees: 25 },
    { department: 'Marketing', avgCompletion: 78, totalTrainees: 18 },
    { department: 'Sales', avgCompletion: 92, totalTrainees: 22 },
    { department: 'HR', avgCompletion: 88, totalTrainees: 12 },
    { department: 'Finance', avgCompletion: 75, totalTrainees: 15 },
    { department: 'Operations', avgCompletion: 82, totalTrainees: 20 }
  ];

  const interviewStatusData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'Scheduled', value: 25, color: '#3B82F6' },
    { name: 'Pending', value: 20, color: '#F59E0B' },
    { name: 'Cancelled', value: 10, color: '#EF4444' }
  ];

  const keyMetrics = [
    {
      title: 'Average Completion Time',
      value: '6.2 weeks',
      change: '-0.8 weeks',
      trend: 'down',
      icon: 'Clock',
      color: 'text-success'
    },
    {
      title: 'Overall Progress Rate',
      value: '87.5%',
      change: '+5.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      title: 'Average Assessment Score',
      value: '84.3',
      change: '+2.1',
      trend: 'up',
      icon: 'Award',
      color: 'text-success'
    },
    {
      title: 'Interview Completion Rate',
      value: '92.1%',
      change: '+1.8%',
      trend: 'up',
      icon: 'Users',
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics?.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 elevation-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metric?.color === 'text-success' ? 'bg-success/10' : 'bg-primary/10'
              }`}>
                <Icon 
                  name={metric?.icon} 
                  size={20} 
                  className={metric?.color === 'text-success' ? 'text-success' : 'text-primary'} 
                />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${metric?.color}`}>
                <Icon 
                  name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                />
                <span>{metric?.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{metric?.value}</h3>
              <p className="text-sm text-muted-foreground">{metric?.title}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trends */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Completion Trends</h3>
              <p className="text-sm text-muted-foreground">Monthly progress tracking</p>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="inProgress" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="notStarted" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assessment Score Distribution */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Assessment Scores</h3>
              <p className="text-sm text-muted-foreground">Score distribution analysis</p>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="range" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Progress */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Department Progress</h3>
              <p className="text-sm text-muted-foreground">Average completion by department</p>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentProgressData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={12} />
                <YAxis dataKey="department" type="category" stroke="#6B7280" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="avgCompletion" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interview Status */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Interview Status</h3>
              <p className="text-sm text-muted-foreground">Current interview distribution</p>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interviewStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {interviewStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;