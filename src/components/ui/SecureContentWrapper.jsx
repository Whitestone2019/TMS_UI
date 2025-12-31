import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const SecureContentWrapper = ({ 
  children, 
  watermarkText = 'CONFIDENTIAL TRAINING MATERIAL',
  sessionTimeout = 30,
  onSessionExpired,
  enableScreenshotProtection = true,
  enableRightClickDisable = true,
  className = ''
}) => {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(sessionTimeout * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const contentRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  // Activity tracking
  const updateActivity = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setTimeRemaining(sessionTimeout * 60);
  };

  // Disable right-click context menu
  const handleContextMenu = (e) => {
    if (enableRightClickDisable) {
      e?.preventDefault();
      return false;
    }
  };

  // Disable text selection and drag
  const handleSelectStart = (e) => {
    e?.preventDefault();
    return false;
  };

  // Disable keyboard shortcuts for copying/printing
  const handleKeyDown = (e) => {
    if (enableScreenshotProtection) {
      // Disable Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P, F12, Print Screen
      if (
        (e?.ctrlKey && (e?.key === 'c' || e?.key === 'a' || e?.key === 's' || e?.key === 'p')) ||
        e?.key === 'F12' ||
        e?.key === 'PrintScreen'
      ) {
        e?.preventDefault();
        return false;
      }
    }
  };

  // Session timeout management
  useEffect(() => {
    const checkSession = () => {
      const now = Date.now();
      const timeSinceActivity = (now - lastActivity) / 1000;
      const remaining = Math.max(0, sessionTimeout * 60 - timeSinceActivity);
      
      setTimeRemaining(remaining);
      
      // Show warning at 5 minutes remaining
      if (remaining <= 300 && remaining > 0 && !showWarning) {
        setShowWarning(true);
      }
      
      // Session expired
      if (remaining <= 0 && isSessionActive) {
        setIsSessionActive(false);
        if (onSessionExpired) {
          onSessionExpired();
        }
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, sessionTimeout, showWarning, isSessionActive, onSessionExpired]);

  // Activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events?.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events?.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableScreenshotProtection]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const extendSession = () => {
    updateActivity();
    setShowWarning(false);
  };

  if (!isSessionActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 bg-card rounded-lg elevation-2 max-w-md">
          <Icon name="Clock" size={48} className="text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Session Expired</h2>
          <p className="text-muted-foreground mb-4">
            Your secure session has expired for security reasons. Please log in again to continue.
          </p>
          <button
            onClick={() => window.location?.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Session Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-session-timeout bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg elevation-3 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning mr-3" />
              <h3 className="text-lg font-semibold text-foreground">Session Expiring Soon</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Your session will expire in {formatTime(timeRemaining)}. Would you like to extend it?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={extendSession}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Extend Session
              </button>
              <button
                onClick={() => onSessionExpired && onSessionExpired()}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-content-watermark overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 })?.map((_, i) => (
            <div
              key={i}
              className="absolute text-xs font-medium text-foreground transform rotate-45 whitespace-nowrap"
              style={{
                top: `${(i % 4) * 25 + 10}%`,
                left: `${Math.floor(i / 4) * 20 + 5}%`,
              }}
            >
              {watermarkText}
            </div>
          ))}
        </div>
      </div>
      {/* Protected Content */}
      <div
        ref={contentRef}
        className="content-protected"
        onContextMenu={handleContextMenu}
        onSelectStart={handleSelectStart}
        onDragStart={(e) => e?.preventDefault()}
      >
        {children}
      </div>
      {/* Session Timer (Development/Admin view) */}
      {process.env?.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-3 text-xs z-50">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Session: {formatTime(timeRemaining)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureContentWrapper;
