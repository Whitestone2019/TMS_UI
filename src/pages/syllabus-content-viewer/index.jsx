import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
<<<<<<< HEAD
import { updateStepProgress, fetchUserByEmpId, fetchSyllabusProgressByEmpId } from '../../api_service';
=======
import {
  updateStepProgress,
  fetchUserByEmpId,
  fetchStepByEmpId,
  startSubTopic
} from '../../api_service';
>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382

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

<<<<<<< HEAD
  const { state } = useLocation();
  const stepNumber = state || 1;

  const currentStep = syllabusSteps?.find((step) => step?.id === currentStepId);
  // console.log("Current Step:", currentStepId);
  const currentStepIndex = syllabusSteps?.findIndex((step) => step?.id === currentStepId);
  const completedSteps = syllabusSteps?.filter((step) => step?.isCompleted)?.length;
  const [timeSpent, setTimeSpent] = useState(currentStep?.durationSeconds || 0);
  const contentRef = useRef(null);

  const empid = sessionStorage.getItem("empid");

  useEffect(() => { setSubTopicIndex(0); }, [currentStepId]);

  useEffect(() => {
    const loadTraineeInfo = async () => {
      try {
        const empId = sessionStorage.getItem("empid");
        const user = await fetchUserByEmpId(empId);
        if (user) {
          setTraineeInfo({
            name: `${user.firstname} ${user.lastname}`,
            id: user.empid,
            email: user.email,
            program: user.designation || "Training Program",
            startDate: user.createdAt || "2024-10-01",
          });
        }
      } catch (err) {
        console.error("Failed to load trainee info", err);
=======
  const contentRef = useRef(null);

  sessionStorage.setItem("empid", "TRN001");
  const empid = sessionStorage.getItem("empid");

  const currentStep = syllabusSteps.find(s => s.id === currentStepId);
  const currentStepIndex = syllabusSteps.findIndex(s => s.id === currentStepId);
  const completedSteps = syllabusSteps.filter(s => s.isCompleted).length;

  // 🔧 RESET SUBTOPIC INDEX ON STEP CHANGE
  useEffect(() => {
    setSubTopicIndex(0);
  }, [currentStepId]);

  // ======================================================
  // LOAD TRAINEE INFO (UNCHANGED)
  // ======================================================
  useEffect(() => {
    const loadTraineeInfo = async () => {
      const user = await fetchUserByEmpId(empid);
      if (user) {
        setTraineeInfo({
          name: `${user.firstname} ${user.lastname}`,
          id: user.empid,
          email: user.email,
          program: user.designation || "Training Program",
          startDate: user.createdAt
        });
>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382
      }
    };
    loadTraineeInfo();
  }, []);

<<<<<<< HEAD
=======
  // ======================================================
  // FETCH SYLLABUS & INITIAL LOCKING (FIXED)
  // ======================================================
>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

<<<<<<< HEAD
        const response = await fetchSyllabusProgressByEmpId(empid);
        // const result = await response.json();
        const apiData = response?.data || response;

        const formattedSteps = apiData.map((item, index, arr) => {
          // 🔹 current step completed or not
          const isStepCompleted = item?.subTopics?.every(sub =>
            sub?.stepProgress?.some(p => p.complete === true && p.checker === true)
          );

          // 🔹 previous step completed or not
          const prevStepCompleted =
            index === 0
              ? true
              : arr[index - 1]?.subTopics?.every(sub =>
                sub?.stepProgress?.some(p => p.complete === true && p.checker === true)
              );

          return {
            id: item?.syllabusId,
            stepNumber: index + 1,
            title: item?.title || `Step ${index + 1}`,
            description: item?.topic || "",

            // ✅ MAIN FIX
            isLocked: !prevStepCompleted,

            isCompleted: isStepCompleted,

            progress: item?.subTopics?.length
              ? Math.round(
                (item.subTopics.filter(sub =>
                  sub.stepProgress?.some(p => p.complete === true && p.checker === true)
                ).length / item.subTopics.length) * 100
              )
              : 0,

            topics: [
              {
                title: item?.topic,
                subTopics: item?.subTopics?.map(sub => ({
                  id: sub?.subTopicId,
                  title: sub?.name,
                  name: sub?.name,
                  description: sub?.description,
                  filePath: sub?.filePath,
                  stepNumber: sub?.stepNumber,

                  completed: sub?.stepProgress?.some(p => p.complete === true),
                  managerDecision: sub?.stepProgress?.some(p => p.checker === true),
                })) || []
              }
            ]
          };
        });

        setSyllabusSteps(formattedSteps);

        if (formattedSteps.length > 0) setCurrentStepId(formattedSteps[stepNumber - 1].id);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
=======
      const res = await fetch("http://localhost:8080/api/syllabus/all");
      const result = await res.json();
      const apiData = result.data || [];

      const formattedSteps = apiData.map((item, index) => ({
        id: item.id,
        stepNumber: index + 1,
        title: item.title,
        description: item.topic || "",
        isLocked: index !== 0,          // 🔒 ONLY STEP 1 UNLOCKED
        isCompleted: false,
        progress: 0,
        topics: [{
          title: item.title,
          subTopics: item.subTopics.map(sub => ({
            id: sub.id,
            name: sub.name,
            description: sub.description,
            filePath: sub.filePath,
            stepNumber: sub.stepNumber,
            completed: false               // 🔧 IMPORTANT
          }))
        }]
      }));

      setSyllabusSteps(formattedSteps);
      setCurrentStepId(formattedSteps[0]?.id);
      setLoading(false);
>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382
    };
    fetchData();
  }, [empid]);

<<<<<<< HEAD
  // SECURITY EVENT HANDLERS
  const handleContextMenu = (e) => { e?.preventDefault(); return false; };
  const handleSelectStart = (e) => { e?.preventDefault(); return false; };
  const handleKeyDown = (e) => {
    if (e?.ctrlKey && (e?.key === 's' || e?.key === 'p' || e?.key === 'c' || e?.key === 'a') || e?.key === 'F12' || e?.key === 'PrintScreen') {
      e?.preventDefault(); return false;
    }
  };

  // imp
  // useEffect(() => {
  //   document.addEventListener('contextmenu', handleContextMenu);
  //   document.addEventListener('selectstart', handleSelectStart);
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.removeEventListener('selectstart', handleSelectStart);
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

  const handleStepSelect = (stepId) => {
    const step = syllabusSteps?.find((s) => s?.id === stepId);
    if (step && !step?.isLocked) setCurrentStepId(stepId);
  };

  // const handleCompleteStep = (stepId) => {
  //   setSyllabusSteps(prevSteps => prevSteps.map((step, index) => {

  //     if (step.id === stepId) return { ...step, isCompleted: true, progress: 100, completedAt: new Date().toISOString() };
  //     const prevIndex = prevSteps.findIndex(s => s.id === stepId);
  //     if (index === prevIndex + 1) return { ...step, isLocked: false };
  //     return step;
  //   }));
  // };

  const handleCompleteStep = (stepId) => {
    setSyllabusSteps(prevSteps => prevSteps.map((step, index) => {
      if (step.id === stepId) {
        const stepCompleted = step.topics[0]?.subTopics?.every(sub => sub.managerDecision) ?? false;

        return {
          ...step,
          isCompleted: stepCompleted,
          progress: stepCompleted ? 100 : 0,
          completedAt: stepCompleted ? new Date().toISOString() : null,
        };
      }

      // Only unlock the next step if current step is actually completed
      const prevIndex = prevSteps.findIndex(s => s.id === stepId);
      if (index === prevIndex + 1 && prevSteps[prevIndex].topics[0]?.subTopics?.every(sub => sub.managerDecision)) {
        return { ...step, isLocked: false };
      }

      return step;
    }));
  };

  //   setSyllabusSteps(prevSteps => prevSteps.map((step) => {
  //     if (step.id === stepId) {
  //       const stepCompleted = step.topics[0]?.subTopics?.length > 0
  //         ? step.topics[0].subTopics.every(sub => sub.managerDecision)
  //         : false;

  //       return {
  //         ...step,
  //         isCompleted: stepCompleted,
  //         progress: 100,
  //         completedAt: new Date().toISOString()
  //       };
  //     }
  //     return step;
  //   }));
  // };

  const handleNextStep = () => {
    if (currentStepIndex < syllabusSteps?.length - 1) {
      const nextStep = syllabusSteps?.[currentStepIndex + 1];
      if (!nextStep?.isLocked) setCurrentStepId(nextStep?.id);
=======
  // ======================================================
  // STEP SELECT (BLOCK LOCKED STEPS)
  // ======================================================
  const handleStepSelect = (stepId) => {
    const step = syllabusSteps.find(s => s.id === stepId);
    if (!step || step.isLocked) return;   // 🔒 BLOCK
    setCurrentStepId(stepId);
  };

  // ======================================================
  // SUBTOPIC COMPLETION (NEW – CORE FIX)
  // ======================================================
  const handleSubTopicComplete = (stepId, subTopicId) => {
    setSyllabusSteps(prev =>
      prev.map(step => {
        if (step.id !== stepId) return step;

        const updatedSubs = step.topics[0].subTopics.map(sub =>
          sub.id === subTopicId ? { ...sub, completed: true } : sub
        );

        const completedCount = updatedSubs.filter(s => s.completed).length;
        const total = updatedSubs.length;
        const isStepCompleted = completedCount === total;

        return {
          ...step,
          topics: [{ ...step.topics[0], subTopics: updatedSubs }],
          progress: Math.round((completedCount / total) * 100),
          isCompleted: isStepCompleted
        };
      })
    );
  };

  // ======================================================
  // STEP COMPLETE → UNLOCK NEXT STEP (FIXED)
  // ======================================================
  const handleCompleteStep = (stepId) => {
    setSyllabusSteps(prev => {
      const updated = [...prev];
      const index = updated.findIndex(s => s.id === stepId);

      updated[index].isCompleted = true;
      updated[index].progress = 100;

      if (index + 1 < updated.length) {
        updated[index + 1].isLocked = false;   // 🔓 UNLOCK NEXT
      }

      return updated;
    });
  };

  // ======================================================
  // NAVIGATION (UNCHANGED)
  // ======================================================
  const handleNextStep = () => {
    if (
      currentStepIndex < syllabusSteps.length - 1 &&
      !syllabusSteps[currentStepIndex + 1].isLocked
    ) {
      setCurrentStepId(syllabusSteps[currentStepIndex + 1].id);
>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382
    }
  };

  const handlePreviousStep = () => {
<<<<<<< HEAD
    if (currentStepIndex > 0) setCurrentStepId(syllabusSteps?.[currentStepIndex - 1]?.id);
  };

  const canGoNext = currentStepIndex < syllabusSteps?.length - 1 && !syllabusSteps?.[currentStepIndex + 1]?.isLocked;
  const canGoPrevious = currentStepIndex > 0;

  const handleSessionExpired = () => { setSessionActive(false); navigate('/trainee-dashboard'); };
  const handleLogout = () => { navigate('/trainee-dashboard'); };

  if (!sessionActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8 bg-card rounded-lg elevation-2 max-w-md">
          <Icon name="Shield" size={48} className="text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Session Expired</h2>
          <p className="text-muted-foreground mb-4"> Your secure learning session has expired. Please return to your dashboard. </p>
          <Button variant="default" onClick={() => navigate('/trainee-dashboard')} iconName="ArrowLeft" iconPosition="left">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="trainee" userName={traineeInfo?.name} onLogout={handleLogout} />
=======
    if (currentStepIndex > 0) {
      setCurrentStepId(syllabusSteps[currentStepIndex - 1].id);
    }
  };

  const canGoNext =
    currentStepIndex < syllabusSteps.length - 1 &&
    !syllabusSteps[currentStepIndex + 1].isLocked;

  const canGoPrevious = currentStepIndex > 0;

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="trainee"
        userName={traineeInfo?.name}
        onLogout={() => navigate('/trainee-dashboard')}
      />

>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382
      <div className="pt-16 flex h-screen">
        <StepNavigationSidebar steps={syllabusSteps} currentStepId={currentStepId} onStepSelect={handleStepSelect} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className="flex-1 flex flex-col overflow-hidden">
<<<<<<< HEAD
          <div className="bg-surface border-b border-border px-6 py-3">
            <NavigationBreadcrumb userRole="trainee" />
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden" ref={contentRef}>
              <ContentDisplay currentStep={currentStep} traineeInfo={traineeInfo} onStepComplete={handleCompleteStep} onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} canGoNext={canGoNext} canGoPrevious={canGoPrevious} />
            </div>
            {showProgressTracker && <div className="w-80 border-l border-border overflow-y-auto">
              <ProgressTracker currentStep={currentStep} totalSteps={syllabusSteps?.length} completedSteps={completedSteps} timeSpent={45} estimatedTimeRemaining={180} className="m-4" />
            </div>}
          </div>
        </div>
        <Button variant="default" size="icon" onClick={() => setShowProgressTracker(!showProgressTracker)} className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full elevation-2" iconName={showProgressTracker ? "X" : "BarChart3"} iconSize={20} title={showProgressTracker ? "Hide Progress" : "Show Progress"} />
      </div>
      <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 text-xs z-30 max-w-xs">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={14} className="text-warning" />
          <span className="text-muted-foreground">This content is protected and monitored for security.</span>
=======
          <NavigationBreadcrumb userRole="trainee" />

          <ContentDisplay
            currentStep={currentStep}
            traineeInfo={traineeInfo}
            onSubTopicComplete={handleSubTopicComplete}  // 🔧 NEW
            onStepComplete={handleCompleteStep}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
>>>>>>> 3e511cb31298719158ddcbdbe58177f24ef64382
        </div>
      </div>
    </div>
  );
};

export default SyllabusContentViewer;
