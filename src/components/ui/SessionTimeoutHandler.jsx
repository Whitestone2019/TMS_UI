import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionTimeoutHandler = ({
  sessionDuration = 30, // minutes
  warningTime = 5, // minutes before expiry to show warning
  onSessionExpired,
  onSessionExtended,
  isActive = true,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset session timer
  const resetSession = useCallback(() => {
    setTimeRemaining(sessionDuration * 60);
    setLastActivity(Date.now());
    setShowWarning(false);
    setIsSessionExpired(false);
  }, [sessionDuration]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (!isSessionExpired && isActive) {
      setLastActivity(Date.now());
    }
  }, [isSessionExpired, isActive]);

  // Extend session
  const extendSession = () => {
    resetSession();
    setShowWarning(false);
    if (onSessionExtended) {
      onSessionExtended();
    }
  };

  // Handle session expiry
  const handleSessionExpiry = () => {
    setIsSessionExpired(true);
    setShowWarning(false);
    if (onSessionExpired) {
      onSessionExpired();
    }
  };

  // Activity event listeners
  useEffect(() => {
    if (!isActive) return;

    const activityEvents = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ];

    const throttledActivity = (() => {
      let timeout;
      return () => {
        if (!timeout) {
          timeout = setTimeout(() => {
            handleActivity();
            timeout = null;
          }, 1000); // Throttle to once per second
        }
      };
    })();

    activityEvents?.forEach(event => {
      document.addEventListener(event, throttledActivity, true);
    });

    return () => {
      activityEvents?.forEach(event => {
        document.removeEventListener(event, throttledActivity, true);
      });
    };
  }, [handleActivity, isActive]);

  // Session countdown timer
  useEffect(() => {
    if (!isActive || isSessionExpired) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = (now - lastActivity) / 1000;
      const remaining = Math.max(0, sessionDuration * 60 - timeSinceActivity);
      
      setTimeRemaining(remaining);

      // Show warning when approaching expiry
      if (remaining <= warningTime * 60 && remaining > 0 && !showWarning) {
        setShowWarning(true);
      }

      // Session expired
      if (remaining <= 0) {
        handleSessionExpiry();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    lastActivity, 
    sessionDuration, 
    warningTime, 
    showWarning, 
    isActive, 
    isSessionExpired
  ]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  // Get warning message based on time remaining
  const getWarningMessage = () => {
    const minutes = Math.ceil(timeRemaining / 60);
    if (minutes <= 1) {
      return 'Your session will expire in less than 1 minute.';
    }
    return `Your session will expire in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
  };

  // Session expired overlay
  if (isSessionExpired) {
    return (
      <div className="fixed inset-0 z-session-timeout bg-black bg-opacity-75 flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg elevation-3 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Clock" size={32} className="text-error" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Session Expired</h2>
          <p className="text-muted-foreground mb-6">
            Your session has expired due to inactivity. For security reasons, you need to log in again.
          </p>
          <Button
            variant="default"
            onClick={() => window.location?.reload()}
            iconName="RefreshCw"
            iconPosition="left"
            fullWidth
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  // Session warning modal
  if (showWarning && isActive) {
    return (
      <div className="fixed inset-0 z-session-timeout bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg elevation-3 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Session Expiring</h3>
              <p className="text-sm text-muted-foreground">Time remaining: {formatTime(timeRemaining)}</p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {getWarningMessage()} Would you like to extend your session?
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="default"
              onClick={extendSession}
              iconName="Clock"
              iconPosition="left"
              className="flex-1"
            >
              Extend Session
            </Button>
            <Button
              variant="outline"
              onClick={handleSessionExpiry}
              iconName="LogOut"
              iconPosition="left"
              className="flex-1"
            >
              Log Out Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Session timer indicator (for development/admin)
  if (process.env?.NODE_ENV === 'development' && isActive && !isSessionExpired) {
    return (
      <div className={`fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 text-xs shadow-sm z-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <Icon 
            name="Clock" 
            size={14} 
            className={timeRemaining <= 300 ? 'text-warning' : 'text-muted-foreground'} 
          />
          <span className={timeRemaining <= 300 ? 'text-warning font-medium' : 'text-muted-foreground'}>
            Session: {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default SessionTimeoutHandler;