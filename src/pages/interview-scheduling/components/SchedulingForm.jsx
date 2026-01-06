import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { getAllTrainers, fetchCompletedSubTopics } from "../../../api_service";


const SchedulingForm = ({
  selectedDate,
  selectedTime,
  selectedTrainees,
  onSchedule,
  onCancel,
  conflicts = [],
  className = "",
}) => {
  const [formData, setFormData] = useState({
    interviewer: "",
    interviewType: "",
    location: "",
    // meetingLink: "",
    duration: "60",
    notes: "",
    // emailTemplate: "default",
    subTopicIds: [],
    //syllabusTitles: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainerList, setTrainerList] = useState([]);

  const [selectedSyllabus, setSelectedSyllabus] = useState([]);

  const [syllabusData, setSyllabusData] = useState([]);
  const [completedSubTopics, setCompletedSubTopics] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("ALL");
  const [selectedSubTopics, setSelectedSubTopics] = useState([]);

  // const getCompletedSyllabusData = (data, traineeIds) => {
  //   return data
  //     .map(syllabus => {
  //       const completedSubTopics = syllabus.subTopics?.filter(subTopic =>
  //         subTopic.stepProgress?.some(
  //           progress =>
  //             progress.complete === true &&
  //             progress.checker === true &&
  //             traineeIds.includes(progress.user?.trngid)
  //         )
  //       );

  //       if (!completedSubTopics?.length) return null;

  //       return {
  //         ...syllabus,
  //         subTopics: completedSubTopics
  //       };
  //     })
  //     .filter(Boolean);
  // };


  // const [completedSubTopics, setCompletedSubTopics] = useState([]);

  const getCompletedSyllabusData = (data, traineeIds) => {
    return data
      .map(syllabus => {
        const completedSubTopics = syllabus.subTopics?.filter(subTopic =>
          subTopic.stepProgress?.some(
            progress =>
              progress.complete === true &&
              progress.checker === true &&
              traineeIds.includes(progress.user?.empid)
          )
        );

        if (!completedSubTopics?.length) return null;

        return {
          ...syllabus,
          subTopics: completedSubTopics
        };
      })
      .filter(Boolean);
  };

  console.log("selected trainees in form", selectedTrainees);
  // ✅ Fetch trainers dynamically (optional)
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await getAllTrainers();
        setTrainerList(res.data);
        console.log("Fetched trainers:", res);
      } catch (err) {
        console.error("Error loading trainers:", err);
      }
    };
    fetchTrainers();
  }, []);

  // Options
  const interviewTypeOptions = [
    { value: "technical", label: "Technical Interview" },
    { value: "behavioral", label: "Behavioral Interview" },
    { value: "progress", label: "Progress Review" },
    { value: "final", label: "Final Assessment" },
  ];

  const durationOptions = [
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  const emailTemplateOptions = [
    { value: "default", label: "Default Template" },
    { value: "technical", label: "Technical Interview Template" },
    { value: "behavioral", label: "Behavioral Interview Template" },
    { value: "progress", label: "Progress Review Template" },
  ];

  // ✅ Build interviewer dropdown options
  const interviewerOptions = Array.isArray(trainerList)
    ? (trainerList).map((t) => ({
      value: t.trainerId,
      label: `${t.name}${t.title ? " - " + t.title : ""}`,
    }))
    : [];

  useEffect(() => {
    // Reset errors when new selection occurs
    setErrors({});
  }, [selectedDate, selectedTime, selectedTrainees]);


  // useEffect(() => {
  //   if (!selectedTrainees || selectedTrainees.length === 0) {
  //     setCompletedSubTopics([]);
  //     return;
  //   }

  //   const loadData = async () => {
  //     try {
  //       const response = await fetchCompletedSubTopics();

  //       const data = Array.isArray(response)
  //         ? response
  //         : Array.isArray(response?.data)
  //           ? response.data
  //           : [];

  //       console.log("Completed SubTopics API response:", response);
  //       const filteredSubTopics = data.flatMap(syllabus =>
  //         syllabus.subTopics?.flatMap(subTopic =>
  //           subTopic.stepProgress
  //             ?.filter(progress =>
  //               progress.checker === true &&
  //               selectedTrainees.includes(progress.user?.empid)
  //             )
  //             ?.map(() => ({
  //               value: subTopic.subTopicId,
  //               label: `${subTopic.stepNumber}. ${subTopic.name}`
  //             })) || []
  //         ) || []
  //       );

  //       console.log(
  //         "Filtered SubTopics for",
  //         selectedTrainees,
  //         filteredSubTopics
  //       );

  //       setCompletedSubTopics(filteredSubTopics);

  //     } catch (err) {
  //       console.error("Error fetching completed subtopics", err);
  //       setCompletedSubTopics([]);
  //     }
  //   };

  //   loadData();
  // }, [selectedTrainees]);


  useEffect(() => {
    if (!selectedTrainees?.length) {
      setSyllabusData([]);
      setCompletedSubTopics([]);
      return;
    }

    const loadData = async () => {
      try {
        const response = await fetchCompletedSubTopics();

        const rawData = Array.isArray(response)
          ? response
          : response?.data || [];

        const completedSyllabus = getCompletedSyllabusData(
          rawData,
          selectedTrainees
        );

        setSyllabusData(completedSyllabus);

        // 🔹 Flat subtopic dropdown list
        const subTopicOptions = completedSyllabus.flatMap(syllabus =>
          syllabus.subTopics.map(sub => ({
            value: sub.subTopicId,
            label: `${syllabus.title} - ${sub.stepNumber}. ${sub.name}`,
            title: syllabus.title
          }))
        );

        setCompletedSubTopics(subTopicOptions);
      } catch (err) {
        console.error("Error loading syllabus", err);
        setSyllabusData([]);
        setCompletedSubTopics([]);
      }
    };

    loadData();
  }, [selectedTrainees]);


  const syllabusOptions = [
    { value: "ALL", label: "All Syllabus" },
    ...syllabusData.map(s => ({
      value: s.title,
      label: s.title
    }))
  ];


  const filteredSubTopicOptions = (() => {
    if (
      selectedSyllabus.length === 0 ||
      selectedSyllabus.includes("ALL")
    ) {
      return [
        { value: "ALL_SUBTOPICS", label: "All Subtopics" },
        ...completedSubTopics
      ];
    }

    return [
      { value: "ALL_SUBTOPICS", label: "All Subtopics" },
      ...completedSubTopics.filter(sub =>
        selectedSyllabus.includes(sub.title)
      )
    ];
  })();


  // const handleSyllabusChange = values => {
  //   let selected = Array.isArray(values) ? values : [values];

  //   if (selected.includes("ALL")) {
  //     selected = syllabusOptions
  //       .filter(o => o.value !== "ALL")
  //       .map(o => o.value);
  //   }

  //   setSelectedSyllabus(selected);
  //   setSelectedSubTopics([]);
  //   handleInputChange("subTopicIds", []);
  // };

  const handleSyllabusChange = values => {
    let selected = Array.isArray(values) ? values : [values];

    if (selected.includes("ALL")) {
      selected = syllabusOptions
        .filter(opt => opt.value !== "ALL")
        .map(opt => opt.value);
    }

    setSelectedSyllabus(selected);
    //handleInputChange("syllabusTitles", selected)
    setSelectedSubTopics([]);
    handleInputChange("subTopicIds", []);
  };


  const handleSubTopicChange = values => {
    let selected = Array.isArray(values) ? values : [values];

    if (selected.includes("ALL_SUBTOPICS")) {
      selected = filteredSubTopicOptions
        .filter(o => o.value !== "ALL_SUBTOPICS")
        .map(o => o.value);
    }

    setSelectedSubTopics(selected);
    handleInputChange("subTopicIds", selected);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.interviewer) {
      newErrors.interviewer = "Please select an interviewer";
    }
    if (!formData.interviewType) {
      newErrors.interviewType = "Please select interview type";
    }
    if (!formData.location && !formData.meetingLink) {
      newErrors.location = "Provide either location or meeting link";
    }
    if (formData.meetingLink && !isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = "Provide a valid meeting link";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // clear error as user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const scheduleData = {
        date: selectedDate,
        time: selectedTime,
        trainees: selectedTrainees,
        ...formData,
        duration: parseInt(formData.duration),
        syllabusTitles: formData.syllabusTitles,
        //     subTopicIds: formData.subTopicIds,

      };
      console.log("Scheduling data:", scheduleData);

      await onSchedule(scheduleData);
    } catch (error) {
      console.error("Scheduling error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConflictWarning = () => {
    if (!selectedDate || !selectedTime) return null;

    const dateStr = selectedDate?.toDateString();
    const conflict = conflicts?.find(
      (c) =>
        new Date(c.date)?.toDateString() === dateStr && c?.time === selectedTime
    );

    if (conflict) {
      return (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-700">
                Scheduling Conflict Detected
              </p>
              <p className="text-xs text-yellow-600 mt-1">{conflict?.reason}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!selectedDate || !selectedTime || selectedTrainees?.length === 0) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Schedule Interview
          </h3>
          <p className="text-muted-foreground">
            Select a date, time slot, and trainees to begin scheduling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Schedule Interview
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedDate?.toLocaleDateString()} at {selectedTime} •{" "}
          {selectedTrainees?.length} trainee
          {selectedTrainees?.length > 1 ? "s" : ""}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {getConflictWarning()}

        {/* Interviewer */}
        <Select
          label="Select Interviewer"
          required
          options={interviewerOptions}
          value={formData.interviewer}
          onChange={(value) => handleInputChange("interviewer", value)}
          error={errors.interviewer}
          searchable
        />

        {/* Type + Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Interview Type"
            required
            options={interviewTypeOptions}
            value={formData.interviewType}
            onChange={(value) => handleInputChange("interviewType", value)}
            error={errors.interviewType}
          />

          <Select
            label="Duration"
            options={durationOptions}
            value={formData.duration}
            onChange={(value) => handleInputChange("duration", value)}
          />
        </div>

        {/* Location + Meeting Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            type="text"
            placeholder="Conference Room A, Building 1"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            error={errors.location}
            description="Physical meeting location"
          />

          {/* <Input
            label="Meeting Link"
            type="url"
            placeholder="https://meet.google.com/abc-defg-hij"
            value={formData.meetingLink}
            onChange={(e) => handleInputChange("meetingLink", e.target.value)}
            error={errors.meetingLink}
            description="Virtual meeting link"
          /> */}


        </div>

        <div className="grid grid-cols-2 gap-4">

          {/* 🔹 SYLLABUS MULTI SELECT */}
          <div className="space-y-2">
            <Select
              label="Syllabus"
              options={syllabusOptions}
              value={selectedSyllabus}
              onChange={handleSyllabusChange}
              multiple
              searchable
            />

            {/* ✅ Selected syllabus chips */}
            {selectedSyllabus.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSyllabus.map(title => (
                  <span
                    key={title}
                    className="px-3 py-1 text-xs rounded-full
            bg-secondary/10 text-secondary
            border border-secondary/30"
                  >
                    {title}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 🔹 SUBTOPIC MULTI SELECT */}
          <div className="space-y-3">
            <Select
              label="Completed Sub Topics"
              options={filteredSubTopicOptions}
              value={selectedSubTopics}
              onChange={handleSubTopicChange}
              multiple
              searchable
            />

            {selectedSubTopics.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Selected Sub Topics:
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedSubTopics.map(id => {
                    const sub = completedSubTopics.find(s => s.value === id);
                    if (!sub) return null;

                    return (
                      <span
                        key={id}
                        className="px-3 py-1 text-xs rounded-full
                bg-primary/10 text-primary
                border border-primary/30"
                      >
                        {sub.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interview Notes
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Additional notes or preparation instructions..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </div>

        {/* Email Template */}
        {/* <Select
          label="Email Template"
          description="Template for interview notification emails"
          options={emailTemplateOptions}
          value={formData.emailTemplate}
          onChange={(value) => handleInputChange("emailTemplate", value)}
        /> */}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="Calendar"
            iconPosition="left"
          >
            {selectedTrainees?.length > 1
              ? "Schedule Interviews"
              : "Schedule Interview"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchedulingForm;