import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EmailNotificationPreview = ({ 
  interviewDetails, 
  trainees, 
  interviewer,
  onSendNotifications,
  onUpdateTemplate,
  className = '' 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [previewRecipient, setPreviewRecipient] = useState('trainee');

  const emailTemplates = {
    default: {
      subject: 'Interview Scheduled - {interviewType}',
      traineeBody: `Dear {traineeName},

Your interview has been scheduled for {date} at {time}.

Interview Details:
- Type: {interviewType}
- Duration: {duration} minutes
- Interviewer: {interviewerName}
- Location: {location}
- Meeting Link: {meetingLink}

Please prepare accordingly and join on time.

Best regards,
Training Team`,
      interviewerBody: `Dear {interviewerName},

You have been assigned to conduct an interview on {date} at {time}.

Interview Details:
- Trainee(s): {traineeNames}
- Type: {interviewType}
- Duration: {duration} minutes
- Location: {location}
- Meeting Link: {meetingLink}

Notes: {notes}

Best regards,
Training Team`
    },
    technical: {
      subject: 'Technical Interview Scheduled - {date}',
      traineeBody: `Dear {traineeName},

Your technical interview has been scheduled for {date} at {time}.

Interview Details:
- Type: Technical Assessment
- Duration: {duration} minutes
- Interviewer: {interviewerName}
- Location: {location}
- Meeting Link: {meetingLink}

Preparation Guidelines:
- Review your recent projects and code samples
- Prepare to discuss technical challenges you've faced
- Bring any questions about the role or technology stack

Best regards,
Training Team`,
      interviewerBody: `Dear {interviewerName},

You have been assigned to conduct a technical interview on {date} at {time}.

Trainee Details:
- Name(s): {traineeNames}
- Current Progress: {progressDetails}
- Duration: {duration} minutes
- Location: {location}
- Meeting Link: {meetingLink}

Focus Areas: Technical skills assessment, problem-solving approach, code quality

Notes: {notes}

Best regards,
Training Team`
    },
    behavioral: {
      subject: 'Behavioral Interview Scheduled - {date}',
      traineeBody: `Dear {traineeName},

Your behavioral interview has been scheduled for {date} at {time}.

Interview Details:
- Type: Behavioral Assessment
- Duration: {duration} minutes
- Interviewer: {interviewerName}
- Location: {location}
- Meeting Link: {meetingLink}

Preparation Tips:
- Think of specific examples from your experience
- Prepare STAR (Situation, Task, Action, Result) format responses
- Review company values and culture

Best regards,
Training Team`,
      interviewerBody: `Dear {interviewerName},

You have been assigned to conduct a behavioral interview on {date} at {time}.

Trainee Details:
- Name(s): {traineeNames}
- Current Progress: {progressDetails}
- Duration: {duration} minutes
- Location: {location}
- Meeting Link: {meetingLink}

Focus Areas: Communication skills, teamwork, problem-solving approach, cultural fit

Notes: {notes}

Best regards,
Training Team`
    }
  };

  const templateOptions = [
    { value: 'default', label: 'Default Template' },
    { value: 'technical', label: 'Technical Interview' },
    { value: 'behavioral', label: 'Behavioral Interview' }
  ];

  const recipientOptions = [
    { value: 'trainee', label: 'Trainee View' },
    { value: 'interviewer', label: 'Interviewer View' }
  ];

  const replaceTemplateVariables = (template, recipient) => {
    if (!interviewDetails || !interviewer) return template;

    const variables = {
      '{traineeName}': trainees && trainees?.length > 0 ? trainees?.[0]?.name : 'John Doe',
      '{traineeNames}': trainees ? trainees?.map(t => t?.name)?.join(', ') : 'John Doe',
      '{interviewerName}': interviewer?.name || 'Dr. Smith',
      '{date}': interviewDetails?.date ? interviewDetails?.date?.toLocaleDateString() : 'October 25, 2024',
      '{time}': interviewDetails?.time || '10:00 AM',
      '{interviewType}': interviewDetails?.interviewType || 'Technical Interview',
      '{duration}': interviewDetails?.duration || '60',
      '{location}': interviewDetails?.location || 'Conference Room A',
      '{meetingLink}': interviewDetails?.meetingLink || 'https://meet.google.com/abc-defg-hij',
      '{notes}': interviewDetails?.notes || 'No additional notes',
      '{progressDetails}': trainees ? trainees?.map(t => `${t?.name}: ${t?.progressPercentage}%`)?.join(', ') : 'Progress: 75%'
    };

    let result = template;
    Object.entries(variables)?.forEach(([key, value]) => {
      result = result?.replace(new RegExp(key, 'g'), value);
    });

    return result;
  };

  const getCurrentTemplate = () => {
    return emailTemplates?.[selectedTemplate] || emailTemplates?.default;
  };

  const getPreviewContent = () => {
    const template = getCurrentTemplate();
    const bodyKey = previewRecipient === 'trainee' ? 'traineeBody' : 'interviewerBody';
    
    return {
      subject: replaceTemplateVariables(template?.subject, previewRecipient),
      body: replaceTemplateVariables(template?.[bodyKey], previewRecipient)
    };
  };

  const handleSendNotifications = () => {
    const template = getCurrentTemplate();
    onSendNotifications({
      template: selectedTemplate,
      subject: template?.subject,
      traineeBody: template?.traineeBody,
      interviewerBody: template?.interviewerBody
    });
  };

  const previewContent = getPreviewContent();

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Email Notification Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconSize={16}
              onClick={() => onUpdateTemplate(selectedTemplate)}
            >
              Edit Template
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Send"
              iconSize={16}
              onClick={handleSendNotifications}
            >
              Send Notifications
            </Button>
          </div>
        </div>

        {/* Template and Recipient Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Email Template"
            options={templateOptions}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
          />
          
          <Select
            label="Preview As"
            options={recipientOptions}
            value={previewRecipient}
            onChange={setPreviewRecipient}
          />
        </div>
      </div>
      {/* Email Preview */}
      <div className="p-6">
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          {/* Email Header */}
          <div className="bg-muted px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Mail" size={16} className="text-muted-foreground" />
              <span className="font-medium text-foreground">Subject:</span>
              <span className="text-foreground">{previewContent?.subject}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6">
            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {previewContent?.body}
            </div>
          </div>

          {/* Email Footer */}
          <div className="bg-muted px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>This is an automated message from the Training Management System</span>
              <span>Sent: {new Date()?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recipients Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-3">Notification Recipients</h4>
          
          <div className="space-y-3">
            {/* Trainees */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Trainees ({trainees?.length || 0})</p>
              <div className="flex flex-wrap gap-2">
                {trainees && trainees?.length > 0 ? (
                  trainees?.map(trainee => (
                    <div key={trainee?.id} className="flex items-center space-x-2 px-3 py-1 bg-background rounded border border-border">
                      <Icon name="User" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-foreground">{trainee?.name}</span>
                      <span className="text-xs text-muted-foreground">({trainee?.email})</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No trainees selected</span>
                )}
              </div>
            </div>

            {/* Interviewer */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Interviewer</p>
              <div className="flex items-center space-x-2 px-3 py-1 bg-background rounded border border-border w-fit">
                <Icon name="UserCheck" size={12} className="text-muted-foreground" />
                <span className="text-xs text-foreground">{interviewer?.name || 'Not selected'}</span>
                {interviewer?.email && (
                  <span className="text-xs text-muted-foreground">({interviewer?.email})</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Send Options */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-1">Notification Settings</p>
              <ul className="text-xs text-primary/80 space-y-1">
                <li>• Notifications will be sent immediately after scheduling</li>
                <li>• Reminder emails will be sent 24 hours before the interview</li>
                <li>• Recipients can respond to confirm or request changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotificationPreview;