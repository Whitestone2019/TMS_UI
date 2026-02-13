import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import ReportFilters from './components/ReportFilters';
import ProgressAnalytics from './components/ProgressAnalytics';
import ReportPreview from './components/ReportPreview';
import ReportScheduler from './components/ReportScheduler';

const ProgressReports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [currentUser, setCurrentUser] = useState({
    name: 'Sarah Johnson',
    role: 'manager',
    email: 'sarah.johnson@company.com'
  });
  const [reportFilters, setReportFilters] = useState({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Mock authentication check
  useEffect(() => {
    // const token = localStorage.getItem('authToken');
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

    // Mock user data - in real app, this would come from token/API
    const userData = {
      name: 'Sarah Johnson',
      role: 'manager',
      email: 'sarah.johnson@company.com'
    };
    setCurrentUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleSessionExpired = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleFiltersChange = (filters) => {
    setReportFilters(filters);
  };

  const handleGenerateReport = async (filters) => {
    setIsGeneratingReport(true);
    try {
      // Mock API call to generate report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report data
      const mockReportData = {
        generatedAt: new Date()?.toISOString(),
        filters: filters,
        totalTrainees: 45,
        avgProgress: 82,
        completedInterviews: 38,
        avgAssessmentScore: 85
      };
      
      setReportData(mockReportData);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportReport = async (format) => {
    setIsExporting(format);
    try {
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would trigger file download
      console.log(`Exporting report as ${format}`);
      
      // Show success message
      alert(`Report exported successfully as ${format?.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = async (scheduleConfig) => {
    setIsScheduling(true);
    try {
      // Mock API call to create schedule
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Schedule created:', scheduleConfig);
      alert('Report schedule created successfully!');
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Error creating schedule. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const tabs = [
    {
      id: 'analytics',
      label: 'Analytics Dashboard',
      icon: 'BarChart3',
      description: 'View comprehensive progress analytics and trends'
    },
    {
      id: 'filters',
      label: 'Report Builder',
      icon: 'Filter',
      description: 'Configure filters and generate custom reports'
    },
    {
      id: 'preview',
      label: 'Report Preview',
      icon: 'FileText',
      description: 'Preview and export generated reports'
    },
    {
      id: 'scheduler',
      label: 'Automated Reports',
      icon: 'Calendar',
      description: 'Schedule automated report generation and delivery'
    }
  ];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SessionTimeoutHandler
        sessionDuration={30}
        warningTime={5}
        onSessionExpired={handleSessionExpired}
        onSessionExtended={() => {}}
        isActive={true}
      />
      <Header
        userRole={currentUser?.role}
        userName={currentUser?.name}
        onLogout={handleLogout}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <NavigationBreadcrumb userRole={currentUser?.role} />
            <div className="mt-4">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Progress Reports</h1>
                  <p className="text-muted-foreground">
                    Comprehensive analytics and reporting for trainee performance evaluation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {tabs?.find(tab => tab?.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'analytics' && (
              <ProgressAnalytics analyticsData={reportData} />
            )}

            {activeTab === 'filters' && (
              <ReportFilters
                onFiltersChange={handleFiltersChange}
                onGenerateReport={handleGenerateReport}
                isGenerating={isGeneratingReport}
              />
            )}

            {activeTab === 'preview' && (
              <ReportPreview
                reportData={reportData}
                filters={reportFilters}
                onExport={handleExportReport}
                isExporting={isExporting}
              />
            )}

            {activeTab === 'scheduler' && (
              <ReportScheduler
                onScheduleReport={handleScheduleReport}
                isScheduling={isScheduling}
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6 elevation-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                  <p className="text-sm text-muted-foreground">Common reporting tasks and shortcuts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('filters')}
                  iconName="FileText"
                  iconPosition="left"
                  iconSize={16}
                >
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('scheduler')}
                  iconName="Calendar"
                  iconPosition="left"
                  iconSize={16}
                >
                  Schedule Report
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleExportReport('pdf')}
                  loading={isExporting === 'pdf'}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Quick Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressReports;