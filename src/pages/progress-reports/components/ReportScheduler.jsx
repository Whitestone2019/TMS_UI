import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

const ReportScheduler = ({ onScheduleReport, isScheduling }) => {
  const [scheduleConfig, setScheduleConfig] = useState({
    reportName: '',
    frequency: 'weekly',
    dayOfWeek: 'monday',
    dayOfMonth: '1',
    time: '09:00',
    recipients: [],
    reportType: 'detailed',
    includeCharts: true,
    includeRawData: false,
    isActive: true
  });

  const [recipientEmail, setRecipientEmail] = useState('');

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const dayOfWeekOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const reportTypeOptions = [
    { value: 'summary', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed Progress Report' },
    { value: 'assessment', label: 'Assessment Compilation' },
    { value: 'interview', label: 'Interview Status Report' }
  ];

  const existingSchedules = [
    {
      id: 1,
      name: "Weekly Progress Summary",
      frequency: "Weekly",
      nextRun: "2024-10-28 09:00",
      recipients: ["manager@company.com", "hr@company.com"],
      isActive: true
    },
    {
      id: 2,
      name: "Monthly Assessment Report",
      frequency: "Monthly",
      nextRun: "2024-11-01 10:00",
      recipients: ["director@company.com"],
      isActive: true
    },
    {
      id: 3,
      name: "Quarterly Review Report",
      frequency: "Quarterly",
      nextRun: "2024-12-01 14:00",
      recipients: ["ceo@company.com", "hr-director@company.com"],
      isActive: false
    }
  ];

  const handleConfigChange = (field, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRecipient = () => {
    if (recipientEmail && !scheduleConfig?.recipients?.includes(recipientEmail)) {
      setScheduleConfig(prev => ({
        ...prev,
        recipients: [...prev?.recipients, recipientEmail]
      }));
      setRecipientEmail('');
    }
  };

  const removeRecipient = (email) => {
    setScheduleConfig(prev => ({
      ...prev,
      recipients: prev?.recipients?.filter(r => r !== email)
    }));
  };

  const handleScheduleSubmit = () => {
    if (scheduleConfig?.reportName && scheduleConfig?.recipients?.length > 0) {
      onScheduleReport(scheduleConfig);
    }
  };

  const toggleScheduleStatus = (scheduleId) => {
    // Mock function to toggle schedule status
    console.log(`Toggling schedule ${scheduleId}`);
  };

  const deleteSchedule = (scheduleId) => {
    // Mock function to delete schedule
    console.log(`Deleting schedule ${scheduleId}`);
  };

  return (
    <div className="space-y-6">
      {/* Create New Schedule */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Schedule New Report</h3>
            <p className="text-sm text-muted-foreground">Automate report generation and delivery</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Configuration */}
          <div className="space-y-4">
            <Input
              label="Report Name"
              type="text"
              placeholder="e.g., Weekly Progress Summary"
              value={scheduleConfig?.reportName}
              onChange={(e) => handleConfigChange('reportName', e?.target?.value)}
              required
            />

            <Select
              label="Report Type"
              options={reportTypeOptions}
              value={scheduleConfig?.reportType}
              onChange={(value) => handleConfigChange('reportType', value)}
            />

            <Select
              label="Frequency"
              options={frequencyOptions}
              value={scheduleConfig?.frequency}
              onChange={(value) => handleConfigChange('frequency', value)}
            />

            {scheduleConfig?.frequency === 'weekly' && (
              <Select
                label="Day of Week"
                options={dayOfWeekOptions}
                value={scheduleConfig?.dayOfWeek}
                onChange={(value) => handleConfigChange('dayOfWeek', value)}
              />
            )}

            {scheduleConfig?.frequency === 'monthly' && (
              <Input
                label="Day of Month"
                type="number"
                min="1"
                max="28"
                value={scheduleConfig?.dayOfMonth}
                onChange={(e) => handleConfigChange('dayOfMonth', e?.target?.value)}
              />
            )}

            <Input
              label="Delivery Time"
              type="time"
              value={scheduleConfig?.time}
              onChange={(e) => handleConfigChange('time', e?.target?.value)}
            />
          </div>

          {/* Recipients and Options */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Recipients
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRecipient}
                  iconName="Plus"
                  iconSize={16}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {scheduleConfig?.recipients?.map((email, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                    <span className="text-sm text-foreground">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecipient(email)}
                      iconName="X"
                      iconSize={14}
                    >
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Report Options</label>
              <Checkbox
                label="Include Charts and Visualizations"
                checked={scheduleConfig?.includeCharts}
                onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
              />
              <Checkbox
                label="Include Raw Data Export"
                checked={scheduleConfig?.includeRawData}
                onChange={(e) => handleConfigChange('includeRawData', e?.target?.checked)}
              />
              <Checkbox
                label="Activate Schedule Immediately"
                checked={scheduleConfig?.isActive}
                onChange={(e) => handleConfigChange('isActive', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex justify-end">
          <Button
            variant="default"
            onClick={handleScheduleSubmit}
            loading={isScheduling}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
            disabled={!scheduleConfig?.reportName || scheduleConfig?.recipients?.length === 0}
          >
            Create Schedule
          </Button>
        </div>
      </div>
      {/* Existing Schedules */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Existing Schedules</h3>
            <p className="text-sm text-muted-foreground">Manage your automated report schedules</p>
          </div>
        </div>

        <div className="space-y-4">
          {existingSchedules?.map((schedule) => (
            <div key={schedule?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-foreground">{schedule?.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      schedule?.isActive 
                        ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                    }`}>
                      <Icon 
                        name={schedule?.isActive ? 'Play' : 'Pause'} 
                        size={10} 
                        className="mr-1" 
                      />
                      {schedule?.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="RefreshCw" size={14} />
                      <span>{schedule?.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Next: {schedule?.nextRun}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Mail" size={14} />
                      <span>{schedule?.recipients?.length} recipient{schedule?.recipients?.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleScheduleStatus(schedule?.id)}
                    iconName={schedule?.isActive ? 'Pause' : 'Play'}
                    iconSize={16}
                    title={schedule?.isActive ? 'Pause Schedule' : 'Resume Schedule'}
                  >
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSchedule(schedule?.id)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-error hover:text-error"
                    title="Delete Schedule"
                  >
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportScheduler;