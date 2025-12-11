

import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InterviewSchedule = ({ className = '', interviews = [] }) => {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(interviews.length / itemsPerPage);
  const paginatedInterviews = interviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'scheduled': return 'text-primary';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10';
      case 'scheduled': return 'bg-primary/10';
      case 'pending': return 'bg-warning/10';
      case 'cancelled': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = (dateString) => new Date(dateString) > new Date();

  const upcomingInterviews = interviews?.filter(
    (interview) => interview?.status === 'scheduled' && isUpcoming(interview?.date)
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
              {/* //Upcoming interviews and evaluation sessions */}
            </p>
          </div>
          <div className="text-right">
            {/* <div className="text-2xl font-bold text-primary">{upcomingInterviews?.length}</div>
            <div className="text-xs text-muted-foreground">Upcoming</div> */}
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="p-6 space-y-4">
        {paginatedInterviews.map((interview) => (
          <div
            key={interview?.id}
            className={`border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${selectedInterview === interview?.id ? 'border-primary bg-primary/5' : ''
              }`}
          >
            {/* Interview Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                {/* <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusBg(interview?.status)}`}></div> */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{interview?.interviewType}</h3>
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
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(interview?.status)} ${getStatusColor(interview?.status)}`}></div>
            </div>

            {/* Trainer Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden"></div>
              <div>
                <p className="text-sm font-medium text-foreground">{interview?.trainerName}</p>
                <p className="text-xs text-muted-foreground">{interview?.trainerTitle}</p>
              </div>
            </div>

            {/* Meeting / Location */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {interview?.location}
                </span>
                {interview?.meetingLink && (
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="ExternalLink"
                    iconPosition="right"
                    iconSize={12}
                    onClick={() => window.open(interview?.meetingLink, '_blank')}
                  >
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {interview?.status === 'scheduled' && isUpcoming(interview?.date) && (
                  <div className="flex items-center space-x-1 text-xs text-primary">
                    <Icon name="Bell" size={14} />
                    <span>Reminder set</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName={selectedInterview === interview?.id ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
                iconSize={14}
                onClick={() =>
                  setSelectedInterview(selectedInterview === interview?.id ? null : interview?.id)
                }
              >
                {selectedInterview === interview?.id ? 'Hide Details' : 'View Details'}
              </Button>
            </div>

            {/* Expanded Details */}
            {selectedInterview === interview?.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Interview Notes:</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm text-foreground whitespace-pre-line">{interview?.notes}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Trainee Info:</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm">Name: {interview?.traineeName}</p>
                      <p className="text-sm">Email: {interview?.traineeEmail}</p>
                      <p className="text-sm">Emp ID: {interview?.traineeEmpId}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Approval Status:</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm">Trainer Approval: {interview?.trainerApproval}</p>
                      <p className="text-sm">Trainee Approval: {interview?.traineeApproval}</p>
                      <p className="text-sm">RSVP Status: {interview?.rsvpStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="flex items-center px-3">{currentPage} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;
