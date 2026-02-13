import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReportFilters = ({ onFiltersChange, onGenerateReport, isGenerating }) => {
  const [filters, setFilters] = useState({
    trainees: [],
    departments: [],
    dateRange: {
      startDate: '',
      endDate: ''
    },
    progressStatus: '',
    assessmentScoreRange: {
      min: '',
      max: ''
    },
    reportType: 'detailed'
  });

  const traineeOptions = [
    { value: 'all', label: 'All Trainees' },
    { value: 'john_doe', label: 'John Doe' },
    { value: 'sarah_wilson', label: 'Sarah Wilson' },
    { value: 'mike_johnson', label: 'Mike Johnson' },
    { value: 'emily_davis', label: 'Emily Davis' },
    { value: 'alex_brown', label: 'Alex Brown' },
    { value: 'lisa_garcia', label: 'Lisa Garcia' },
    { value: 'david_miller', label: 'David Miller' },
    { value: 'jessica_taylor', label: 'Jessica Taylor' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const progressStatusOptions = [
    { value: '', label: 'All Progress Levels' },
    { value: 'not_started', label: 'Not Started (0%)' },
    { value: 'in_progress', label: 'In Progress (1-99%)' },
    { value: 'completed', label: 'Completed (100%)' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const reportTypeOptions = [
    { value: 'summary', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed Progress Report' },
    { value: 'assessment', label: 'Assessment Compilation' },
    { value: 'interview', label: 'Interview Status Report' },
    { value: 'comparative', label: 'Comparative Analysis' }
  ];

  const handleFilterChange = (field, value) => {
    const updatedFilters = {
      ...filters,
      [field]: value
    };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (field, value) => {
    const updatedDateRange = {
      ...filters?.dateRange,
      [field]: value
    };
    const updatedFilters = {
      ...filters,
      dateRange: updatedDateRange
    };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleScoreRangeChange = (field, value) => {
    const updatedScoreRange = {
      ...filters?.assessmentScoreRange,
      [field]: value
    };
    const updatedFilters = {
      ...filters,
      assessmentScoreRange: updatedScoreRange
    };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      trainees: [],
      departments: [],
      dateRange: {
        startDate: '',
        endDate: ''
      },
      progressStatus: '',
      assessmentScoreRange: {
        min: '',
        max: ''
      },
      reportType: 'detailed'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Filter" size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Report Filters</h3>
            <p className="text-sm text-muted-foreground">Customize your progress report parameters</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trainee Selection */}
        <div className="space-y-4">
          <Select
            label="Select Trainees"
            description="Choose specific trainees or all"
            options={traineeOptions}
            value={filters?.trainees}
            onChange={(value) => handleFilterChange('trainees', value)}
            multiple
            searchable
            clearable
            placeholder="Select trainees..."
          />

          <Select
            label="Department Filter"
            description="Filter by department"
            options={departmentOptions}
            value={filters?.departments}
            onChange={(value) => handleFilterChange('departments', value)}
            multiple
            placeholder="Select departments..."
          />
        </div>

        {/* Date Range */}
        <div className="space-y-4">
          <Input
            label="Start Date"
            type="date"
            value={filters?.dateRange?.startDate}
            onChange={(e) => handleDateRangeChange('startDate', e?.target?.value)}
            description="Report period start"
          />

          <Input
            label="End Date"
            type="date"
            value={filters?.dateRange?.endDate}
            onChange={(e) => handleDateRangeChange('endDate', e?.target?.value)}
            description="Report period end"
          />
        </div>

        {/* Progress & Assessment Filters */}
        <div className="space-y-4">
          <Select
            label="Progress Status"
            description="Filter by completion status"
            options={progressStatusOptions}
            value={filters?.progressStatus}
            onChange={(value) => handleFilterChange('progressStatus', value)}
            placeholder="All progress levels"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Score"
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={filters?.assessmentScoreRange?.min}
              onChange={(e) => handleScoreRangeChange('min', e?.target?.value)}
              description="Minimum assessment score"
            />
            <Input
              label="Max Score"
              type="number"
              placeholder="100"
              min="0"
              max="100"
              value={filters?.assessmentScoreRange?.max}
              onChange={(e) => handleScoreRangeChange('max', e?.target?.value)}
              description="Maximum assessment score"
            />
          </div>
        </div>
      </div>
      {/* Report Type Selection */}
      <div className="mt-6 pt-6 border-t border-border">
        <Select
          label="Report Type"
          description="Choose the type of report to generate"
          options={reportTypeOptions}
          value={filters?.reportType}
          onChange={(value) => handleFilterChange('reportType', value)}
          className="max-w-md"
        />
      </div>
      {/* Generate Report Button */}
      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <Icon name="Info" size={16} className="inline mr-2" />
          Reports will be generated based on current filter selections
        </div>
        <Button
          variant="default"
          onClick={() => onGenerateReport(filters)}
          loading={isGenerating}
          iconName="FileText"
          iconPosition="left"
          iconSize={16}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;