import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import ProgressTracker from '././components/ProgressTracker';
import CurrentStepContent from './components/CurrentStepContent';
import AssessmentHistory from './components/AssessmentHistory';
import InterviewSchedule from './components/InterviewSchedule';
//import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { fetchAssessmentsByTrainee } from '../../api_service';
import { fetchUserByEmpId } from "../../api_service";
import { fetchInterviewScheduleByEmpId } from "../../api_service"

const TraineeDashboard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [syllabus, setSyllabus] = useState([]);
  const [stepsStatus, setStepsStatus] = useState([]);
  const [overall, setOverall] = useState(0);
  const [assessments, setAssessments] = useState([]);
  const [traineeInfo, setTraineeInfo] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const empId = sessionStorage.setItem("empid", "WS10018");

  // const [traineeInfo] = useState({
  //   name: 'John Doe',
  //   id: 'TRN001',
  //   email: 'john.doe@company.com',
  //   startDate: '2024-10-01',
  //   program: 'Software Development Training'
  // });


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const empId = traineeInfo.id;

  //       // 1) Syllabus data
  //       const syllabusRes = await fetch(`http://localhost:8080/syllabus/all`);
  //       const syllabusData = await syllabusRes.json();
  //       setSyllabus(syllabusData);

  //       // 2) Steps progress data
  //       const stepsRes = await fetch(`http://localhost:8080/steps/${empId}`);
  //       const stepsData = await stepsRes.json();
  //       setStepsStatus(stepsData);

  //       // 3) Overall progress
  //       const overallRes = await fetch(`http://localhost:8080/overall/${empId}`);
  //       const overallData = await overallRes.json();
  //       setOverall(overallData.overallProgress);

  //       setIsLoading(false);
  //     } catch (err) {
  //       console.error("Error loading dashboard:", err);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
      } catch (err) {
        console.error("Failed to load trainee info", err);
      }
    };

    loadTraineeInfo();
  }, []);
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const empId = sessionStorage.getItem("empid") || "TRN001";

  //       // 🔥 Interview schedule API call
  //       const schedule = await fetchInterviewScheduleByEmpId(empId);
  //       setInterviews(schedule);

  //     } catch (err) {
  //       console.error("Error loading dashboard:", err);
  //     }
  //   };

  //   loadData();
  // }, []);


  useEffect(() => {
    const loadData = async () => {
      try {
        const empId = sessionStorage.getItem("empid") || "WS10009";

        // 🔥 Interview schedule API call
        const response = await fetchInterviewScheduleByEmpId(empId);

        if (response?.data) {
          // API returns: { status, success, message, data:[ ... ] }

          const cleanData = response.data.map(item => {
            const schedule = item.interviewSchedule;
            const trainee = item.user;
            const trainer = schedule?.trainer;

            return {
              id: item.id,
              scheduleId: schedule?.scheduleId,
              date: schedule?.date,
              time: schedule?.time,
              interviewType: schedule?.interviewType,
              location: schedule?.location,
              duration: schedule?.duration,
              notes: schedule?.notes,
              meetingLink: schedule?.meetingLink,
              eventId: item?.eventId,
              rsvpStatus: item?.rsvpStatus?.trim(),

              // Trainer Info
              trainerName: trainer?.name,
              trainerEmail: trainer?.email,
              trainerTitle: trainer?.title,

              // Trainee Info
              traineeName: `${trainee?.firstname} ${trainee?.lastname}`,
              traineeEmail: trainee?.email,
              traineeEmpId: trainee?.empid,

              traineeApproval: item?.traineeApproval,
              trainerApproval: item?.trainerApproval
            };
          });

          setInterviews(cleanData);
        }

      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    const loadTraineeData = async () => {
      try {
        const empId = sessionStorage.getItem("empid");
        if (!empId) return;



        // 2️⃣ Fetch assessments
        const assessmentRes = await fetchAssessmentsByTrainee(empId);
        const list = Array.isArray(assessmentRes.data) ? assessmentRes.data : [];

        const normalized = list.map((a, index) => ({
          id: a.assessmentId,
          week: index + 1, // Because API does not provide week number
          date: a.assessmentDate,
          step: a.assessmentType || "Weekly Assessment",

          marks: Number(a.marks),
          maxMarks: Number(a.maxMarks),
          grade:
            Number(a.marks) >= 85
              ? "A"
              : Number(a.marks) >= 70
                ? "B"
                : Number(a.marks) >= 55
                  ? "C"
                  : "D",

          // Manager name from user object
          managerName: `${a.user.firstname} ${a.user.lastname}`,

          managerAvatar:
            "https://ui-avatars.com/api/?background=random&name=" +
            encodeURIComponent(`${a.user.firstname} ${a.user.lastname}`),

          managerAvatarAlt: `Avatar of ${a.user.firstname} ${a.user.lastname}`,

          remarks: a.remarks,
          feedback: a.recommendations,
          submittedAt: a.submittedAt,

          status: Number(a.currentStep) >= 1 ? "completed" : "pending"
        }));

        setAssessments(normalized);

      } catch (err) {
        console.error("Error loading trainee dashboard data:", err);
      }
    };

    loadTraineeData();
  }, []);




  // Mock authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate auth check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleStepComplete = (stepNumber) => {
    if (stepNumber === currentStep) {
      setCompletedSteps(prev => Math.max(prev, stepNumber));
      setCurrentStep(prev => Math.min(prev + 1, 8));
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= completedSteps + 1) {
      setCurrentStep(stepNumber);
    }
  };

  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleSessionExpired = () => {
    handleLogout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session Management */}
      <SessionTimeoutHandler
        sessionDuration={30}
        warningTime={5}
        onSessionExpired={handleSessionExpired}
        onSessionExtended={() => { }}
        isActive={true}
      />
      {/* Header */}
      <Header
        userRole="trainee"
        userName={traineeInfo?.name}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <NavigationBreadcrumb
            userRole="trainee"
            showHomeIcon={true}
            className="mb-6"
          />

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Welcome back, {traineeInfo?.name}!
                  </h1>
                  <p className="text-muted-foreground">
                    Continue your learning journey in the {traineeInfo?.program}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Icon name="Calendar" size={14} className="mr-1" />
                      Started: {
                        traineeInfo?.startDate
                          ? new Date(traineeInfo.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })
                          : "Not Available"
                      }

                    </span>
                    <span className="flex items-center">
                      <Icon name="User" size={14} className="mr-1" />
                      ID: {traineeInfo?.id}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="GraduationCap" size={40} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Progress Tracker */}
              <ProgressTracker
                currentStep={currentStep}
                totalSteps={8}
                completedSteps={stepsStatus.filter(s => s.completed).length}
                onStepClick={handleStepClick}
                stepsStatus={stepsStatus}
              />


              {/* Current Step Content */}
              <CurrentStepContent
                currentStep={currentStep}
                traineeInfo={traineeInfo}
                onStepComplete={handleStepComplete}
                syllabus={syllabus}
                stepsStatus={stepsStatus}
              />

              {/* Assessment History */}
              <AssessmentHistory assessments={assessments} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              {/* <QuickActions /> */}

              {/* Interview Schedule */}
              <InterviewSchedule interviews={interviews} />

              {/* Progress Summary Card */}
              {/* <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Target" size={20} className="mr-2 text-primary" />
                  Progress Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Steps Completed</span>
                    <span className="font-medium text-foreground">{completedSteps}/8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Step</span>
                    <span className="font-medium text-foreground">Step {currentStep}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="font-medium text-primary">{overall}%
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="default"
                      size="sm"
                      iconName="TrendingUp"
                      iconPosition="left"
                      iconSize={14}
                      fullWidth
                      onClick={() => navigate('/progress-reports')}
                    >
                      View Detailed Reports
                    </Button>
                  </div>
                </div>
              </div> */}

              {/* Help & Support Card */}
              {/* <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="HelpCircle" size={20} className="mr-2 text-primary" />
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get assistance with your training program
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="MessageSquare"
                      iconPosition="left"
                      iconSize={14}
                      fullWidth
                    >
                      Ask a Question
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Book"
                      iconPosition="left"
                      iconSize={14}
                      fullWidth
                    >
                      Training Guide
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Phone"
                      iconPosition="left"
                      iconSize={14}
                      fullWidth
                    >
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TraineeDashboard;