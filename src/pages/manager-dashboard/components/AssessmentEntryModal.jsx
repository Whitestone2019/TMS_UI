import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AssessmentEntryModal = ({ 
  isOpen, 
  onClose, 
  trainee, 
  onSubmitAssessment 
}) => {
  const [assessmentData, setAssessmentData] = useState({
    traineeId: trainee?.id || '',
    assessmentType: '',
    marks: '',
    maxMarks: '100',
    remarks: '',
    assessmentDate: new Date()?.toISOString()?.split('T')?.[0]
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assessmentTypeOptions = [
    { value: 'weekly', label: 'Weekly Assessment' },
    { value: 'module', label: 'Module Assessment' },
    { value: 'practical', label: 'Practical Assessment' },
    { value: 'project', label: 'Project Assessment' }
  ];

  const handleInputChange = (field, value) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!assessmentData?.assessmentType) {
      newErrors.assessmentType = 'Assessment type is required';
    }
    
    if (!assessmentData?.marks) {
      newErrors.marks = 'Marks are required';
    } else if (isNaN(assessmentData?.marks) || assessmentData?.marks < 0) {
      newErrors.marks = 'Please enter valid marks';
    } else if (parseInt(assessmentData?.marks) > parseInt(assessmentData?.maxMarks)) {
      newErrors.marks = `Marks cannot exceed ${assessmentData?.maxMarks}`;
    }
    
    if (!assessmentData?.remarks?.trim()) {
      newErrors.remarks = 'Remarks are required';
    } else if (assessmentData?.remarks?.trim()?.length < 10) {
      newErrors.remarks = 'Remarks must be at least 10 characters';
    }
    
    if (!assessmentData?.assessmentDate) {
      newErrors.assessmentDate = 'Assessment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmitAssessment({
        ...assessmentData,
        marks: parseInt(assessmentData?.marks),
        maxMarks: parseInt(assessmentData?.maxMarks),
        percentage: Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)
      });
      
      // Reset form
      setAssessmentData({
        traineeId: trainee?.id || '',
        assessmentType: '',
        marks: '',
        maxMarks: '100',
        remarks: '',
        assessmentDate: new Date()?.toISOString()?.split('T')?.[0]
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg elevation-3 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Add Assessment</h2>
            {trainee && (
              <p className="text-sm text-muted-foreground mt-1">
                For {trainee?.name} - {trainee?.currentStep}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Trainee Info */}
          {trainee && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {trainee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{trainee?.name}</p>
                  <p className="text-sm text-muted-foreground">{trainee?.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Current Progress: {trainee?.completionPercentage}% - {trainee?.currentStep}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Assessment Type"
              required
              options={assessmentTypeOptions}
              value={assessmentData?.assessmentType}
              onChange={(value) => handleInputChange('assessmentType', value)}
              error={errors?.assessmentType}
            />

            <Input
              label="Assessment Date"
              type="date"
              required
              value={assessmentData?.assessmentDate}
              onChange={(e) => handleInputChange('assessmentDate', e?.target?.value)}
              error={errors?.assessmentDate}
            />

            <Input
              label="Marks Obtained"
              type="number"
              required
              min="0"
              max={assessmentData?.maxMarks}
              placeholder="Enter marks"
              value={assessmentData?.marks}
              onChange={(e) => handleInputChange('marks', e?.target?.value)}
              error={errors?.marks}
            />

            <Input
              label="Maximum Marks"
              type="number"
              required
              min="1"
              value={assessmentData?.maxMarks}
              onChange={(e) => handleInputChange('maxMarks', e?.target?.value)}
            />
          </div>

          {/* Percentage Display */}
          {assessmentData?.marks && assessmentData?.maxMarks && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Percentage:</span>
                <span className="text-lg font-bold text-primary">
                  {Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)}%
                </span>
              </div>
              <div className="mt-2 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Remarks <span className="text-error">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Enter detailed remarks about the trainee's performance..."
              value={assessmentData?.remarks}
              onChange={(e) => handleInputChange('remarks', e?.target?.value)}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors?.remarks ? 'border-error' : 'border-border'
              }`}
            />
            {errors?.remarks && (
              <p className="mt-1 text-sm text-error">{errors?.remarks}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {assessmentData?.remarks?.length}/500 characters (minimum 10 required)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              Save Assessment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentEntryModal;