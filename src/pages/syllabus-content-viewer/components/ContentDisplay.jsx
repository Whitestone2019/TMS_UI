import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ContentDisplay = ({
  currentStep,
  traineeInfo,
  onStepComplete,
  onNextStep,
  onPreviousStep,
  canGoNext,
  canGoPrevious,
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // RESET SUBTOPIC WHEN STEP CHANGES
  useEffect(() => {
    setCurrentSubIndex(0);
  }, [currentStep?.id]);

  // TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    return `${minutes}m ${secs}s`;
  };

  // SUBTOPIC LOGIC
  const topic = currentStep?.topics?.[0] ?? { subTopics: [] };
  const subTopics = Array.isArray(topic.subTopics) ? topic.subTopics : [];

  const totalSubs = subTopics.length;
  const completedSubs = subTopics.filter((s) => s?.completed).length;
  const calcProgress =
    totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  const sub = subTopics[currentSubIndex] ?? null;

  // MARK SUBTOPIC COMPLETED
  const markSubtopicCompleted = () => {
    if (!sub) return;
    const updated = [...subTopics];
    updated[currentSubIndex] = { ...updated[currentSubIndex], completed: true };
    currentStep.topics[0].subTopics = updated; // update step topics
  };

  // NEXT SUBTOPIC / STEP
  const nextSub = () => {
    // Agar current subtopic complete nahi → mark complete
    if (sub && !sub.completed) {
      markSubtopicCompleted();
    }

    if (currentSubIndex < subTopics.length - 1) {
      setCurrentSubIndex(currentSubIndex + 1);
    } else {
      // Last subtopic → trigger next step
      onNextStep();
    }
  };

  const prevSub = () => {
    if (currentSubIndex > 0) {
      setCurrentSubIndex(currentSubIndex - 1);
    } else {
      onPreviousStep();
    }
  };

  // COMPLETE STEP
  const handleCompleteStep = () => {
    // only if all subtopics complete
    if (completedSubs === totalSubs) {
      onStepComplete(currentStep?.id);
    } else {
      setShowCompletionModal(true);
    }
  };

  const confirmCompletion = () => {
    setShowCompletionModal(false);
    onStepComplete(currentStep?.id);
  };

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Content Selected</h3>
          <p className="text-muted-foreground">Select a step from the sidebar to begin learning.</p>
        </div>
      </div>
    );
  }

  const isLastSub = currentSubIndex === subTopics.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex-shrink-0 bg-surface border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Step {currentStep?.stepNumber}: {currentStep?.title}
            </h1>
            <p className="text-muted-foreground">{currentStep?.description}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span>Time: {formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} />
              <span>Est: {currentStep?.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 px-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step Progress</span>
            <span>{calcProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${calcProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {sub ? (
            <>
              <h2 className="text-xl font-bold">{sub.title ?? sub.name}</h2>
              <p className="text-gray-700 whitespace-pre-line mt-2">{sub.description}</p>

              {sub.filePath && (
                <div className="mt-4">
                  <a
                    href={`http://localhost:8080/api/syllabus/file?path=${sub.filePath.replace("uploads/", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open File
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No subtopics available for this step.
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 bg-surface border-t border-border p-6 mb-10">
        <div className="flex items-end justify-between">

          <Button
            variant="outline"
            onClick={prevSub}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            {currentSubIndex === 0 ? "Previous Step" : "Previous Topic"}
          </Button>

          <div className="flex items-center space-x-3">
            {/* MARK COMPLETE / COMPLETE STEP */}
            <Button
              variant="success"
              onClick={() => {
                if (!sub?.completed) markSubtopicCompleted();
                if (isLastSub) handleCompleteStep();
              }}
              iconName="CheckCircle"
              iconPosition="left"
            >
              {!sub?.completed ? "Mark as Completed" : isLastSub ? "Complete Step" : "Mark as Completed"}
            </Button>

            {/* NEXT TOPIC / NEXT STEP */}
            <Button
              variant="default"
              onClick={nextSub}
              iconName="ChevronRight"
              iconPosition="right"
            >
              {isLastSub ? "Next Step" : "Next Topic"}
            </Button>
          </div>
        </div>
      </div>

      {/* COMPLETION MODAL */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg elevation-3 max-w-md mx-4">
            <div className="text-center">
              <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Complete This Step?</h3>
              <p className="text-muted-foreground mb-6">
                Make sure you have reviewed all subtopics before completing this step.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowCompletionModal(false)} className="flex-1">
                  Review More
                </Button>
                <Button variant="success" onClick={confirmCompletion} className="flex-1">
                  Complete Step
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContentDisplay;
