import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SecureContentWrapper from '../../components/ui/SecureContentWrapper';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import StepNavigationSidebar from './components/StepNavigationSidebar';
import ContentDisplay from './components/ContentDisplay';
import SecurityWatermark from './components/SecurityWatermark';
import ProgressTracker  from './components/ProgressTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SyllabusContentViewer = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentStepId, setCurrentStepId] = useState('step-1');
  const [sessionActive, setSessionActive] = useState(true);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const contentRef = useRef(null);

  // Mock trainee information
  const traineeInfo = {
    id: "TRN-2024-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "trainee",
    department: "Software Development",
    startDate: "2024-10-01"
  };

  // Mock syllabus steps data
  const syllabusSteps = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Introduction to Web Development',
    description: 'Fundamentals of HTML, CSS, and JavaScript',
    isCompleted: true,
    isLocked: false,
    progress: 100,
    estimatedTime: '2 hours',
    completedAt: '2024-10-20T10:30:00Z',
    content: [
    {
      type: 'text',
      data: `<h2>Welcome to Web Development</h2>
                 <p>Web development is the process of creating websites and web applications. In this comprehensive course, you'll learn the fundamental technologies that power the modern web.</p>
                 <h3>What You'll Learn:</h3>
                 <ul>
                   <li>HTML structure and semantic markup</li>
                   <li>CSS styling and responsive design</li>
                   <li>JavaScript programming fundamentals</li>
                   <li>Modern development tools and workflows</li>
                 </ul>`
    },
    {
      type: 'image',
      data: {
        url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
        alt: 'Computer screen displaying colorful code editor with HTML and CSS syntax highlighting',
        caption: 'Modern web development environment with code editor'
      }
    }]

  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'HTML Fundamentals',
    description: 'Learn HTML structure, elements, and semantic markup',
    isCompleted: true,
    isLocked: false,
    progress: 100,
    estimatedTime: '3 hours',
    completedAt: '2024-10-21T14:15:00Z',
    content: [
    {
      type: 'text',
      data: `<h2>HTML Fundamentals</h2>
                 <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements and tags.</p>
                 <h3>Basic HTML Structure:</h3>
                 <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Main Heading&lt;/h1&gt;
    &lt;p&gt;Paragraph content&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`
    },
    {
      type: 'video',
      data: {
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        poster: "https://images.unsplash.com/photo-1579823730815-0291253396b5",
        caption: 'HTML structure demonstration video'
      }
    }]

  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'CSS Styling Basics',
    description: 'Introduction to CSS selectors, properties, and layouts',
    isCompleted: false,
    isLocked: false,
    progress: 65,
    estimatedTime: '4 hours',
    content: [
    {
      type: 'text',
      data: `<h2>CSS Styling Basics</h2>
                 <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It controls the visual presentation of HTML elements.</p>
                 <h3>CSS Syntax:</h3>
                 <pre><code>selector {
    property: value;
    property: value;
}</code></pre>
                 <h3>Common CSS Properties:</h3>
                 <ul>
                   <li><strong>color:</strong> Sets text color</li>
                   <li><strong>background-color:</strong> Sets background color</li>
                   <li><strong>font-size:</strong> Controls text size</li>
                   <li><strong>margin:</strong> Controls outer spacing</li>
                   <li><strong>padding:</strong> Controls inner spacing</li>
                 </ul>`
    },
    {
      type: 'interactive',
      data: {
        title: 'CSS Playground',
        description: 'Practice CSS styling with this interactive editor',
        url: 'https://codepen.io/pen/'
      }
    }]

  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'JavaScript Fundamentals',
    description: 'Variables, functions, and DOM manipulation',
    isCompleted: false,
    isLocked: false,
    progress: 0,
    estimatedTime: '5 hours',
    lockReason: 'Complete CSS Styling Basics first',
    content: [
    {
      type: 'text',
      data: `<h2>JavaScript Fundamentals</h2>
                 <p>JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications.</p>
                 <h3>Variables and Data Types:</h3>
                 <pre><code>// Variables
let name = "John";
const age = 25;
var isStudent = true;

// Functions
function greetUser(name) {
    return "Hello, " + name + "!";
}</code></pre>`
    }]

  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Responsive Design',
    description: 'Creating mobile-friendly layouts with CSS Grid and Flexbox',
    isCompleted: false,
    isLocked: true,
    progress: 0,
    estimatedTime: '3 hours',
    lockReason: 'Complete JavaScript Fundamentals first',
    content: []
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Final Project',
    description: 'Build a complete web application using all learned concepts',
    isCompleted: false,
    isLocked: true,
    progress: 0,
    estimatedTime: '8 hours',
    lockReason: 'Complete all previous steps first',
    content: []
  }];


  const currentStep = syllabusSteps?.find((step) => step?.id === currentStepId);
  const currentStepIndex = syllabusSteps?.findIndex((step) => step?.id === currentStepId);
  const completedSteps = syllabusSteps?.filter((step) => step?.isCompleted)?.length;

  // Disable right-click context menu
  const handleContextMenu = (e) => {
    e?.preventDefault();
    return false;
  };

  // Disable text selection
  const handleSelectStart = (e) => {
    e?.preventDefault();
    return false;
  };

  // Disable keyboard shortcuts
  const handleKeyDown = (e) => {
    // Disable Ctrl+S, Ctrl+P, Ctrl+C, F12, Print Screen
    if (
    e?.ctrlKey && (e?.key === 's' || e?.key === 'p' || e?.key === 'c' || e?.key === 'a') ||
    e?.key === 'F12' ||
    e?.key === 'PrintScreen')
    {
      e?.preventDefault();
      return false;
    }
  };

  // Add event listeners for security
  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleStepSelect = (stepId) => {
    const step = syllabusSteps?.find((s) => s?.id === stepId);
    if (step && !step?.isLocked) {
      setCurrentStepId(stepId);
    }
  };

  const handleStepComplete = (stepId) => {
    // In a real app, this would make an API call
    console.log(`Step ${stepId} completed`);

    // Update step completion status
    const stepIndex = syllabusSteps?.findIndex((s) => s?.id === stepId);
    if (stepIndex !== -1) {
      syllabusSteps[stepIndex].isCompleted = true;
      syllabusSteps[stepIndex].progress = 100;
      syllabusSteps[stepIndex].completedAt = new Date()?.toISOString();

      // Unlock next step if exists
      if (stepIndex + 1 < syllabusSteps?.length) {
        syllabusSteps[stepIndex + 1].isLocked = false;
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < syllabusSteps?.length - 1) {
      const nextStep = syllabusSteps?.[currentStepIndex + 1];
      if (!nextStep?.isLocked) {
        setCurrentStepId(nextStep?.id);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(syllabusSteps?.[currentStepIndex - 1]?.id);
    }
  };

  const canGoNext = currentStepIndex < syllabusSteps?.length - 1 &&
  !syllabusSteps?.[currentStepIndex + 1]?.isLocked;
  const canGoPrevious = currentStepIndex > 0;

  const handleSessionExpired = () => {
    setSessionActive(false);
    navigate('/trainee-dashboard');
  };

  const handleLogout = () => {
    navigate('/trainee-dashboard');
  };

  if (!sessionActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 bg-card rounded-lg elevation-2 max-w-md">
          <Icon name="Shield" size={48} className="text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Session Expired</h2>
          <p className="text-muted-foreground mb-4">
            Your secure learning session has expired. Please return to your dashboard.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/trainee-dashboard')}
            iconName="ArrowLeft"
            iconPosition="left">

            Back to Dashboard
          </Button>
        </div>
      </div>);

  }

  return (
    // <SecureContentWrapper
    //   watermarkText={`${traineeInfo?.name} | ID: ${traineeInfo?.id} | CONFIDENTIAL TRAINING MATERIAL`}
    //   sessionTimeout={30}
    //   onSessionExpired={handleSessionExpired}
    //   enableScreenshotProtection={true}
    //   enableRightClickDisable={true}>

      <div className="min-h-screen bg-background">
        {/* Session Timeout Handler */}
        <SessionTimeoutHandler
          sessionDuration={30}
          warningTime={5}
          onSessionExpired={handleSessionExpired}
          onSessionExtended={() => setSessionActive(true)}
          isActive={sessionActive} />


        {/* Security Watermark */}
        {/* <SecurityWatermark traineeInfo={traineeInfo} /> */}

        {/* Header */}
        <Header
          userRole="trainee"
          userName={traineeInfo?.name}
          onLogout={handleLogout} />


        {/* Main Content */}
        <div className="pt-16 flex h-screen">
          {/* Step Navigation Sidebar */}
          <StepNavigationSidebar
            steps={syllabusSteps}
            currentStepId={currentStepId}
            onStepSelect={handleStepSelect}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />


          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Breadcrumb Navigation */}
            <div className="bg-surface border-b border-border px-6 py-3">
              <NavigationBreadcrumb userRole="trainee" />
            </div>

            {/* Main Content Display */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-hidden" ref={contentRef}>
                <ContentDisplay
                  currentStep={currentStep}
                  traineeInfo={traineeInfo}
                  onStepComplete={handleStepComplete}
                  onNextStep={handleNextStep}
                  onPreviousStep={handlePreviousStep}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious} />

              </div>

              {/* Progress Tracker Sidebar */}
              {showProgressTracker &&
              <div className="w-80 border-l border-border overflow-y-auto">
                  <ProgressTracker
                  currentStep={currentStep}
                  totalSteps={syllabusSteps?.length}
                  completedSteps={completedSteps}
                  timeSpent={45} // Mock time in minutes
                  estimatedTimeRemaining={180} // Mock remaining time in minutes
                  className="m-4" />

                </div>
              }
            </div>
          </div>

          {/* Floating Progress Toggle */}
          <Button
            variant="default"
            size="icon"
            onClick={() => setShowProgressTracker(!showProgressTracker)}
            className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full elevation-2"
            iconName={showProgressTracker ? "X" : "BarChart3"}
            iconSize={20}
            title={showProgressTracker ? "Hide Progress" : "Show Progress"} />

        </div>

        {/* Security Notice */}
        <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 text-xs z-30 max-w-xs">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={14} className="text-warning" />
            <span className="text-muted-foreground">
              This content is protected and monitored for security.
            </span>
          </div>
        </div>
      </div>
    // </SecureContentWrapper>
    );

};

export default SyllabusContentViewer;