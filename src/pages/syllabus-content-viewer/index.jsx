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
import { updateStepProgress, fetchUserByEmpId,fetchStepByEmpId, startSubTopic } from '../../api_service';

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


  const currentStep = syllabusSteps?.find((step) => step?.id === currentStepId);
  const currentStepIndex = syllabusSteps?.findIndex((step) => step?.id === currentStepId);
  const completedSteps = syllabusSteps?.filter((step) => step?.isCompleted)?.length;

  const [timeSpent, setTimeSpent] = useState(currentStep?.durationSeconds || 0);

  const contentRef = useRef(null);
  sessionStorage.setItem("empid", "TRN001");
  const empid = sessionStorage.getItem("empid");


  useEffect(() => {
    setSubTopicIndex(0);
  }, [currentStepId]);


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
            startDate: user.createdAt || "2024-10-01", // or whatever
          });
        }
        // console.log("Trainee Info:", user); 
      } catch (err) {
        console.error("Failed to load trainee info", err);
      }
    };

    loadTraineeInfo();
  }, []);





  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       const response = await fetch("http://localhost:8080/api/syllabus/all");
  //       const result = await response.json();

  //       const apiData = result?.data || [];

  //       // console.log("Hisii"+JSON.stringify(apiData));
  //       const formattedSteps = apiData.map((item, index) => ({
  //         id: item?.id,
  //         stepNumber: index + 1,
  //         title: item?.title,
  //         description: item?.topic || "",
  //         isLocked: index !== 0,
  //         isCompleted: false,
  //         progress: 0,
  //         topics: [
  //           {
  //             title: item?.title || item?.topic,
  //             subTopics: item?.subTopics?.map(sub => ({
  //               id: sub.id,
  //               title: sub.name,
  //               name: sub.name,
  //               description: sub.description,
  //               filePath: sub.filePath,
  //               stepNumber: sub.stepNumber,
  //             })) || []
  //           }
  //         ]
  //       }));

  //       // console.log("Formatted Steps:", JSON.stringify(formattedSteps));

  //       setSyllabusSteps(formattedSteps);

  //       // Set first step as current
  //       if (formattedSteps.length > 0) {
  //         setCurrentStepId(formattedSteps[0].id);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);


  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch syllabus
      const response = await fetch("http://localhost:8080/api/syllabus/all");
      const result = await response.json();
      const apiData = result?.data || [];

      // 2️⃣ Fetch completed steps/subtopics for this emp
      // const empId = sessionStorage.getItem("empid");
      const completedData = await fetchStepByEmpId(empid);
      // const completedData = progressResponse?.data || [];

      console.log("Completed Data:", JSON.stringify(completedData));

      // 3️⃣ Map and merge progress
      const formattedSteps = apiData.map((item, index) => {
        const stepProgress = completedData.find(s => s.stepId === item.id);
        console.log("Step Progress for stepId " + item.id + ": " + JSON.stringify(stepProgress));
        return {
          id: item?.id,
          stepNumber: index + 1,
          title: item?.title,
          description: item?.topic || "",
          isLocked: index !== 0 && !(stepProgress?.completed), // unlock if completed
          isCompleted: stepProgress?.completed || false,
          progress: stepProgress?.progress || 0,
          topics: [
            {
              title: item?.title || item?.topic,
              subTopics: item?.subTopics?.map(sub => {
                const subProgress = stepProgress?.subTopics?.find(st => st.subtopicId === sub.id);
                return {
                  id: sub.id,
                  title: sub.name,
                  name: sub.name,
                  description: sub.description,
                  filePath: sub.filePath,
                  stepNumber: sub.stepNumber,
                  completed: subProgress?.completed || false
                };
              }) || []
            }
          ]
        };
      });


      console.log("Formatted Steps with Progress:", JSON.stringify(formattedSteps));
      setSyllabusSteps(formattedSteps);

      // Set first incomplete step as current
      const firstIncompleteStep = formattedSteps.find(step => !step.isCompleted);
      setCurrentStepId(firstIncompleteStep?.id || formattedSteps[0]?.id);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  fetchData();
}, []);

  
  // SECURITY EVENT HANDLERS (kept same)
  const handleContextMenu = (e) => { e?.preventDefault(); return false; };
  const handleSelectStart = (e) => { e?.preventDefault(); return false; };
  const handleKeyDown = (e) => {
    // if (
    //   e?.ctrlKey && (e?.key === 's' || e?.key === 'p' || e?.key === 'c' || e?.key === 'a') ||
    //   e?.key === 'F12' ||
    //   e?.key === 'PrintScreen'
    // ) {
    //   e?.preventDefault();
    //   return false;
    // }
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
    console.log("Selected Step:", step);

    if (step && !step?.isLocked) {
      setCurrentStepId(stepId);
    }
  };

  // const handleStepSelect = async (stepId) => {
  //   console.log("Attempting to select step:", stepId);

  //   const step = syllabusSteps.find((s) => s.id === stepId);
  //   if (!step || step.isLocked) return;

  //   console.log("Starting step:", step);
  //   const firstSubTopic = step.topics?.[0]?.subTopics?.[0];
  //   if (!firstSubTopic) return;

  //   const payload = {
  //     empid:  empid,
  //     subtopicId: firstSubTopic.id,
  //     starttimeSeconds: Math.floor(Date.now() / 1000),
  //     complete: false,
  //     checker: false
  //   };

  //   console.log("Starting Subtopic with payload:", payload);
  //   try {
  //     await startSubTopic(payload);   // ✅ CORRECT
  //     setCurrentStepId(stepId);
  //   } catch (err) {
  //     console.error("Error starting subtopic:", err);
  //   }
  // };


  const handleCompleteStep = (stepId) => {

    setSyllabusSteps(prevSteps =>
      prevSteps.map((step, index) => {
        // complete current step
        if (step.id === stepId) {
          return {
            ...step,
            isCompleted: true,
            progress: 100,
            completedAt: new Date().toISOString()
          };
        }


        console.log(syllabusSteps.find(s => s.id === stepId));

        // unlock next step
        const prevIndex = prevSteps.findIndex(s => s.id === stepId);
        if (index === prevIndex + 1) {
          return { ...step, isLocked: false };
        }

        return step;
      })
    );
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
    // <SecureContentWrapper
    //   watermarkText={`${traineeInfo?.name} | ID: ${traineeInfo?.id} | CONFIDENTIAL TRAINING MATERIAL`}
    //   sessionTimeout={30}
    //   onSessionExpired={handleSessionExpired}
    //   enableScreenshotProtection={true}
    //   enableRightClickDisable={true}>

    <div className="min-h-screen bg-background">
      {/* <SessionTimeoutHandler
        sessionDuration={30}
        warningTime={5}
        onSessionExpired={handleSessionExpired}
        onSessionExtended={() => setSessionActive(true)}
        isActive={sessionActive}
      /> */}


      {/* Security Watermark */}
      {/* <SecurityWatermark traineeInfo={traineeInfo} /> */}

      <Header userRole="trainee" userName={traineeInfo?.name} onLogout={handleLogout} />

      <div className="pt-16 flex h-screen">
        {/* {currentStepId} */}
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
    //  </SecureContentWrapper>
  );

  // );

};

export default SyllabusContentViewer;