import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SecureContentWrapper from '../../components/ui/SecureContentWrapper';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import StepNavigationSidebar from './components/StepNavigationSidebar';
import ContentDisplay from './components/ContentDisplay';
import SecurityWatermark from './components/SecurityWatermark';
import ProgressTracker from './components/ProgressTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { updateStepProgress } from '../../api_service';

const SyllabusContentViewer = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [sessionActive, setSessionActive] = useState(true);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [syllabusSteps, setSyllabusSteps] = useState([]);
  const [traineeInfo, setTraineeInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [subTopicIndex, setSubTopicIndex] = useState(0);

  const contentRef = useRef(null);
  sessionStorage.setItem("empid", "TRN001");
  const empid = sessionStorage.getItem("empid");

  useEffect(() => {
    setSubTopicIndex(0);
  }, [currentStepId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/syllabus/all");
        const data = await response.json();

        // safe mapping to the structure ContentDisplay expects
        const formattedSteps = (Array.isArray(data) ? data : []).map((item, index) => ({
          id: `step-${index + 1}`,
          stepNumber: index + 1,
          title: item?.title ?? `Step ${index + 1}`,
          description: item?.topic ?? "",
          isCompleted: false,
          isLocked: index !== 0, // only first open
          progress: 0,
          estimatedTime: "2 hours",
          topics: [
            {
              title: item?.title ?? item?.topic ?? `Topic ${index + 1}`,
              subTopics: Array.isArray(item?.subTopics)
                ? item.subTopics.map((sub) => ({
                  // keep both name/title keys so both legacy and new code work
                  title: sub?.name ?? sub?.title ?? "",
                  name: sub?.name ?? sub?.title ?? "",
                  description: sub?.description ?? "",
                  filePath: sub?.filePath ?? null,
                }))
                : []
            }
          ]
        }));

        setSyllabusSteps(formattedSteps);

        //     // set current step to first if available
        //     if (formattedSteps.length > 0) setCurrentStepId(formattedSteps[0].id);

        //     // trainee info (mock or fetch if required)
        //     setTraineeInfo({
        //       id: "TRN-1001",
        //       name: "John Doe",
        //       email: "john@example.com"
        //     });

        //     setLoading(false);
        //   } catch (err) {
        //     console.error("Error fetching syllabus:", err);
        //     setLoading(false);
        //   }
        // };



        const traineeRes = await fetch("http://localhost:8080/api/users/${empid}");
        const traineeJson = await traineeRes.json();

        // Filter only trainee role users
        const filteredTrainees = traineeJson.data.filter(
          (user) => user.role === "trainee"
        );

        // If 1 trainee logged in, store only first trainee info
        setTraineeInfo(filteredTrainees.length > 0 ? filteredTrainees[0] : {});

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentStep = syllabusSteps?.find((step) => step?.id === currentStepId);
  const currentStepIndex = syllabusSteps?.findIndex((step) => step?.id === currentStepId);
  const completedSteps = syllabusSteps?.filter((step) => step?.isCompleted)?.length;




  // const totalSubs =
  //   currentStep?.topics?.[0]?.subTopics?.length || 0;

  // const completedSubs =
  //   currentStep?.topics?.[0]?.subTopics?.filter(s => s.completed)?.length || 0;

  // const calcProgress =
  //   totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  // SECURITY EVENT HANDLERS (kept same)
  const handleContextMenu = (e) => { e?.preventDefault(); return false; };
  const handleSelectStart = (e) => { e?.preventDefault(); return false; };
  const handleKeyDown = (e) => {
    if (
      e?.ctrlKey && (e?.key === 's' || e?.key === 'p' || e?.key === 'c' || e?.key === 'a') ||
      e?.key === 'F12' ||
      e?.key === 'PrintScreen'
    ) {
      e?.preventDefault();
      return false;
    }
  };

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

  // const handleStepComplete = (stepId) => {
  //   // same behavior: mark complete + unlock next
  //   setSyllabusSteps((prev) =>
  //     prev.map((s, idx) =>
  //       s.id === stepId
  //         ? { ...s, isCompleted: true, progress: 100, completedAt: new Date().toISOString() }
  //         : s
  //     ).map((s, idx, arr) => {
  //       // unlock next one
  //       if (s.id === stepId) {
  //         const next = arr.find((_, i) => i === idx + 1);
  //         if (next) next.isLocked = false;
  //       }
  //       return s;
  //     })
  //   );
  // };

  // const handleCompleteStep = (stepId) => {
  //   setSyllabusSteps(prevSteps =>
  //     prevSteps.map((step, index) => {
  //       // complete current step
  //       if (step.id === stepId) {
  //         return {
  //           ...step,
  //           isCompleted: true,
  //           progress: 100,
  //           completedAt: new Date().toISOString()
  //         };
  //       }

  //       // unlock next step
  //       const prevIndex = prevSteps.findIndex(s => s.id === stepId);
  //       if (index === prevIndex + 1) {
  //         return { ...step, isLocked: false };
  //       }

  //       return step;
  //     })
  //   );
  // };

  const handleCompleteStep = async (stepId) => {
    // Update local state
    setSyllabusSteps((prevSteps) => {
      const updated = [...prevSteps];
      const idx = updated.findIndex((s) => s.id === stepId);

      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          isCompleted: true,
          progress: 100,
          completedAt: new Date().toISOString(),
        };

        // unlock next step
        if (idx + 1 < updated.length) {
          updated[idx + 1] = {
            ...updated[idx + 1],
            isLocked: false,
          };
        }
      }

      return updated;
    });

    // ---- POST to backend ----
    try {
      const res = await updateStepProgress(empid, stepId, 100);
      console.log("Step progress updated. Overall:", res?.overallProgress);
      // Overall progress is stored in backend; we do not display it yet
    } catch (err) {
      console.error("Error updating step progress:", err);
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
          <Button variant="default" onClick={() => navigate('/trainee-dashboard')} iconName="ArrowLeft" iconPosition="left">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SecureContentWrapper
      watermarkText={`${traineeInfo?.firstname} | ID: ${traineeInfo?.empid} | CONFIDENTIAL TRAINING MATERIAL`}
      sessionTimeout={30}
      onSessionExpired={handleSessionExpired}
      enableScreenshotProtection={true}
      enableRightClickDisable={true}
    >
      <div className="min-h-screen bg-background">
        <SessionTimeoutHandler
          sessionDuration={30}
          warningTime={5}
          onSessionExpired={handleSessionExpired}
          onSessionExtended={() => setSessionActive(true)}
          isActive={sessionActive}
        />

        <SecurityWatermark traineeInfo={traineeInfo} />

        <Header userRole="trainee" userName={traineeInfo?.name} onLogout={handleLogout} />

        <div className="pt-16 flex h-screen">
          <StepNavigationSidebar
            steps={syllabusSteps}
            currentStepId={currentStepId}
            onStepSelect={handleStepSelect}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-surface border-b border-border px-6 py-3">
              <NavigationBreadcrumb userRole="trainee" />
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-hidden" ref={contentRef}>
                <ContentDisplay
                  currentStep={currentStep}
                  traineeInfo={traineeInfo}
                  onStepComplete={handleCompleteStep}
                  onNextStep={handleNextStep}
                  onPreviousStep={handlePreviousStep}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                />
              </div>

              {showProgressTracker &&
                <div className="w-80 border-l border-border overflow-y-auto">
                  <ProgressTracker
                    currentStep={currentStep}
                    totalSteps={syllabusSteps?.length}
                    completedSteps={completedSteps}
                    timeSpent={45}
                    estimatedTimeRemaining={180}
                    className="m-4"
                  />
                </div>
              }
            </div>
          </div>

          <Button
            variant="default"
            size="icon"
            onClick={() => setShowProgressTracker(!showProgressTracker)}
            className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full elevation-2"
            iconName={showProgressTracker ? "X" : "BarChart3"}
            iconSize={20}
            title={showProgressTracker ? "Hide Progress" : "Show Progress"}
          />
        </div>

        <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 text-xs z-30 max-w-xs">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={14} className="text-warning" />
            <span className="text-muted-foreground">This content is protected and monitored for security.</span>
          </div>
        </div>
      </div>
    </SecureContentWrapper>
  );
};

export default SyllabusContentViewer;