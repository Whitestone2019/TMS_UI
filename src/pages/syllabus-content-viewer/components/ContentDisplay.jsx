// import React, { useState, useEffect } from "react";
// import Icon from "../../../components/AppIcon";
// import Button from "../../../components/ui/Button";
// import PdfViewer from "./PdfViewer";
// import { updateStepProgress, getOverallProgressTime } from "../../../api_service";

// const ContentDisplay = ({
//   currentStep,
//   traineeInfo,
//   onStepComplete,
//   onNextStep,
//   onPreviousStep,
//   canGoNext,
//   canGoPrevious,
// }) => {


//   const [currentSubIndex, setCurrentSubIndex] = useState(0);
//   const [showCompletionModal, setShowCompletionModal] = useState(false);
//   const [fileData, setFileData] = useState(null);
//   const [timeSpent, setTimeSpent] = useState(0);

//   const empId = sessionStorage.getItem("empid");



//   // Timer refs
//   const accumulatedTimeRef = React.useRef(0);
//   const startTimeRef = React.useRef(Date.now());

//   const topic = currentStep?.topics?.[0] ?? { subTopics: [] };
//   const subTopics = Array.isArray(topic.subTopics) ? topic.subTopics : [];
//   const totalSubs = subTopics.length;
//   const completedSubs = subTopics.filter((s) => s?.completed).length;
//   const calcProgress = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;
//   const sub = subTopics[currentSubIndex] ?? null;
//   const isLastSub = currentSubIndex === subTopics.length - 1;
//   // const isLastStep = currentStep?.isLastStep ?? false;
//   // const isLastSubOfLastStep = isLastStep && isLastSub;

//   const allSteps = traineeInfo?.steps || [];
//   const currentIndex = allSteps.findIndex(s => s.id === currentStep.id);

//   const isLastStep = currentIndex === allSteps.length - 1;
//   const isLastSubOfLastStep = isLastStep && isLastSub;







//   useEffect(() => {
//     startTimeRef.current = Date.now();
//     setTimeSpent(accumulatedTimeRef.current);
//     setCurrentSubIndex(0);
//   }, [currentStep?.id]);

//   // -----------------------------
//   // Timer effect
//   // -----------------------------
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const delta = Math.floor((Date.now() - startTimeRef.current) / 1000);
//       setTimeSpent(accumulatedTimeRef.current + delta);
//     }, 1000);

//     return () => {
//       const delta = Math.floor((Date.now() - startTimeRef.current) / 1000);
//       accumulatedTimeRef.current += delta;
//       clearInterval(interval);
//     };
//   }, []);

//   // -----------------------------
//   // Backend progress update
//   // -----------------------------
//   const saveProgressToBackend = async (progressValue) => {
//     try {
//       await updateStepProgress(empId, currentStep.id, progressValue, accumulatedTimeRef.current);
//     } catch (err) {
//       console.error("Progress update error:", err);
//     }
//   };

//   const markSubtopicCompleted = () => {
//     if (!sub) return;
//     const updated = [...subTopics];
//     updated[currentSubIndex] = { ...updated[currentSubIndex], completed: true };
//     currentStep.topics[0].subTopics = updated;
//     const completedCount = updated.filter((s) => s.completed).length;
//     const progress = Math.round((completedCount / updated.length) * 100);
//     saveProgressToBackend(progress);
//   };

//   const nextSub = () => {
//     if (sub && !sub.completed) markSubtopicCompleted();
//     if (currentSubIndex < subTopics.length - 1) setCurrentSubIndex(currentSubIndex + 1);
//     else onNextStep();
//   };

//   const prevSub = () => {
//     if (currentSubIndex > 0) setCurrentSubIndex(currentSubIndex - 1);
//     else onPreviousStep();
//   };

//   const handleCompleteStep = () => {
//     if (completedSubs === totalSubs) onStepComplete(currentStep?.id);
//     else setShowCompletionModal(true);
//   };

//   const confirmCompletion = async () => {
//     setShowCompletionModal(false);
//     await saveProgressToBackend(100); // Step complete
//     onStepComplete(currentStep?.id);

//   };

//   // -----------------------------
//   // Format time
//   // -----------------------------
//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
//   };

//   // -----------------------------
//   // File Preview
//   // -----------------------------
//   useEffect(() => {
//     if (!sub?.filePath) {
//       setFileData(null);
//       return;
//     }
//     const cleanFileName = sub.filePath.replace(/\\/g, "/").split("/").pop();
//     fetch(`http://localhost:8080/api/syllabus/preview?path=${cleanFileName}`)
//       .then((res) => { if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); return res.blob(); })
//       .then((blob) => setFileData({ url: URL.createObjectURL(blob), mime: blob.type, name: cleanFileName }))
//       .catch(() => setFileData({ error: true, message: "Unable to load this file." }));
//   }, [sub]);

//   // -----------------------------
//   // Render
//   // -----------------------------
//   if (!currentStep) return (
//     <div className="flex items-center justify-center h-full">
//       <div className="text-center">
//         <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-foreground mb-2">No Content Selected</h3>
//         <p className="text-muted-foreground">Select a step from the sidebar to begin learning.</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex flex-col h-full">
//       {/* HEADER */}
//       <div className="flex-shrink-0 bg-surface border-b border-border p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground mb-2">
//               Step {currentStep?.stepNumber}: {currentStep?.title}
//             </h1>
//             <p className="text-muted-foreground">{currentStep?.description}</p>
//           </div>
//           <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//             <div className="flex items-center space-x-2">
//               <Icon name="Clock" size={16} />
//               <span>Time: {formatTime(timeSpent)}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Icon name="Target" size={16} />
//               <span>Est: {currentStep?.estimatedTime}</span>
//             </div>
//           </div>
//         </div>
//         <div className="mt-4 px-6">
//           <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
//             <span>Step Progress</span>
//             <span>{calcProgress}%</span>
//           </div>
//           <div className="w-full bg-muted rounded-full h-2">
//             <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${calcProgress}%` }} />
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 overflow-y-auto p-6">
//         <div className="max-w-4xl mx-auto">
//           {sub ? (
//             <>
//               <h2 className="text-xl font-bold">{sub.title ?? sub.name}</h2>
//               <p className="text-gray-700 whitespace-pre-line mt-2">{sub.description}</p>
//               {sub?.filePath && fileData && !fileData.error && (
//                 <div className="bg-gray-50 mt-6 border rounded-xl shadow-lg p-4 max-h-[600px] overflow-auto custom-scrollbar">
//                   <div className="flex justify-between items-center mb-3">
//                     <h3 className="text-sm font-semibold text-gray-800">{fileData.name}</h3>
//                   </div>
//                   <div className="rounded-xl overflow-hidden border bg-white">
//                     {fileData.mime.startsWith("image/") ? (
//                       <img src={fileData.url} alt="Preview" className="w-full max-h-[550px] object-contain" />
//                     ) : fileData.mime === "application/pdf" ? (
//                       <PdfViewer url={fileData.url} />
//                     ) : (
//                       <div className="text-sm text-gray-500 italic p-4 text-center">Preview not available</div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               {fileData?.error && <div className="text-red-500 mt-4">{fileData.message}</div>}
//             </>
//           ) : (
//             <div className="text-center py-20 text-muted-foreground">No subtopics available for this step.</div>
//           )}
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="flex-shrink-0 bg-surface border-t border-border p-6 mb-10">
//         <div className="flex items-end justify-between">
//           <Button variant="outline" onClick={prevSub} iconName="ChevronLeft" iconPosition="left">
//             {currentSubIndex === 0 ? "Previous Step" : "Previous Topic"}
//           </Button>
//           <div className="flex items-center space-x-3">
//             <Button
//               variant="success"
//               onClick={() => { if (!sub?.completed) markSubtopicCompleted(); if (isLastSub) handleCompleteStep(); }}
//               iconName="CheckCircle"
//               iconPosition="left"
//               disabled={sub?.completed}
//             >
//               {!sub?.completed ? "Mark as Completed" : isLastSub ? "Complete Step" : "Mark as Completed"}
//             </Button>
//             <Button
//               variant="default"
//               onClick={nextSub}
//               iconName="ChevronRight"
//               iconPosition="right"
//               disabled={!sub?.completed || isLastSubOfLastStep}
//             >
//               {isLastSub
//                 ? (isLastStep ? "Next Step" : "Next Step")
//                 : "Next Topic"}
//             </Button>


//           </div>
//         </div>
//       </div>

//       {/* COMPLETION MODAL */}
//       {showCompletionModal && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-card p-6 rounded-lg elevation-3 max-w-md mx-4">
//             <div className="text-center">
//               <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-foreground mb-2">Complete This Step?</h3>
//               <p className="text-muted-foreground mb-6">Make sure you have reviewed all subtopics before completing this step.</p>
//               <div className="flex space-x-3">
//                 <Button variant="outline" onClick={() => setShowCompletionModal(false)} className="flex-1">Review More</Button>
//                 <Button variant="success" onClick={confirmCompletion} className="flex-1">Complete Step</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContentDisplay;



import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import PdfViewer from "./PdfViewer";

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
  const [fileData, setFileData] = useState(null);
  const [showFile, setShowFile] = useState(false);

  const topic = currentStep?.topics?.[0] ?? { subTopics: [] };
  const subTopics = Array.isArray(topic.subTopics) ? topic.subTopics : [];
  const totalSubs = subTopics.length;
  const completedSubs = subTopics.filter((s) => s?.completed).length;

  const calcProgress =
    totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  const sub = subTopics[currentSubIndex] ?? null;
  const isLastSub = currentSubIndex === subTopics.length - 1;
  //const sub = subTopics[currentSubIndex] ?? null;
  // const isLastSub = currentSubIndex === subTopics.length - 1;
  const allSteps = traineeInfo?.steps || [];
  const currentIndex = allSteps.findIndex(s => s.id === currentStep.id);

  const isLastStep = currentIndex === allSteps.length - 1;
  const isLastSubOfLastStep = isLastStep && isLastSub;

  // Reset subtopic when step changes
  useEffect(() => setCurrentSubIndex(0), [currentStep?.id]);

  // Timer
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

    return hours > 0 ? `${hours}h ${minutes}m ${secs}s` : `${minutes}m ${secs}s`;
  };

  // -----------------------------
  // NEW FUNCTION (Non Breaking)
  // -----------------------------
  const getPreviewUrl = () => {
    if (!fileData || !fileData.url || !fileData.mime) return null;

    const isOffice =
      fileData.mime.includes("word") ||
      fileData.mime.includes("presentation") ||
      fileData.mime.includes("excel") ||
      fileData.name.endsWith(".doc") ||
      fileData.name.endsWith(".docx") ||
      fileData.name.endsWith(".pptx") ||
      fileData.name.endsWith(".xlsx");

    // Office → Microsoft Office Viewer (NO redirect issue)
    if (isOffice) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        fileData.url
      )}`;
    }

    // PDF → direct blob
    if (fileData.mime === "application/pdf") {
      return fileData.url;
    }

    // Images → blob
    if (
      fileData.mime.startsWith("image/") ||
      fileData.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)
    ) {
      return fileData.url;
    }

    return fileData.url;
  };

  // Fetch file blob from backend
  useEffect(() => {
    if (!sub?.filePath) {
      setFileData(null);
      return;
    }

    // Extract only filename (IMPORTANT FIX)
    const cleanFileName = sub.filePath.replace(/\\/g, "/").split("/").pop();

    fetch(`http://localhost:8080/api/syllabus/preview?path=${cleanFileName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        setFileData({
          url: URL.createObjectURL(blob),
          mime: blob.type,
          name: cleanFileName,
        });
      })
      .catch((err) => {
        console.error("Error loading file:", err);
        setFileData({ error: true, message: "Unable to load this file." });
      });
  }, [sub]);

  const markSubtopicCompleted = () => {
    if (!sub) return;
    const updated = [...subTopics];
    updated[currentSubIndex] = {
      ...updated[currentSubIndex],
      completed: true,
    };
    currentStep.topics[0].subTopics = updated;
  };

  const nextSub = () => {
    if (sub && !sub.completed) markSubtopicCompleted();
    if (currentSubIndex < subTopics.length - 1) {
      setCurrentSubIndex(currentSubIndex + 1);
    } else {
      onNextStep();
    }
  };

  const prevSub = () => {
    if (currentSubIndex > 0) setCurrentSubIndex(currentSubIndex - 1);
    else onPreviousStep();
  };

  const handleCompleteStep = () => {
    if (completedSubs === totalSubs) onStepComplete(currentStep?.id);
    else setShowCompletionModal(true);
  };

  const confirmCompletion = () => {
    setShowCompletionModal(false);
    onStepComplete(currentStep?.id);
  };

  if (!currentStep)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon
            name="BookOpen"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Content Selected
          </h3>
          <p className="text-muted-foreground">
            Select a step from the sidebar to begin learning.
          </p>
        </div>
      </div>
    );

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

              {sub?.filePath && fileData && !fileData.error && (
                <div className="bg-gray-50 mt-6 border rounded-xl shadow-lg p-4 max-h-[600px] overflow-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {fileData.name}
                    </h3>
                  </div>

                  <div className="rounded-xl overflow-hidden border bg-white">
                    {fileData.mime.startsWith("image/") ? (
                      <img
                        src={fileData.url}
                        alt="Preview"
                        className="w-full max-h-[550px] object-contain"
                      />
                    ) : fileData.mime === "application/pdf" ? (
                      <PdfViewer url={fileData.url} />
                    ) : (
                      <div className="text-sm text-gray-500 italic p-4 text-center">
                        Preview not available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {fileData?.error && (
                <div className="text-red-500 mt-4">{fileData.message}</div>
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
      {/* <div className="flex-shrink-0 bg-surface border-t border-border p-6 mb-10">
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
            <Button
              variant="success"
              onClick={() => {
                if (!sub?.completed) markSubtopicCompleted();
                if (isLastSub) handleCompleteStep();
              }}
              iconName="CheckCircle"
              iconPosition="left"
            >
              {!sub?.completed
                ? "Mark as Completed"
                : isLastSub
                  ? "Complete Step"
                  : "Mark as Completed"}
            </Button>

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
      </div> */}



      {/* FOOTER */}
      <div className="flex-shrink-0 bg-surface border-t border-border p-6 mb-10">
        <div className="flex items-end justify-between">
          <Button variant="outline" onClick={prevSub} iconName="ChevronLeft" iconPosition="left">
            {currentSubIndex === 0 ? "Previous Step" : "Previous Topic"}
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              variant="success"
              onClick={() => { if (!sub?.completed) markSubtopicCompleted(); if (isLastSub) handleCompleteStep(); }}
              iconName="CheckCircle"
              iconPosition="left"
              disabled={sub?.completed}
            >
              {!sub?.completed ? "Mark as Completed" : isLastSub ? "Complete Step" : "Mark as Completed"}
            </Button>
            <Button
              variant="default"
              onClick={nextSub}
              iconName="ChevronRight"
              iconPosition="right"
              disabled={!sub?.completed || isLastSubOfLastStep}
            >
              {isLastSub
                ? (isLastStep ? "Next Step" : "Next Step")
                : "Next Topic"}
            </Button>


          </div>
        </div>
      </div>

      {/* COMPLETION MODAL */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg elevation-3 max-w-md mx-4">
            <div className="text-center">
              <Icon
                name="CheckCircle"
                size={48}
                className="text-success mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Complete This Step?
              </h3>
              <p className="text-muted-foreground mb-6">
                Make sure you have reviewed all subtopics before completing this
                step.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1"
                >
                  Review More
                </Button>
                <Button
                  variant="success"
                  onClick={confirmCompletion}
                  className="flex-1"
                >
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
