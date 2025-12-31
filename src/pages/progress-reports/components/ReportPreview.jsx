import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportPreview = ({ reportData, filters, onExport, isExporting }) => {
  const [previewMode, setPreviewMode] = useState('table');

  const mockReportData = [
    {
      id: 1,
      trainee: "John Doe",
      department: "Engineering",
      progress: 85,
      completedSteps: 17,
      totalSteps: 20,
      lastAssessment: 88,
      interviewStatus: "Completed",
      startDate: "2024-01-15",
      expectedCompletion: "2024-03-15",
      currentStep: "Advanced React Patterns",
      managerRemarks: "Excellent progress, strong technical skills"
    },
    {
      id: 2,
      trainee: "Sarah Wilson",
      department: "Marketing",
      progress: 92,
      completedSteps: 18,
      totalSteps: 20,
      lastAssessment: 94,
      interviewStatus: "Scheduled",
      startDate: "2024-01-08",
      expectedCompletion: "2024-03-08",
      currentStep: "Digital Marketing Analytics",
      managerRemarks: "Outstanding performance, ahead of schedule"
    },
    {
      id: 3,
      trainee: "Mike Johnson",
      department: "Sales",
      progress: 78,
      completedSteps: 15,
      totalSteps: 20,
      lastAssessment: 82,
      interviewStatus: "Pending",
      startDate: "2024-01-22",
      expectedCompletion: "2024-03-22",
      currentStep: "Customer Relationship Management",
      managerRemarks: "Good progress, needs improvement in presentation skills"
    },
    {
      id: 4,
      trainee: "Emily Davis",
      department: "HR",
      progress: 95,
      completedSteps: 19,
      totalSteps: 20,
      lastAssessment: 96,
      interviewStatus: "Completed",
      startDate: "2024-01-10",
      expectedCompletion: "2024-03-10",
      currentStep: "Employment Law & Compliance",
      managerRemarks: "Exceptional performance, ready for advanced responsibilities"
    },
    {
      id: 5,
      trainee: "Alex Brown",
      department: "Finance",
      progress: 68,
      completedSteps: 13,
      totalSteps: 20,
      lastAssessment: 75,
      interviewStatus: "Scheduled",
      startDate: "2024-02-01",
      expectedCompletion: "2024-04-01",
      currentStep: "Financial Analysis & Reporting",
      managerRemarks: "Steady progress, requires additional support in complex calculations"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'Scheduled': { color: 'bg-warning text-warning-foreground', icon: 'Calendar' },
      'Pending': { color: 'bg-muted text-muted-foreground', icon: 'Clock' },
      'Cancelled': { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.['Pending'];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const getProgressBar = (progress) => {
    const getProgressColor = (value) => {
      if (value >= 90) return 'bg-success';
      if (value >= 70) return 'bg-warning';
      return 'bg-error';
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-foreground min-w-[3rem]">{progress}%</span>
      </div>
    );
  };

  const exportFormats = [
    { value: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { value: 'excel', label: 'Export as Excel', icon: 'FileSpreadsheet' },
    { value: 'csv', label: 'Export as CSV', icon: 'Download' }
  ];

  const summaryStats = {
    totalTrainees: mockReportData?.length,
    avgProgress: Math.round(mockReportData?.reduce((sum, item) => sum + item?.progress, 0) / mockReportData?.length),
    completedInterviews: mockReportData?.filter(item => item?.interviewStatus === 'Completed')?.length,
    avgAssessmentScore: Math.round(mockReportData?.reduce((sum, item) => sum + item?.lastAssessment, 0) / mockReportData?.length)
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Report Preview</h3>
              <p className="text-sm text-muted-foreground">
                {filters?.reportType === 'summary' ? 'Executive Summary' : 'Detailed Progress Report'} • Generated on {new Date()?.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('table')}
              iconName="Table"
              iconPosition="left"
              iconSize={16}
            >
              Table
            </Button>
            <Button
              variant={previewMode === 'summary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('summary')}
              iconName="BarChart3"
              iconPosition="left"
              iconSize={16}
            >
              Summary
            </Button>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      {previewMode === 'summary' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summaryStats?.totalTrainees}</p>
                  <p className="text-sm text-muted-foreground">Total Trainees</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summaryStats?.avgProgress}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Award" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summaryStats?.avgAssessmentScore}</p>
                  <p className="text-sm text-muted-foreground">Avg Assessment</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summaryStats?.completedInterviews}</p>
                  <p className="text-sm text-muted-foreground">Interviews Done</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Table View */}
      {previewMode === 'table' && (
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trainee</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Steps</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assessment</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Interview</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Current Step</th>
                </tr>
              </thead>
              <tbody>
                {mockReportData?.map((trainee) => (
                  <tr key={trainee?.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">{trainee?.trainee}</p>
                        <p className="text-sm text-muted-foreground">Started: {new Date(trainee.startDate)?.toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">{trainee?.department}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-32">
                        {getProgressBar(trainee?.progress)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">
                        {trainee?.completedSteps}/{trainee?.totalSteps}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="Award" size={16} className="text-warning" />
                        <span className="text-sm font-medium text-foreground">{trainee?.lastAssessment}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(trainee?.interviewStatus)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-foreground max-w-[200px] truncate" title={trainee?.currentStep}>
                        {trainee?.currentStep}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Export Controls */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={16} className="inline mr-2" />
            Report contains {mockReportData?.length} trainee records
          </div>
          <div className="flex items-center space-x-2">
            {exportFormats?.map((format) => (
              <Button
                key={format?.value}
                variant="outline"
                size="sm"
                onClick={() => onExport(format?.value)}
                loading={isExporting === format?.value}
                iconName={format?.icon}
                iconPosition="left"
                iconSize={16}
              >
                {format?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;