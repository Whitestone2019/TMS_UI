import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InterviewSchedule = ({ className = '', interviews = [] }) => {
  const [selectedInterview, setSelectedInterview] = useState(null);

  //   const interviews = [
  //   {
  //     id: 1,
  //     title: "Technical Assessment - Programming Fundamentals",
  //     date: "2024-11-05",
  //     time: "10:00 AM",
  //     duration: "45 minutes",
  //     interviewer: "Dr. Michael Chen",
  //     interviewerRole: "Senior Technical Lead",
  //     interviewerAvatar: "https://images.unsplash.com/photo-1676989880361-091e12efc056",
  //     interviewerAvatarAlt: "Professional headshot of Asian man with glasses in dark suit smiling confidently",
  //     location: "Conference Room A",
  //     meetingLink: "https://meet.company.com/tech-assessment-001",
  //     status: "scheduled",
  //     type: "technical",
  //     description: `This technical interview will assess your understanding of programming fundamentals covered in the first month of training.

  // Topics to be covered:
  // • Basic programming concepts and terminology
  // • Data structures and their applications
  // • Problem-solving approaches
  // • Code reading and logic analysis

  // Preparation tips:
  // • Review your completed training modules
  // • Practice explaining concepts clearly
  // • Prepare questions about the training program
  // • Ensure stable internet connection for video call`,
  //     feedback: null,
  //     completedAt: null
  //   },
  //   {
  //     id: 2,
  //     title: "Progress Review - Mid-Training Evaluation",
  //     date: "2024-10-28",
  //     time: "2:30 PM",
  //     duration: "30 minutes",
  //     interviewer: "Sarah Johnson",
  //     interviewerRole: "Training Manager",
  //     interviewerAvatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
  //     interviewerAvatarAlt: "Professional headshot of woman with brown hair in business attire smiling at camera",
  //     location: "Virtual Meeting",
  //     meetingLink: "https://meet.company.com/progress-review-002",
  //     status: "completed",
  //     type: "progress",
  //     description: "Mid-training progress evaluation to discuss learning outcomes and address any challenges.",
  //     feedback: `Excellent progress demonstrated throughout the training program. John shows strong analytical thinking and consistent improvement in technical skills.

  // Strengths observed:
  // • Consistent attendance and engagement
  // • Strong problem-solving approach
  // • Good communication of technical concepts
  // • Proactive in seeking help when needed

  // Areas for continued focus:
  // • Continue practicing coding exercises
  // • Prepare for upcoming technical assessments
  // • Consider additional reading on advanced topics

  // Overall assessment: Exceeding expectations. Well-prepared for the next phase of training.`,
  //     completedAt: "2024-10-28T14:30:00Z"
  //   },
  //   {
  //     id: 3,
  //     title: "Final Project Presentation",
  //     date: "2024-11-20",
  //     time: "11:00 AM",
  //     duration: "60 minutes",
  //     interviewer: "Panel Interview",
  //     interviewerRole: "Technical Review Board",
  //     interviewerAvatar: "https://images.unsplash.com/photo-1493882552576-fce827c6161e",
  //     interviewerAvatarAlt: "Professional group photo of diverse team members in business attire in modern office setting",
  //     location: "Main Conference Hall",
  //     meetingLink: null,
  //     status: "pending",
  //     type: "presentation",
  //     description: `Final capstone project presentation to demonstrate comprehensive understanding of all training modules.

  // Presentation requirements:
  // • 20-minute project demonstration
  // • 10-minute Q&A session
  // • Technical documentation review
  // • Code walkthrough and explanation

  // Panel members:
  // • Dr. Michael Chen (Technical Lead)
  // • Sarah Johnson (Training Manager)
  // • Alex Rodriguez (Senior Developer)
  // • Lisa Wang (Product Manager)`,
  //     feedback: null,
  //     completedAt: null
  //   }];


  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'scheduled':
        return 'text-primary';
      case 'pending':
        return 'text-warning';
      case 'cancelled':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10';
      case 'scheduled':
        return 'bg-primary/10';
      case 'pending':
        return 'bg-warning/10';
      case 'cancelled':
        return 'bg-error/10';
      default:
        return 'bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'scheduled':
        return 'Calendar';
      case 'pending':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'AlertCircle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'technical':
        return 'Code';
      case 'progress':
        return 'TrendingUp';
      case 'presentation':
        return 'Presentation';
      default:
        return 'MessageSquare';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const upcomingInterviews = interviews?.filter((interview) =>
    interview?.status === 'scheduled' && isUpcoming(interview?.date)
  );

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Icon name="Calendar" size={24} className="mr-3 text-primary" />
              Interview Schedule
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upcoming interviews and evaluation sessions
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{upcomingInterviews?.length}</div>
            <div className="text-xs text-muted-foreground">Upcoming</div>
          </div>
        </div>
      </div>
      {/* Interview List */}
      <div className="p-6">
        <div className="space-y-4">
          {interviews?.map((interview) =>
            <div
              key={interview?.id}
              className={`border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${selectedInterview === interview?.id ? 'border-primary bg-primary/5' : ''}`
              }>

              {/* Interview Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusBg(interview?.status)}`}>
                    <Icon
                      name={getTypeIcon(interview?.type)}
                      size={20}
                      className={getStatusColor(interview?.status)} />

                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{interview?.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Icon name="Calendar" size={14} className="mr-1" />
                        {formatDate(interview?.date)}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Clock" size={14} className="mr-1" />
                        {interview?.time} ({interview?.duration})
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(interview?.status)} ${getStatusColor(interview?.status)}`}>
                  <Icon name={getStatusIcon(interview?.status)} size={12} className="inline mr-1" />
                  {interview?.status?.charAt(0)?.toUpperCase() + interview?.status?.slice(1)}
                </div>
              </div>

              {/* Interviewer Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={interview?.interviewerAvatar}
                    alt={interview?.interviewerAvatarAlt}
                    className="w-full h-full object-cover" />

                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{interview?.interviewer}</p>
                  <p className="text-xs text-muted-foreground">{interview?.interviewerRole}</p>
                </div>
              </div>

              {/* Location/Meeting Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {interview?.location}
                  </span>
                  {interview?.meetingLink &&
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="ExternalLink"
                      iconPosition="right"
                      iconSize={12}
                      onClick={() => window.open(interview?.meetingLink, '_blank')}>

                      Join Meeting
                    </Button>
                  }
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {interview?.status === 'scheduled' && isUpcoming(interview?.date) &&
                    <div className="flex items-center space-x-1 text-xs text-primary">
                      <Icon name="Bell" size={14} />
                      <span>Reminder set</span>
                    </div>
                  }
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={selectedInterview === interview?.id ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                  iconSize={14}
                  onClick={() => setSelectedInterview(
                    selectedInterview === interview?.id ? null : interview?.id
                  )}>

                  {selectedInterview === interview?.id ? 'Hide Details' : 'View Details'}
                </Button>
              </div>

              {/* Expanded Details */}
              {selectedInterview === interview?.id &&
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Interview Details:</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-foreground whitespace-pre-line">
                          {interview?.description}
                        </p>
                      </div>
                    </div>

                    {/* Feedback (if completed) */}
                    {interview?.feedback &&
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Interview Feedback:</h4>
                        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                          <p className="text-sm text-foreground whitespace-pre-line">
                            {interview?.feedback}
                          </p>
                          {interview?.completedAt &&
                            <p className="text-xs text-muted-foreground mt-2">
                              Completed on {new Date(interview.completedAt)?.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          }
                        </div>
                      </div>
                    }

                    {/* Action Buttons */}
                    {interview?.status === 'scheduled' &&
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Calendar"
                          iconPosition="left"
                          iconSize={14}>

                          Add to Calendar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="MessageSquare"
                          iconPosition="left"
                          iconSize={14}>

                          Contact Interviewer
                        </Button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-xl font-bold text-success">
                {interviews?.filter((i) => i?.status === 'completed')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-xl font-bold text-primary">
                {interviews?.filter((i) => i?.status === 'scheduled')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-xl font-bold text-warning">
                {interviews?.filter((i) => i?.status === 'pending')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-xl font-bold text-foreground">
                {upcomingInterviews?.length}
              </div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default InterviewSchedule;