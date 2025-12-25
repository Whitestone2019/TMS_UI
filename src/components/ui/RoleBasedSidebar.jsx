import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedSidebar = ({
  userRole = 'trainee',
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navigationSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      items: [
        {
          label: 'Overview',
          path: userRole === 'manager' ? '/manager-dashboard' : '/trainee-dashboard',
          icon: 'Home',
          roles: ['trainee', 'manager']
        }
      ]
    },
    {
      id: 'learning',
      label: 'Learning Progress',
      icon: 'BookOpen',
      items: [
        {
          label: 'Syllabus Content',
          path: '/syllabus-content-viewer',
          icon: 'FileText',
          roles: ['trainee']
        },
        // {
        //   label: 'Progress Reports',
        //   path: '/progress-reports',
        //   icon: 'TrendingUp',
        //   roles: ['trainee', 'manager']
        // }
      ]
    },
    {
      id: 'assessment',
      label: 'Assessment Management',
      icon: 'ClipboardCheck',
      items: [
        {
          label: 'Assessment Entry',
          path: '/assessment-entry',
          icon: 'Edit3',
          roles: ['manager']
        }
      ]
    },
    {
      id: 'coordination',
      label: 'Interview Coordination',
      icon: 'Calendar',
      items: [
        {
          label: 'Interview Scheduling',
          path: '/interview-scheduling',
          icon: 'CalendarDays',
          roles: ['manager']
        }
      ]
    }
  ];

  const filteredSections = navigationSections?.map(section => ({
    ...section,
    items: section?.items?.filter(item => item?.roles?.includes(userRole))
  }))?.filter(section => section?.items?.length > 0);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const isActiveSection = (sectionId) => {
    const section = navigationSections?.find(s => s?.id === sectionId);
    if (!section) return false;

    return section?.items?.some(item =>
      item?.roles?.includes(userRole) && isActivePath(item?.path)
    );
  };

  useEffect(() => {
    const currentSection = filteredSections?.find(section =>
      section?.items?.some(item => isActivePath(item?.path))
    );
    if (currentSection) {
      setActiveSection(currentSection?.id);
    }
  }, [location?.pathname, filteredSections]);

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? '' : sectionId);
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-sidebar bg-surface border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'
        } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Training System</h2>
                <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
              </div>
            </div>
          )}

          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
            >
            </Button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            {filteredSections?.map((section) => (
              <div key={section?.id} className="px-3">
                {/* Section Header */}
                <button
                  onClick={() => !isCollapsed && toggleSection(section?.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${isActiveSection(section?.id)
                      ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  title={isCollapsed ? section?.label : ''}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      name={section?.icon}
                      size={18}
                      className={isActiveSection(section?.id) ? 'text-primary' : 'text-muted-foreground'}
                    />
                    {!isCollapsed && (
                      <span>{section?.label}</span>
                    )}
                  </div>
                  {!isCollapsed && section?.items?.length > 1 && (
                    <Icon
                      name="ChevronDown"
                      size={16}
                      className={`transition-transform duration-150 ${activeSection === section?.id ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </button>

                {/* Section Items */}
                {(!isCollapsed && (activeSection === section?.id || section?.items?.length === 1)) && (
                  <div className="mt-2 space-y-1">
                    {section?.items?.map((item) => (
                      <Button
                        key={item?.path}
                        variant={isActivePath(item?.path) ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleNavigation(item?.path)}
                        iconName={item?.icon}
                        iconPosition="left"
                        iconSize={16}
                        fullWidth
                        className="justify-start pl-9 h-9"
                      >
                        {item?.label}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Collapsed State Items */}
                {isCollapsed && section?.items?.map((item) => (
                  <div key={item?.path} className="mt-1">
                    <Button
                      variant={isActivePath(item?.path) ? "default" : "ghost"}
                      size="icon"
                      onClick={() => handleNavigation(item?.path)}
                      iconName={item?.icon}
                      iconSize={18}
                      className="w-10 h-10 mx-auto"
                      title={item?.label}
                    >
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-4">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start"
              >
                Help & Support
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="icon"
                iconName="Settings"
                iconSize={18}
                className="w-10 h-10 mx-auto"
                title="Settings"
              >
              </Button>
              <Button
                variant="ghost"
                size="icon"
                iconName="HelpCircle"
                iconSize={18}
                className="w-10 h-10 mx-auto"
                title="Help & Support"
              >
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RoleBasedSidebar;