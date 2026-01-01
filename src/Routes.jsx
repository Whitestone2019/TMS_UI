import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import LoginScreen from './pages/login-screen';
import ResetPassword from "./pages/login-screen/ResetPassword";
import ManagerDashboard from './pages/manager-dashboard';
import ProgressReports from './pages/progress-reports';
import SyllabusContentViewer from './pages/syllabus-content-viewer';
import InterviewScheduling from './pages/interview-scheduling';
import TraineeDashboard from './pages/trainee-dashboard';
import AssessmentEntry from './pages/assessment-entry';
import UploadSyllabus from "./pages/manager-dashboard/components/UploadSyllabus";
import TraineeStepsPage from "./pages/manager-dashboard/components/TraineeStepsPage";

const Routes = () => {
  return (
    <BrowserRouter>
      {/* <ErrorBoundary> */}
      {/* <ScrollToTop /> */}
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/progress-reports" element={<ProgressReports />} />
        <Route path="/syllabus-content-viewer" element={<SyllabusContentViewer />} />
        <Route path="/interview-scheduling" element={<InterviewScheduling />} />
        <Route path="/trainee-dashboard" element={<TraineeDashboard />} />
        <Route path="/assessment-entry" element={<AssessmentEntry />} />
        <Route path="/upload-syllabus" element={<UploadSyllabus />} />
        <Route path="/trainee-steps" element={<TraineeStepsPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route path="/progress-reports/:traineeId" element={<ProgressReports />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
};

export default Routes;
