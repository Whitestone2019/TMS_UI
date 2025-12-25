// import React, { useEffect, useState } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';
// import axios from 'axios';

// const ProgressTracker = ({
//   empid,
//   onStepClick,
//   className = ''
// }) => {

//   const [subTopics, setSubTopics] = useState([]);
//   const [stepsStatus, setStepsStatus] = useState([]);

//   // -----------------------------------
//   // FETCH ALL SUBTOPICS
//   // -----------------------------------
//   useEffect(() => {
//     const fetchSubTopics = async () => {
//       try {
//         const res = await axios.get('/api/sub-topics');

//         // 🔥 IMPORTANT: clean invalid entries like [140,146]
//         const cleaned = (res.data || []).filter(
//           item => typeof item === 'object' && item.id
//         );

//         // sort by stepNumber
//         cleaned.sort((a, b) => a.stepNumber - b.stepNumber);

//         setSubTopics(cleaned);
//       } catch (err) {
//         console.error('Failed to fetch subtopics', err);
//       }
//     };

//     fetchSubTopics();
//   }, []);

//   // -----------------------------------
//   // FETCH USER PROGRESS
//   // -----------------------------------
//   useEffect(() => {
//     if (!empid) return;

//     const fetchProgress = async () => {
//       try {
//         const res = await axios.get(
//           `/api/step-progress/user/${empid}`
//         );
//         setStepsStatus(res.data || []);
//       } catch (err) {
//         console.error('Failed to fetch progress', err);
//       }
//     };

//     fetchProgress();
//   }, [empid]);

//   // -----------------------------------
//   // DERIVED VALUES
//   // -----------------------------------
//   const totalSteps = subTopics.length;
//   const completedSteps = stepsStatus.filter(s => s.completed).length;

//   const currentStep =
//     stepsStatus.find(s => s.current)?.stepNumber ||
//     subTopics[0]?.stepNumber ||
//     1;

//   const progressPercentage =
//     totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

//   // -----------------------------------
//   // STEP STATUS LOGIC
//   // -----------------------------------
//   const getStepStatus = (stepNumber) => {
//     const progress = stepsStatus.find(
//       s => s.stepNumber === stepNumber
//     );

//     if (!progress) return 'locked';
//     if (progress.completed) return 'completed';
//     if (progress.current) return 'current';
//     return 'locked';
//   };

//   const getStepIcon = (stepNumber) => {
//     const status = getStepStatus(stepNumber);
//     if (status === 'completed') return 'CheckCircle';
//     if (status === 'current') return 'PlayCircle';
//     return 'Lock';
//   };

//   return (
//     <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-foreground">
//             Learning Progress
//           </h2>
//           <p className="text-sm text-muted-foreground">
//             Step {currentStep} of {totalSteps} • {Math.round(progressPercentage)}% Complete
//           </p>
//         </div>
//         <div className="text-right">
//           <div className="text-2xl font-bold text-primary">
//             {completedSteps}/{totalSteps}
//           </div>
//           <div className="text-xs text-muted-foreground">
//             Steps Completed
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium text-foreground">
//             Overall Progress
//           </span>
//           <span className="text-sm text-muted-foreground">
//             {Math.round(progressPercentage)}%
//           </span>
//         </div>
//         <div className="w-full bg-muted rounded-full h-3">
//           <div
//             className="bg-primary rounded-full h-3 transition-all duration-500 ease-out"
//             style={{ width: `${progressPercentage}%` }}
//           />
//         </div>
//       </div>

//       {/* Steps Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {subTopics.map((step) => {
//           const status = getStepStatus(step.stepNumber);
//           const isClickable = status === 'completed' || status === 'current';

//           const progress = stepsStatus.find(
//             s => s.stepNumber === step.stepNumber
//           );

//           return (
//             <div
//               key={step.id}
//               className={`relative p-4 rounded-lg border transition-all duration-200
//                 ${status === 'current'
//                   ? 'border-primary bg-primary/5'
//                   : status === 'completed'
//                   ? 'border-success bg-success/5'
//                   : 'border-border bg-muted/30'}
//                 ${isClickable ? 'cursor-pointer hover:shadow-sm' : 'cursor-not-allowed'}
//               `}
//               onClick={() => {
//                 if (isClickable) {
//                   onStepClick && onStepClick(step.id);
//                 }
//               }}
//             >
//               {/* Icon */}
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center
//                   ${status === 'current'
//                     ? 'bg-primary text-primary-foreground'
//                     : status === 'completed'
//                     ? 'bg-success text-success-foreground'
//                     : 'bg-muted text-muted-foreground'}
//                 `}>
//                   <Icon name={getStepIcon(step.stepNumber)} size={16} />
//                 </div>
//                 <span className="text-xs font-medium text-muted-foreground">
//                   Step {step.stepNumber}
//                 </span>
//               </div>

//               {/* Content */}
//               <h3 className={`font-medium ${status === 'locked' ? 'text-muted-foreground' : 'text-foreground'}`}>
//                 {step.name}
//               </h3>
//               <p className={`text-sm ${status === 'locked' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
//                 {step.description}
//               </p>

//               {/* Buttons */}
//               {status === 'current' && (
//                 <div className="mt-3">
//                   <Button
//                     fullWidth
//                     size="sm"
//                     iconName="Play"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onStepClick(step.id);
//                     }}
//                   >
//                     Continue Learning
//                   </Button>
//                 </div>
//               )}

//               {status === 'completed' && (
//                 <div className="mt-3">
//                   <Button
//                     fullWidth
//                     size="sm"
//                     variant="outline"
//                     iconName="Eye"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onStepClick(step.id);
//                     }}
//                   >
//                     Review Content
//                   </Button>
//                 </div>
//               )}

//               {status === 'locked' && (
//                 <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
//                   <div className="text-center">
//                     <Icon name="Lock" size={24} className="mx-auto mb-1" />
//                     <p className="text-xs text-muted-foreground">
//                       Complete previous steps
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProgressTracker;


import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressTracker = ({
  currentStep = 1,
  totalSteps = 8,
  completedSteps = 0,
  onStepClick,
  className = '',
  stepsStatus = []

}) => {
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStepStatus = (stepNumber) => {
    const step = stepsStatus?.find(s => s.stepId === `step-${stepNumber}`);

    if (!step) return "locked";
    if (step.completed) return "completed";
    if (!step.locked) return "current";
    return "locked";
  };


  const getStepIcon = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'PlayCircle';
      default:
        return 'Lock';
    }
  };

  const getStepColor = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'current':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const steps = [
    { id: 1, title: 'Introduction to Programming', description: 'Basic concepts and fundamentals' },
    { id: 2, title: 'Data Structures', description: 'Arrays, objects, and collections' },
    { id: 3, title: 'Control Flow', description: 'Loops, conditions, and logic' },
    { id: 4, title: 'Functions & Methods', description: 'Reusable code blocks' },
    { id: 5, title: 'Object-Oriented Programming', description: 'Classes and inheritance' },
    { id: 6, title: 'Database Fundamentals', description: 'SQL and data management' },
    { id: 7, title: 'Web Development Basics', description: 'HTML, CSS, and JavaScript' },
    { id: 8, title: 'Final Project', description: 'Capstone project implementation' }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Learning Progress</h2>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps} • {Math.round(progressPercentage)}% Complete
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{completedSteps}/{totalSteps}</div>
          <div className="text-xs text-muted-foreground">Steps Completed</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-primary rounded-full h-3 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps?.map((step) => {
          const status = getStepStatus(step?.id);
          const isClickable = status === 'completed' || status === 'current';

          return (
            <div
              key={step?.id}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${status === 'current' ? 'border-primary bg-primary/5'
                : status === 'completed' ? 'border-success bg-success/5' : 'border-border bg-muted/30'
                } ${isClickable ? 'cursor-pointer hover:shadow-sm' : 'cursor-not-allowed'}`}
              onClick={() => isClickable && onStepClick && onStepClick(step?.id)}
            >
              {/* Step Number & Icon */}
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'current' ? 'bg-primary text-primary-foreground'
                  : status === 'completed' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                  <Icon
                    name={getStepIcon(step?.id)}
                    size={16}
                    className="text-current"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {step?.id}
                    </span>
                    {status === 'current' && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                        Current
                      </span>
                    )}
                    {status === 'completed' && (
                      <span className="px-2 py-0.5 bg-success text-success-foreground text-xs rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Step Content */}
              <div className="space-y-1">
                <h3 className={`font-medium ${status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                  {step?.title}
                </h3>
                <p className={`text-sm ${status === 'locked' ? 'text-muted-foreground/70' : 'text-muted-foreground'
                  }`}>
                  {step?.description}
                </p>
              </div>
              {/* Action Button */}
              {status === 'current' && (
                <div className="mt-3">
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Play"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                    onClick={(e) => {
                      e?.stopPropagation();
                      onStepClick && onStepClick(step?.id);
                    }}
                  >
                    Continue Learning
                  </Button>
                </div>
              )}
              {status === 'completed' && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                    onClick={(e) => {
                      e?.stopPropagation();
                      onStepClick && onStepClick(step?.id);
                    }}
                  >
                    Review Content
                  </Button>
                </div>
              )}
              {/* Lock Overlay */}
              {status === 'locked' && (
                <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Lock" size={24} className="text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Complete previous steps</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;