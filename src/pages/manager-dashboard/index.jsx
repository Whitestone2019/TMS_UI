import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import TraineeMetricsPanel from './components/TraineeMetricsPanel';
import FilterToolbar from './components/FilterToolbar';
import TraineeDataTable from './components/TraineeDataTable';
import AssessmentEntryModal from './components/AssessmentEntryModal';
import { fetchAllTraineeSummary } from '../../api_service';
const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedTraineeForAssessment, setSelectedTraineeForAssessment] = useState(null);
  const empId = sessionStorage.setItem("empid", "TRN001");

  const [filters, setFilters] = useState({
    searchName: '',
    syllabusStep: 'all',
    completionStatus: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Mock data for trainees
  // const mockTrainees = [
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     email: "sarah.johnson@company.com",
  //     currentStep: "Step 3: Intermediate",
  //     stepDescription: "React Components & Hooks",
  //     completionPercentage: 75,
  //     status: "in-progress",
  //     lastAssessmentDate: "10/18/2024",
  //     lastAssessmentScore: 88,
  //     interviewStatus: "scheduled"
  //   },

  //   {
  //     id: 2,
  //     name: "Michael Chen",
  //     email: "michael.chen@company.com",
  //     currentStep: "Step 2: Fundamentals",
  //     stepDescription: "JavaScript ES6+ Features",
  //     completionPercentage: 45,
  //     status: "in-progress",
  //     lastAssessmentDate: "10/15/2024",
  //     lastAssessmentScore: 72,
  //     interviewStatus: "pending"
  //   },
  //   {
  //     id: 3,
  //     name: "Emily Rodriguez",
  //     email: "emily.rodriguez@company.com",
  //     currentStep: "Step 5: Final Project",
  //     stepDescription: "Full-Stack Application",
  //     completionPercentage: 95,
  //     status: "completed",
  //     lastAssessmentDate: "10/20/2024",
  //     lastAssessmentScore: 94,
  //     interviewStatus: "completed"
  //   },
  //   {
  //     id: 4,
  //     name: "David Thompson",
  //     email: "david.thompson@company.com",
  //     currentStep: "Step 1: Introduction",
  //     stepDescription: "Web Development Basics",
  //     completionPercentage: 20,
  //     status: "in-progress",
  //     lastAssessmentDate: "10/12/2024",
  //     lastAssessmentScore: 65,
  //     interviewStatus: "pending"
  //   },
  //   {
  //     id: 5,
  //     name: "Lisa Wang",
  //     email: "lisa.wang@company.com",
  //     currentStep: "Step 4: Advanced",
  //     stepDescription: "State Management & APIs",
  //     completionPercentage: 80,
  //     status: "in-progress",
  //     lastAssessmentDate: "10/19/2024",
  //     lastAssessmentScore: 91,
  //     interviewStatus: "scheduled"
  //   },
  //   {
  //     id: 6,
  //     name: "James Wilson",
  //     email: "james.wilson@company.com",
  //     currentStep: "Step 2: Fundamentals",
  //     stepDescription: "JavaScript ES6+ Features",
  //     completionPercentage: 35,
  //     status: "in-progress",
  //     lastAssessmentDate: "10/14/2024",
  //     lastAssessmentScore: 58,
  //     interviewStatus: "pending"
  //   }
  // ];

  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);

  useEffect(() => {
    fetchTrainees();
  }, []);

  // const fetchTrainees = async () => {
  //   try{
  //   const response = await fetchAllTraineeSummary();
  //   console.log('Fetched trainee summary:', response);
  //   setTrainees(response.data);
  //   setFilteredTrainees(response.data);
  //   }catch(error){
  //     console.error('Error fetching trainee summary:', error);
  //   }

  // }

  // Calculate metrics
  const fetchTrainees = async () => {
    try {
      const response = await fetchAllTraineeSummary();

      const traineeList = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.trainees)
          ? response.data.trainees
          : [];

      setTrainees(traineeList);
      setFilteredTrainees(traineeList);
    } catch (error) {
      console.error('Error fetching trainee summary:', error);
      setTrainees([]);
      setFilteredTrainees([]);
    }
  };

  const metrics = {
    totalTrainees: trainees?.length,
    avgCompletion: Math.round(trainees?.reduce((sum, t) => sum + t?.completionPercentage, 0) / trainees?.length),
    pendingAssessments: trainees?.filter(t => {
      const lastAssessment = new Date(t.lastAssessmentDate);
      const weekAgo = new Date();
      weekAgo?.setDate(weekAgo?.getDate() - 7);
      return lastAssessment < weekAgo;
    })?.length,
    upcomingInterviews: trainees?.filter(t => t?.interviewStatus === 'scheduled')?.length
  };

  // Filter trainees based on current filters
  useEffect(() => {
    let filtered = [...trainees];

    if (filters?.searchName) {
      filtered = filtered?.filter(trainee =>
        trainee?.name?.toLowerCase()?.includes(filters?.searchName?.toLowerCase()) ||
        trainee?.email?.toLowerCase()?.includes(filters?.searchName?.toLowerCase())
      );
    }

    if (filters?.syllabusStep !== 'all') {
      filtered = filtered?.filter(trainee =>
        trainee?.currentStep?.toLowerCase()?.includes(filters?.syllabusStep?.toLowerCase())
      );
    }

    if (filters?.completionStatus !== 'all') {
      filtered = filtered?.filter(trainee => trainee?.status === filters?.completionStatus);
    }

    if (filters?.dateFrom) {
      filtered = filtered?.filter(trainee => {
        const assessmentDate = new Date(trainee.lastAssessmentDate);
        const fromDate = new Date(filters.dateFrom);
        return assessmentDate >= fromDate;
      });
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(trainee => {
        const assessmentDate = new Date(trainee.lastAssessmentDate);
        const toDate = new Date(filters.dateTo);
        return assessmentDate <= toDate;
      });
    }

    setFilteredTrainees(filtered);
  }, [filters, trainees]);

  const handleSelectTrainee = (traineeId, isSelected) => {
    if (isSelected) {
      setSelectedTrainees(prev => [...prev, traineeId]);
    } else {
      setSelectedTrainees(prev => prev?.filter(id => id !== traineeId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedTrainees(filteredTrainees?.map(t => t?.id));
    } else {
      setSelectedTrainees([]);
    }
  };

  const handleSort = (key, direction) => {
    const sorted = [...filteredTrainees]?.sort((a, b) => {
      let aValue = a?.[key];
      let bValue = b?.[key];

      if (key === 'lastAssessmentDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (key === 'completion') {
        aValue = a?.completionPercentage;
        bValue = b?.completionPercentage;
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTrainees(sorted);
  };

  const handleViewProfile = (traineeId) => {
    navigate(`/progress-reports?trainee=${traineeId}`);
  };

  const handleAddAssessment = (traineeId) => {
    const trainee = trainees?.find(t => t?.id === traineeId);
    setSelectedTraineeForAssessment(trainee);
    setShowAssessmentModal(true);
  };

  const handleScheduleInterview = (traineeId) => {
    navigate(`/interview-scheduling?trainee=${traineeId}`);
  };

  const handleExportReports = () => {
    // Mock export functionality
    const exportData = {
      trainees: filteredTrainees,
      exportDate: new Date()?.toISOString(),
      filters: filters
    };

    console.log('Exporting reports:', exportData);

    // Create mock CSV content
    const csvContent = [
      ['Name', 'Email', 'Current Step', 'Completion %', 'Last Assessment', 'Score', 'Interview Status']?.join(','),
      ...filteredTrainees?.map(t => [
        t?.name,
        t?.email,
        t?.currentStep,
        t?.completionPercentage,
        t?.lastAssessmentDate,
        t?.lastAssessmentScore,
        t?.interviewStatus
      ]?.join(','))
    ]?.join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trainee-reports-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleBulkScheduleInterview = () => {
    if (selectedTrainees?.length === 0) {
      alert('Please select trainees to schedule interviews');
      return;
    }
    navigate(`/interview-scheduling?trainees=${selectedTrainees?.join(',')}`);
  };

  const handleBulkAddAssessment = () => {
    navigate('/assessment-entry');
  };

  const handleSubmitAssessment = async (assessmentData) => {
    // Mock API call
    console.log('Submitting assessment:', assessmentData);

    // Update trainee's last assessment data
    setTrainees(prev => prev?.map(trainee => {
      if (trainee?.id === assessmentData?.traineeId) {
        return {
          ...trainee,
          lastAssessmentDate: assessmentData?.assessmentDate,
          lastAssessmentScore: assessmentData?.marks,
          // Update completion percentage based on assessment
          completionPercentage: Math.min(100, trainee?.completionPercentage + 5)
        };
      }
      return trainee;
    }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="manager"
        userName="Manager Smith"
        onLogout={handleLogout}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <NavigationBreadcrumb userRole="manager" className="mb-6" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive oversight of trainee progress with advanced filtering and reporting capabilities
            </p>
          </div>

          {/* Metrics Panel */}
          <TraineeMetricsPanel metrics={metrics} />

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFilterChange={setFilters}
            onExportReports={handleExportReports}
            onScheduleInterview={handleBulkScheduleInterview}
            onAddAssessment={handleBulkAddAssessment}
            resultsCount={filteredTrainees?.length}
          />

          {/* Trainee Data Table */}
          <TraineeDataTable
            trainees={filteredTrainees}
            selectedTrainees={selectedTrainees}
            onSelectTrainee={handleSelectTrainee}
            onSelectAll={handleSelectAll}
            onViewProfile={handleViewProfile}
            onAddAssessment={handleAddAssessment}
            onScheduleInterview={handleScheduleInterview}
            onSort={handleSort}
          />

          {/* Assessment Entry Modal */}
          <AssessmentEntryModal
            isOpen={showAssessmentModal}
            onClose={() => {
              setShowAssessmentModal(false);
              setSelectedTraineeForAssessment(null);
            }}
            trainee={selectedTraineeForAssessment}
            onSubmitAssessment={handleSubmitAssessment}
          />
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;