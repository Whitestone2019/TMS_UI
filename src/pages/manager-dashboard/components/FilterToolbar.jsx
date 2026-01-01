import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterToolbar = ({
  filters,
  onFilterChange,
  onExportReports,
  onScheduleInterview,
  onAddAssessment,
  resultsCount
}) => {
  // const syllabusStepOptions = [
  //   { value: 'all', label: 'All Steps' },
  //   { value: 'step1', label: 'Step 1: Introduction' },
  //   { value: 'step2', label: 'Step 2: Fundamentals' },
  //   { value: 'step3', label: 'Step 3: Intermediate' },
  //   { value: 'step4', label: 'Step 4: Advanced' },
  //   { value: 'step5', label: 'Step 5: Final Project' }
  // ];

  const completionStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Search and Filters */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Search Trainee"
            type="search"
            placeholder="Enter trainee name..."
            value={filters?.searchName}
            onChange={(e) => handleInputChange('searchName', e?.target?.value)}
          />

          {/* <Select
            label="Syllabus Step"
            options={syllabusStepOptions}
            value={filters?.syllabusStep}
            onChange={(value) => handleInputChange('syllabusStep', value)}
          />
           */}
          <Select
            label="Completion Status"
            options={completionStatusOptions}
            value={filters?.completionStatus}
            onChange={(value) => handleInputChange('completionStatus', value)}
          />

          <div className="space-y-2">
            <Input
              label="Date Range"
              type="date"
              value={filters?.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e?.target?.value)}
            />
            <Input
              type="date"
              value={filters?.dateTo}
              onChange={(e) => handleInputChange('dateTo', e?.target?.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-1 lg:ml-6">
          <Button
            variant="outline"
            onClick={onExportReports}
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Export Reports
          </Button>

          <Button
            variant="outline"
            onClick={onScheduleInterview}
            iconName="Calendar"
            iconPosition="left"
            size="sm"
          >
            Schedule Interview
          </Button>

          <Button
            variant="default"
            onClick={onAddAssessment}
            iconName="Plus"
            iconPosition="left"
            size="sm"
          >
            Add Assessment
          </Button>
        </div>
      </div>
      {/* Results Count */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{resultsCount}</span> trainees
        </p>
      </div>
    </div>
  );
};

export default FilterToolbar;