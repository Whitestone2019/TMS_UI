// import React, { useState, useEffect, use } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/ui/Header';
// import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
// import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
// import TraineeSelector from './components/TraineeSelector';
// import AssessmentForm from './components/AssessmentForm';
// import AssessmentHistory from './components/AssessmentHistory';
// import AssessmentDetailsModal from './components/AssessmentDetailsModal';
// import Icon from '../../components/AppIcon';
// import Button from '../../components/ui/Button';
// import { fetchAllTrainees, fetchAssessmentsByTrainee, fetchSyllabusProgressByEmpId } from '../../api_service';

// const AssessmentEntry = () => {
//   const navigate = useNavigate();
//   const [selectedTrainee, setSelectedTrainee] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [selectedAssessment, setSelectedAssessment] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [historyAssessments, setHistoryAssessments] = useState([]);
//   // Mock data for trainees
//   const [trainees, setTrainees] = useState([]);

//   // const mockTrainees = [
//   //   {
//   //     id: "TRN001",
//   //     name: "Sarah Johnson",
//   //     employeeId: "EMP2024001",
//   //     currentStep: 3,
//   //     status: "active",
//   //     lastAssessment: "Oct 15, 2024",
//   //     email: "sarah.johnson@company.com",
//   //     joinDate: "2024-09-01"
//   //   },
//   //   {
//   //     id: "TRN002", 
//   //     name: "Michael Chen",
//   //     employeeId: "EMP2024002",
//   //     currentStep: 2,
//   //     status: "active",
//   //     lastAssessment: "Oct 12, 2024",
//   //     email: "michael.chen@company.com",
//   //     joinDate: "2024-09-15"
//   //   },
//   //   {
//   //     id: "TRN003",
//   //     name: "Emily Rodriguez",
//   //     employeeId: "EMP2024003", 
//   //     currentStep: 4,
//   //     status: "pending",
//   //     lastAssessment: "Oct 10, 2024",
//   //     email: "emily.rodriguez@company.com",
//   //     joinDate: "2024-08-20"
//   //   },
//   //   {
//   //     id: "TRN004",
//   //     name: "David Kim",
//   //     employeeId: "EMP2024004",
//   //     currentStep: 5,
//   //     status: "completed",
//   //     lastAssessment: "Oct 18, 2024",
//   //     email: "david.kim@company.com",
//   //     joinDate: "2024-08-01"
//   //   },
//   //   {
//   //     id: "TRN005",
//   //     name: "Lisa Thompson",
//   //     employeeId: "EMP2024005",
//   //     currentStep: 1,
//   //     status: "active",
//   //     lastAssessment: "Never",
//   //     email: "lisa.thompson@company.com",
//   //     joinDate: "2024-10-01"
//   //   }
//   // ];

//   // Mock assessment history data
//   // const mockAssessments = {
//   //   "TRN001": [
//   //         {
//   //           id: "ASS001",
//   //           traineeId: "TRN001",
//   //           date: "2024-10-15",
//   //           type: "weekly",
//   //           marks: 85,
//   //           maxMarks: 100,
//   //           percentage: 85,
//   //           remarks: "Good understanding of core concepts. Shows improvement in practical applications. Needs to work on time management during assessments.",
//   //           strengths: "Strong analytical thinking and problem-solving skills. Good communication during presentations.",
//   //           improvements: "Time management and attention to detail in documentation.",
//   //           recommendations: "Practice more coding exercises and focus on code optimization techniques.",

//   //           isDraft: false,
//   //           submittedAt: "2024-10-15T14:30:00Z",
//   //           currentStep: 3

//   //         },
//   //     {
//   //       id: "ASS002",
//   //       traineeId: "TRN001", 
//   //       date: "2024-10-08",
//   //       type: "weekly",
//   //       marks: 78,
//   //       maxMarks: 100,
//   //       percentage: 78,
//   //       remarks: "Satisfactory performance with room for improvement. Understanding of basic concepts is solid.",
//   //       strengths: "Good theoretical knowledge and willingness to learn.",
//   //       improvements: "Practical implementation and debugging skills.",
//   //       recommendations: "More hands-on practice with real-world scenarios.",
//   //       isDraft: false,
//   //       submittedAt: "2024-10-08T16:45:00Z",
//   //       currentStep: 2
//   //     }
//   //   ],
//   //   "TRN002": [
//   //     {
//   //       id: "ASS003",
//   //       traineeId: "TRN002",
//   //       date: "2024-10-12",
//   //       type: "weekly", 
//   //       marks: 92,
//   //       maxMarks: 100,
//   //       percentage: 92,
//   //       remarks: "Excellent performance across all areas. Demonstrates strong technical skills and leadership potential.",
//   //       strengths: "Outstanding technical skills, great team collaboration, and innovative thinking.",
//   //       improvements: "Could benefit from more exposure to advanced topics.",
//   //       recommendations: "Consider mentoring junior trainees and taking on more challenging projects.",
//   //       isDraft: false,
//   //       submittedAt: "2024-10-12T11:20:00Z",
//   //       currentStep: 2
//   //     }
//   //   ],
//   //   "TRN003": [
//   //     {
//   //       id: "ASS004",
//   //       traineeId: "TRN003",
//   //       date: "2024-10-10",
//   //       type: "milestone",
//   //       marks: 88,
//   //       maxMarks: 100,
//   //       percentage: 88,
//   //       remarks: "Strong milestone performance. Ready to progress to next level with continued support.",
//   //       strengths: "Excellent project management skills and attention to detail.",
//   //       improvements: "Technical depth in specialized areas.",
//   //       recommendations: "Focus on advanced technical certifications and specialized training.",
//   //       isDraft: false,
//   //       submittedAt: "2024-10-10T13:15:00Z",
//   //       currentStep: 4
//   //     }
//   //   ]
//   // };





//   useEffect(() => {
//     // Fetch initial data if needed
//     const fetchData = async () => {
//       try {
//         const trainees = await fetchAllTrainees();
//         setTrainees(trainees.data);
//         console.log('Fetched trainees:', trainees.data);

//       } catch (error) {
//         console.error("Error fetching trainees:", error);
//       }
//     };
//     fetchData();
//   }, []);



//   // const handleTraineeSelect = async (trainee) => {
//   //   console.log('Selected trainee:', trainee);
//   //   try {
//   //     const trainees = await fetchAllTrainees();
//   //     setTrainees(trainees.data);
//   //     console.log('Fetched trainees:', trainees.data);

//   //   } catch (error) {
//   //     console.error("Error fetching trainees:", error);
//   //   }

//   //   setSelectedTrainee(trainee);
//   //   try {
//   //     const data = await getTraineeAssessments(trainee?.empid);
//   //     setHistoryAssessments(data);
//   //   } catch (error) {
//   //     console.error("Error fetching assessments:", error);
//   //     setHistoryAssessments([]);
//   //   }


//   // };


//   const handleTraineeSelect = async (trainee) => {
//     if (!trainee?.empid) return;

//     try {
//       const syllabus = await fetchSyllabusProgressByEmpId(trainee.empid);

//       const derivedStep = deriveCurrentStepFromSyllabus(syllabus);

//       setSelectedTrainee({
//         ...trainee,
//         currentStep: derivedStep   // 🔥 REAL STEP
//       });

//       const assessments = await getTraineeAssessments(trainee.empid);
//       setHistoryAssessments(assessments);

//     } catch (err) {
//       console.error(err);
//     }
//   };



//   const handleSaveAssessment = async (assessmentData) => {
//     setIsLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       console.log('Assessment saved:', assessmentData);
//       setShowSuccessMessage(true);

//       // Auto-hide success message after 3 seconds
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//       }, 3000);

//     } catch (error) {
//       console.error('Error saving assessment:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveDraft = async (draftData) => {
//     try {
//       // Simulate API call for draft save
//       await new Promise(resolve => setTimeout(resolve, 800));
//       console.log('Draft saved:', draftData);
//     } catch (error) {
//       console.error('Error saving draft:', error);
//     }
//   };

//   const handleCancel = () => {
//     setSelectedTrainee(null);
//   };

//   const handleViewAssessmentDetails = (assessment) => {
//     setSelectedAssessment(assessment);
//     setShowDetailsModal(true);
//   };

//   const handleEditAssessment = (assessment) => {
//     setShowDetailsModal(false);
//     // Logic to populate form with assessment data for editing
//     console.log('Edit assessment:', assessment);
//   };

//   const handleLogout = () => {
//     navigate('/');
//   };

//   const handleSessionExpired = () => {
//     navigate('/');
//   };
//   const deriveCurrentStepFromSyllabus = (syllabusList = []) => {
//     let derivedStep = 1;

//     syllabusList.forEach(syl => {
//       syl.subTopics?.forEach(sub => {
//         const completed = sub.stepProgress?.some(p => p?.complete === true);
//         if (completed) {
//           derivedStep = Math.max(derivedStep, sub.stepNumber + 1);
//         }
//       });
//     });

//     return derivedStep; // ✅ CORRECT
//   };

//   const getTraineeAssessments = async (traineeId) => {
//     try {
//       // In real implementation, fetch assessments from API
//       const response = await fetchAssessmentsByTrainee(traineeId);
//       console.log('Fetched assessments for trainee:', response);

//       const normalized = (response.data ?? []).map(a => ({
//         assessmentId: a.assessmentId,
//         date: a.assessmentDate ?? null,
//         type: a.assessmentType ?? '',
//         marks: Number(a.marks ?? 0),
//         maxMarks: Number(a.maxMarks ?? 0),
//         percentage: Number(a.percentage ?? 0),
//         remarks: a.remarks ?? '',
//         strengths: a.strengths ?? '',
//         improvements: a.improvements ?? '',
//         recommendations: a.recommendations ?? '',
//         isDraft: a.currentStep !== 4,
//         submittedAt: a.submittedAt,
//         currentStep: a.currentStep,
//         user: a.user
//       }));
//       console.log('Normalized assessments:', normalized);
//       return normalized || [];
//     } catch (err) {
//       console.error("Error fetching assessments for trainee:", err);
//     }
//     // return mockAssessments?.[traineeId] || [];
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header
//         userRole="manager"
//         userName="Manager Smith"
//         onLogout={handleLogout}
//       />
//       <SessionTimeoutHandler
//         sessionDuration={30}
//         warningTime={5}
//         onSessionExpired={handleSessionExpired}
//         onSessionExtended={() => { }}
//         isActive={true}
//       />
//       <main className="pt-16">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           {/* Breadcrumb Navigation */}
//           <NavigationBreadcrumb userRole="manager" className="mb-6" />

//           {/* Page Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">Assessment Entry</h1>
//               <p className="text-muted-foreground">
//                 Enter weekly evaluation marks and feedback for trainees
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               onClick={() => navigate('/manager-dashboard')}
//               iconName="ArrowLeft"
//               iconPosition="left"
//             >
//               Back to Dashboard
//             </Button>
//           </div>

//           {/* Success Message */}
//           {showSuccessMessage && (
//             <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center">
//               <Icon name="CheckCircle" size={20} className="text-success mr-3" />
//               <div className="flex-1">
//                 <p className="text-success font-medium">Assessment saved successfully!</p>
//                 <p className="text-success/80 text-sm">The assessment has been recorded and the trainee will be notified.</p>
//               </div>
//             </div>
//           )}

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             {/* Left Column - Trainee Selection */}
//             <div className="xl:col-span-1">
//               <TraineeSelector
//                 selectedTrainee={selectedTrainee}
//                 onTraineeSelect={handleTraineeSelect}
//                 trainees={trainees.length ? trainees : []}
//               />
//             </div>

//             {/* Right Column - Assessment Form and History */}
//             <div className="xl:col-span-2 space-y-8">
//               {/* Assessment Form */}
//               <AssessmentForm
//                 trainee={selectedTrainee}
//                 onSave={handleSaveAssessment}
//                 onSaveDraft={handleSaveDraft}
//                 onCancel={handleCancel}
//                 isLoading={isLoading}
//               />

//               {/* Assessment History */}
//               {selectedTrainee && (
//                 <AssessmentHistory
//                   trainee={selectedTrainee}
//                   assessments={historyAssessments}
//                   onViewDetails={handleViewAssessmentDetails}
//                 />
//               )}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="mt-12 p-6 bg-card border border-border rounded-lg">
//             <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Button
//                 variant="outline"
//                 onClick={() => navigate('/progress-reports')}
//                 iconName="TrendingUp"
//                 iconPosition="left"
//                 fullWidth
//               >
//                 View Progress Reports
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => navigate('/interview-scheduling')}
//                 iconName="Calendar"
//                 iconPosition="left"
//                 fullWidth
//               >
//                 Schedule Interviews
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => navigate('/manager-dashboard')}
//                 iconName="LayoutDashboard"
//                 iconPosition="left"
//                 fullWidth
//               >
//                 Manager Dashboard
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* Assessment Details Modal */}
//       <AssessmentDetailsModal
//         assessment={selectedAssessment}
//         trainee={selectedTrainee}
//         isOpen={showDetailsModal}
//         onClose={() => setShowDetailsModal(false)}
//         onEdit={handleEditAssessment}
//       />
//     </div>
//   );
// };

// export default AssessmentEntry;


import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import TraineeSelector from './components/TraineeSelector';
import AssessmentForm from './components/AssessmentForm';
import AssessmentHistory from './components/AssessmentHistory';
import AssessmentDetailsModal from './components/AssessmentDetailsModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { fetchAllTrainees, fetchAssessmentsByTrainee } from '../../api_service';

const AssessmentEntry = () => {
  const navigate = useNavigate();
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [historyAssessments, setHistoryAssessments] = useState([]);
  // Mock data for trainees
  const [trainees, setTrainees] = useState([]);

  // const mockTrainees = [
  //   {
  //     id: "TRN001",
  //     name: "Sarah Johnson",
  //     employeeId: "EMP2024001",
  //     currentStep: 3,
  //     status: "active",
  //     lastAssessment: "Oct 15, 2024",
  //     email: "sarah.johnson@company.com",
  //     joinDate: "2024-09-01"
  //   },
  //   {
  //     id: "TRN002", 
  //     name: "Michael Chen",
  //     employeeId: "EMP2024002",
  //     currentStep: 2,
  //     status: "active",
  //     lastAssessment: "Oct 12, 2024",
  //     email: "michael.chen@company.com",
  //     joinDate: "2024-09-15"
  //   },
  //   {
  //     id: "TRN003",
  //     name: "Emily Rodriguez",
  //     employeeId: "EMP2024003", 
  //     currentStep: 4,
  //     status: "pending",
  //     lastAssessment: "Oct 10, 2024",
  //     email: "emily.rodriguez@company.com",
  //     joinDate: "2024-08-20"
  //   },
  //   {
  //     id: "TRN004",
  //     name: "David Kim",
  //     employeeId: "EMP2024004",
  //     currentStep: 5,
  //     status: "completed",
  //     lastAssessment: "Oct 18, 2024",
  //     email: "david.kim@company.com",
  //     joinDate: "2024-08-01"
  //   },
  //   {
  //     id: "TRN005",
  //     name: "Lisa Thompson",
  //     employeeId: "EMP2024005",
  //     currentStep: 1,
  //     status: "active",
  //     lastAssessment: "Never",
  //     email: "lisa.thompson@company.com",
  //     joinDate: "2024-10-01"
  //   }
  // ];

  // Mock assessment history data
  // const mockAssessments = {
  //   "TRN001": [
  //         {
  //           id: "ASS001",
  //           traineeId: "TRN001",
  //           date: "2024-10-15",
  //           type: "weekly",
  //           marks: 85,
  //           maxMarks: 100,
  //           percentage: 85,
  //           remarks: "Good understanding of core concepts. Shows improvement in practical applications. Needs to work on time management during assessments.",
  //           strengths: "Strong analytical thinking and problem-solving skills. Good communication during presentations.",
  //           improvements: "Time management and attention to detail in documentation.",
  //           recommendations: "Practice more coding exercises and focus on code optimization techniques.",

  //           isDraft: false,
  //           submittedAt: "2024-10-15T14:30:00Z",
  //           currentStep: 3

  //         },
  //     {
  //       id: "ASS002",
  //       traineeId: "TRN001", 
  //       date: "2024-10-08",
  //       type: "weekly",
  //       marks: 78,
  //       maxMarks: 100,
  //       percentage: 78,
  //       remarks: "Satisfactory performance with room for improvement. Understanding of basic concepts is solid.",
  //       strengths: "Good theoretical knowledge and willingness to learn.",
  //       improvements: "Practical implementation and debugging skills.",
  //       recommendations: "More hands-on practice with real-world scenarios.",
  //       isDraft: false,
  //       submittedAt: "2024-10-08T16:45:00Z",
  //       currentStep: 2
  //     }
  //   ],
  //   "TRN002": [
  //     {
  //       id: "ASS003",
  //       traineeId: "TRN002",
  //       date: "2024-10-12",
  //       type: "weekly", 
  //       marks: 92,
  //       maxMarks: 100,
  //       percentage: 92,
  //       remarks: "Excellent performance across all areas. Demonstrates strong technical skills and leadership potential.",
  //       strengths: "Outstanding technical skills, great team collaboration, and innovative thinking.",
  //       improvements: "Could benefit from more exposure to advanced topics.",
  //       recommendations: "Consider mentoring junior trainees and taking on more challenging projects.",
  //       isDraft: false,
  //       submittedAt: "2024-10-12T11:20:00Z",
  //       currentStep: 2
  //     }
  //   ],
  //   "TRN003": [
  //     {
  //       id: "ASS004",
  //       traineeId: "TRN003",
  //       date: "2024-10-10",
  //       type: "milestone",
  //       marks: 88,
  //       maxMarks: 100,
  //       percentage: 88,
  //       remarks: "Strong milestone performance. Ready to progress to next level with continued support.",
  //       strengths: "Excellent project management skills and attention to detail.",
  //       improvements: "Technical depth in specialized areas.",
  //       recommendations: "Focus on advanced technical certifications and specialized training.",
  //       isDraft: false,
  //       submittedAt: "2024-10-10T13:15:00Z",
  //       currentStep: 4
  //     }
  //   ]
  // };


  useEffect(() => {
    // Fetch initial data if needed
    const fetchData = async () => {
      try {
        const trainees = await fetchAllTrainees();
        setTrainees(trainees.data);
        console.log('Fetched trainees:', trainees.data);

      } catch (error) {
        console.error("Error fetching trainees:", error);
      }
    };
    fetchData();
  }, []);



  const handleTraineeSelect = async (trainee) => {
    console.log('Selected trainee:', trainee);
    try {
      const trainees = await fetchAllTrainees();
      setTrainees(trainees.data);
      console.log('Fetched trainees:', trainees.data);

    } catch (error) {
      console.error("Error fetching trainees:", error);
    }

    setSelectedTrainee(trainee);
    try {
      const data = await getTraineeAssessments(trainee?.trngid);
      setHistoryAssessments(data);
      console.log("Assessment data set:", data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setHistoryAssessments([]);
    }


  };


  // const handleSaveAssessment = async (assessmentData) => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 1500));

  //     console.log('Assessment saved:', assessmentData);
  //     setShowSuccessMessage(true);

  //     // Auto-hide success message after 3 seconds
  //     setTimeout(() => {
  //       setShowSuccessMessage(false);
  //     }, 3000);

  //     alert('Assessment saved successfully!');

  //   } catch (error) {
  //     console.error('Error saving assessment:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSaveDraft = async (draftData) => {
    try {
      // Simulate API call for draft save
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Draft saved:', draftData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleCancel = () => {
    setSelectedTrainee(null);
  };

  const handleViewAssessmentDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setShowDetailsModal(true);
  };

  const handleEditAssessment = (assessment) => {
    setShowDetailsModal(false);
    // Logic to populate form with assessment data for editing
    console.log('Edit assessment:', assessment);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSessionExpired = () => {
    navigate('/');
  };

  const getTraineeAssessments = async (traineeId) => {
    try {
      // In real implementation, fetch assessments from API
      const response = await fetchAssessmentsByTrainee(traineeId);
      console.log('Fetched assessments for trainee:', response);

      const normalized = (response.data ?? []).map(a => ({
        assessmentId: a.assessmentId,
        date: a.assessmentDate ?? null,
        type: a.assessmentType ?? '',
        marks: Number(a.marks ?? 0),
        maxMarks: Number(a.maxMarks ?? 0),
        percentage: Number(a.percentage ?? 0),
        remarks: a.remarks ?? '',
        strengths: a.strengths ?? '',
        improvements: a.improvements ?? '',
        recommendations: a.recommendations ?? '',

        submittedAt: a.submittedAt,
        currentStep: a.subTopics,
        user: a.user
      }));
      console.log('Normalized assessments:', normalized);
      return normalized || [];
    } catch (err) {
      console.error("Error fetching assessments for trainee:", err);
    }
    // return mockAssessments?.[traineeId] || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header

        userName={sessionStorage.getItem("userName") || "User"}
        userRole="manager"
        onLogout={handleLogout}
      />
      <SessionTimeoutHandler
        sessionDuration={30}
        warningTime={5}
        onSessionExpired={handleSessionExpired}
        onSessionExtended={() => { }}
        isActive={true}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <NavigationBreadcrumb userRole="manager" className="mb-6" />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Assessment Entry</h1>
              <p className="text-muted-foreground">
                Enter weekly evaluation marks and feedback for trainees
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/manager-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center">
              <Icon name="CheckCircle" size={20} className="text-success mr-3" />
              <div className="flex-1">
                <p className="text-success font-medium">Assessment saved successfully!</p>
                <p className="text-success/80 text-sm">The assessment has been recorded and the trainee will be notified.</p>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Trainee Selection */}
            <div className="xl:col-span-1">
              <TraineeSelector
                selectedTrainee={selectedTrainee}
                onTraineeSelect={handleTraineeSelect}
                trainees={trainees.length ? trainees : []}
              />
            </div>

            {/* Right Column - Assessment Form and History */}
            <div className="xl:col-span-2 space-y-8">
              {/* Assessment Form */}
              <AssessmentForm
                trainee={selectedTrainee}
                // onSave={handleSaveAssessment}
                onSaveDraft={handleSaveDraft}
                onCancel={handleCancel}
                isLoading={isLoading}
              />

              {/* Assessment History */}
              {selectedTrainee && (
                <AssessmentHistory
                  trainee={selectedTrainee}
                  assessments={historyAssessments}
                  onViewDetails={handleViewAssessmentDetails}
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <Button
                variant="outline"
                onClick={() => navigate('/progress-reports')}
                iconName="TrendingUp"
                iconPosition="left"
                fullWidth
              >
                View Progress Reports
              </Button> */}
              <Button
                variant="outline"
                onClick={() => navigate('/interview-scheduling')}
                iconName="Calendar"
                iconPosition="left"
                fullWidth
              >
                Schedule Interviews
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/manager-dashboard')}
                iconName="LayoutDashboard"
                iconPosition="left"
                fullWidth
              >
                Manager Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Assessment Details Modal */}
      <AssessmentDetailsModal
        assessment={selectedAssessment}
        trainee={selectedTrainee}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEdit={handleEditAssessment}
      />
    </div>
  );
};

export default AssessmentEntry;

