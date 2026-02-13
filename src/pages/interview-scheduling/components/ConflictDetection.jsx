import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConflictDetection = ({ 
  conflicts, 
  onResolveConflict, 
  onViewAlternatives,
  className = '' 
}) => {
  if (!conflicts || conflicts?.length === 0) {
    return null;
  }

  const getConflictTypeIcon = (type) => {
    const iconMap = {
      'interviewer-busy': 'UserX',
      'room-booked': 'MapPin',
      'trainee-unavailable': 'Clock',
      'holiday': 'Calendar',
      'maintenance': 'Settings'
    };
    return iconMap?.[type] || 'AlertTriangle';
  };

  const getConflictSeverity = (severity) => {
    const severityConfig = {
      high: { color: 'text-error', bgColor: 'bg-error/10', borderColor: 'border-error/20' },
      medium: { color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/20' },
      low: { color: 'text-accent', bgColor: 'bg-accent/10', borderColor: 'border-accent/20' }
    };
    return severityConfig?.[severity] || severityConfig?.medium;
  };

  const formatConflictTime = (date, time) => {
    const conflictDate = new Date(date);
    return `${conflictDate?.toLocaleDateString()} at ${time}`;
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Scheduling Conflicts</h3>
          <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
            {conflicts?.length} conflict{conflicts?.length > 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Review and resolve conflicts before scheduling interviews
        </p>
      </div>
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {conflicts?.map((conflict, index) => {
          const severity = getConflictSeverity(conflict?.severity);
          
          return (
            <div key={index} className={`p-4 ${severity?.bgColor} border-l-4 ${severity?.borderColor}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getConflictTypeIcon(conflict?.type)} 
                    size={20} 
                    className={severity?.color} 
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {conflict?.title}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severity?.bgColor} ${severity?.color}`}>
                        {conflict?.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatConflictTime(conflict?.date, conflict?.time)}
                    </p>
                    
                    <p className="text-sm text-foreground mb-3">
                      {conflict?.description}
                    </p>

                    {/* Affected Resources */}
                    {conflict?.affectedResources && conflict?.affectedResources?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Affected:</p>
                        <div className="flex flex-wrap gap-1">
                          {conflict?.affectedResources?.map((resource, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Alternatives */}
                    {conflict?.alternatives && conflict?.alternatives?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Suggested alternatives:</p>
                        <div className="space-y-1">
                          {conflict?.alternatives?.slice(0, 2)?.map((alt, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border">
                              <span className="text-xs text-foreground">
                                {formatConflictTime(alt?.date, alt?.time)}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onResolveConflict(conflict?.id, alt)}
                                className="h-6 px-2 text-xs"
                              >
                                Use This
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAlternatives(conflict)}
                    iconName="Search"
                    iconSize={14}
                    className="h-8 px-3"
                  >
                    Find Alternatives
                  </Button>
                  
                  {conflict?.canOverride && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResolveConflict(conflict?.id, { override: true })}
                      iconName="AlertTriangle"
                      iconSize={14}
                      className="h-8 px-3 text-warning border-warning hover:bg-warning/10"
                    >
                      Override
                    </Button>
                  )}
                </div>
              </div>
              {/* Resolution Status */}
              {conflict?.status === 'resolving' && (
                <div className="mt-3 p-2 bg-accent/10 rounded border border-accent/20">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-accent" />
                    <span className="text-xs text-accent font-medium">Resolving conflict...</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Bulk Actions */}
      {conflicts?.length > 1 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {conflicts?.filter(c => c?.severity === 'high')?.length} high priority conflicts
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewAlternatives('all')}
                iconName="Search"
                iconSize={14}
              >
                Find All Alternatives
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolveConflict('all', { autoResolve: true })}
                iconName="Zap"
                iconSize={14}
              >
                Auto-Resolve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictDetection;