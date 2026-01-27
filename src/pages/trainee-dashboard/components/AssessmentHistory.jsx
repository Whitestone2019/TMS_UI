import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentHistory = ({ className = '', assessments = [] }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  //   const assessments = [
  //     {
  //       id: 1,
  //       week: 1,
  //       date: "2024-10-15",
  //       step: "Introduction to Programming",
  //       marks: 85,
  //       maxMarks: 100,
  //       grade: "A",
  //       managerName: "Sarah Johnson",
  //       managerAvatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
  //       managerAvatarAlt: "Professional headshot of woman with brown hair in business attire smiling at camera",
  //       remarks: `Excellent understanding of programming fundamentals. Shows strong logical thinking and problem-solving skills. Keep up the great work!

  // Areas of strength:
  // • Clear grasp of basic concepts
  // • Good participation in discussions
  // • Well-structured approach to problems

  // Areas for improvement:
  // • Practice more coding exercises
  // • Focus on code optimization techniques`,
  //       feedback: "Outstanding performance in the first week. The trainee demonstrates exceptional aptitude for programming concepts.",
  //       submittedAt: "2024-10-15T14:30:00Z",
  //       status: "completed"
  //     },
  //     {
  //       id: 2,
  //       week: 2,
  //       date: "2024-10-22",
  //       step: "Data Structures",
  //       marks: 78,
  //       maxMarks: 100,
  //       grade: "B+",
  //       managerName: "Sarah Johnson",
  //       managerAvatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
  //       managerAvatarAlt: "Professional headshot of woman with brown hair in business attire smiling at camera",
  //       remarks: `Good progress in understanding data structures. The concepts of arrays and objects are well grasped, but there's room for improvement in complex data manipulation.

  // Strengths observed:
  // • Solid understanding of basic data structures
  // • Good implementation of array operations
  // • Clear documentation in code

  // Recommendations:
  // • Practice more with nested data structures
  // • Work on algorithm efficiency
  // • Review object-oriented principles`,
  //       feedback: "Consistent improvement shown. Focus on practicing more complex data structure problems.",
  //       submittedAt: "2024-10-22T16:45:00Z",
  //       status: "completed"
  //     },
  //     {
  //       id: 3,
  //       week: 3,
  //       date: "2024-10-29",
  //       step: "Control Flow",
  //       marks: null,
  //       maxMarks: 100,
  //       grade: null,
  //       managerName: "Sarah Johnson",
  //       managerAvatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
  //       managerAvatarAlt: "Professional headshot of woman with brown hair in business attire smiling at camera",
  //       remarks: null,
  //       feedback: null,
  //       submittedAt: null,
  //       status: "pending"
  //     }];


  const getGradeColor = (grade) => {
    if (!grade) return 'text-muted-foreground';
    if (grade?.startsWith('A')) return 'text-success';
    if (grade?.startsWith('B')) return 'text-primary';
    if (grade?.startsWith('C')) return 'text-warning';
    return 'text-error';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'AlertCircle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-error';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not assessed';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAverage = () => {
    const completedAssessments = assessments?.filter((a) => a?.marks !== null);
    if (completedAssessments?.length === 0) return 0;

    const total = completedAssessments?.reduce((sum, a) => sum + a?.marks, 0);
    return Math.round(total / completedAssessments?.length);
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Icon name="ClipboardCheck" size={24} className="mr-3 text-primary" />
              Assessment History
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Weekly assessment results and manager feedback
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{calculateAverage()}%</div>
            <div className="text-xs text-muted-foreground">Average Score</div>
          </div>
        </div>
      </div>
      {/* Assessment List */}
      <div className="p-6 ">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {assessments?.map((assessment) =>
            <div
              key={assessment?.id}
              className={`border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${selectedAssessment === assessment?.id ? 'border-primary bg-primary/5' : ''}`
              }>

              {/* Assessment Summary */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${assessment?.status === 'completed' ? 'bg-success/10' : 'bg-warning/10'}`
                  }>
                    <Icon
                      name={getStatusIcon(assessment?.status)}
                      size={20}
                      className={getStatusColor(assessment?.status)} />

                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Week {assessment?.week} Assessment</h3>
                    <p className="text-sm text-muted-foreground">{assessment?.step}</p>
                  </div>
                </div>
                <div className="text-right">
                  {assessment?.marks !== null ?
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          {assessment?.marks}/{assessment?.maxMarks}
                        </div>
                        <div className={`text-sm font-medium ${getGradeColor(assessment?.grade)}`}>
                          Grade: {assessment?.grade}
                        </div>
                      </div>
                    </div> :

                    <div className="text-sm text-muted-foreground">
                      Pending Assessment
                    </div>
                  }
                </div>
              </div>

              {/* Assessment Details */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>Assessed on: {formatDate(assessment?.date)}</span>
                <span>Manager: {assessment?.managerName}</span>
              </div>

              {/* Remarks Preview */}
              {assessment?.remarks &&
                <div className="bg-muted/30 rounded-lg p-3 mb-3">
                  <p className="text-sm text-foreground line-clamp-2">
                    {assessment?.remarks?.split('\n')?.[0]}
                  </p>
                </div>
              }

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {assessment?.status === 'completed' &&
                    <div className="flex items-center space-x-1 text-xs text-success">
                      <Icon name="CheckCircle" size={14} />
                      <span>Completed</span>
                    </div>
                  }
                  {assessment?.status === 'pending' &&
                    <div className="flex items-center space-x-1 text-xs text-warning">
                      <Icon name="Clock" size={14} />
                      <span>Awaiting Assessment</span>
                    </div>
                  }
                </div>
                {assessment?.remarks &&
                  <Button
                    variant="outline"
                    size="sm"
                    iconName={selectedAssessment === assessment?.id ? "ChevronUp" : "ChevronDown"}
                    iconPosition="right"
                    iconSize={14}
                    onClick={() => setSelectedAssessment(
                      selectedAssessment === assessment?.id ? null : assessment?.id
                    )}>

                    {selectedAssessment === assessment?.id ? 'Hide Details' : 'View Details'}
                  </Button>
                }
              </div>

              {/* Expanded Details */}
              {selectedAssessment === assessment?.id && assessment?.remarks &&
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-4">
                    {/* Manager Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={assessment?.managerAvatar}
                          alt={assessment?.managerAvatarAlt}
                          className="w-full h-full object-cover" />

                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{assessment?.managerName}</p>
                        <p className="text-xs text-muted-foreground">Training Manager</p>
                      </div>
                    </div>

                    {/* Full Remarks */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Manager Remarks:</h4>
                      <div className="text-sm text-foreground whitespace-pre-line">
                        {assessment?.remarks}
                      </div>
                    </div>

                    {/* Feedback */}
                    {assessment?.feedback &&
                      <div className="bg-primary/5 rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Additional Feedback:</h4>
                        <p className="text-sm text-foreground">{assessment?.feedback}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {assessments?.filter((a) => a?.status === 'completed')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {assessments?.filter((a) => a?.status === 'pending')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{calculateAverage()}%</div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default AssessmentHistory;