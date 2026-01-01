import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'syllabus',
      title: 'View Syllabus',
      description: 'Access complete syllabus content',
      icon: 'BookOpen',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      action: () => navigate('/syllabus-content-viewer')
    },
    // {
    //   id: 'progress',
    //   title: 'Progress Reports',
    //   description: 'View detailed progress analytics',
    //   icon: 'TrendingUp',
    //   color: 'bg-success',
    //   textColor: 'text-success-foreground',
    //   action: () => navigate('/progress-reports')
    // },
    {
      id: 'help',
      title: 'Get Help',
      description: 'Contact support or ask questions',
      icon: 'HelpCircle',
      color: 'bg-warning',
      textColor: 'text-warning-foreground',
      action: () => console.log('Opening help center')
    },
    {
      id: 'resources',
      title: 'Learning Resources',
      description: 'Additional study materials',
      icon: 'FileText',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      action: () => console.log('Opening resources')
    }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="Zap" size={24} className="mr-3 text-primary" />
          Quick Actions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Frequently used features and tools
        </p>
      </div>
      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className="group cursor-pointer"
            onClick={action?.action}
          >
            <div className="bg-muted/30 rounded-lg p-4 border border-border transition-all duration-200 hover:shadow-sm hover:border-primary/50 group-hover:bg-primary/5">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action?.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon
                    name={action?.icon}
                    size={24}
                    className={action?.textColor}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {action?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action?.description}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span>Click to access</span>
                      <Icon name="ArrowRight" size={12} className="ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Additional Actions */}
      {/* <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
            onClick={() => console.log('Downloading progress report')}
          >
            Download Progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Share"
            iconPosition="left"
            iconSize={14}
            onClick={() => console.log('Sharing progress')}
          >
            Share Progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            iconSize={14}
            onClick={() => console.log('Opening settings')}
          >
            Settings
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default QuickActions;