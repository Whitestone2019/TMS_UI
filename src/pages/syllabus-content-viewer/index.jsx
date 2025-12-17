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
import {
  updateStepProgress,
  fetchUserByEmpId,
  fetchStepByEmpId,
  startSubTopic
} from '../../api_service';

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
      }
    };
    loadTraineeInfo();
  }, []);

  // ======================================================
  // FETCH SYLLABUS & INITIAL LOCKING (FIXED)
  // ======================================================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

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
    };

    fetchData();
  }, []);

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
    }
  };

  const handlePreviousStep = () => {
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

      <div className="pt-16 flex h-screen">
        <StepNavigationSidebar
          steps={syllabusSteps}
          currentStepId={currentStepId}
          onStepSelect={handleStepSelect}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default SyllabusContentViewer;
