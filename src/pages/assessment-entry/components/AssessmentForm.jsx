// import React, { useState, useEffect } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';
// import Input from '../../../components/ui/Input';
// import Select from '../../../components/ui/Select';
// import { createAssessment } from '../../../api_service'
// import { fromTheme } from 'tailwind-merge';

// const AssessmentForm = ({
//   trainee,
//   onSave,
//   onSaveDraft,
//   onCancel,
//   isLoading = false,
//   className = ''
// }) => {
//   const [formData, setFormData] = useState({
//     subTopicIds: [],  // array of IDs

//     marks: '',
//     maxMarks: '100',
//     assessmentDate: new Date()?.toISOString()?.split('T')?.[0],
//     assessmentType: 'weekly',
//     remarks: '',
//     strengths: '',
//     improvements: '',
//     recommendations: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [autoSaveStatus, setAutoSaveStatus] = useState('');
//   const [syllabusList, setSyllabusList] = useState([]);
//   const [subTopicOptions, setSubTopicOptions] = useState([]);


//   const assessmentTypeOptions = [
//     { value: 'weekly', label: 'Weekly Assessment' },
//     { value: 'monthly', label: 'Monthly Review' },
//     { value: 'milestone', label: 'Milestone Assessment' },
//     { value: 'final', label: 'Final Evaluation' }
//   ];

//   // Auto-save functionality
//   useEffect(() => {
//     if (hasUnsavedChanges && trainee) {
//       const autoSaveTimer = setTimeout(() => {
//         handleAutoSave();
//       }, 30000); // Auto-save every 30 seconds

//       return () => clearTimeout(autoSaveTimer);
//     }
//   }, [formData, hasUnsavedChanges, trainee]);

//   useEffect(() => {
//     if (!trainee?.empid) return;

//     fetch(`http://localhost:8080/api/syllabus/all-progress/${trainee.empid}`)
//       .then(res => res.json())
//       .then(data => {
//         setSyllabusList(data || []);
//       })
//       .catch(err => console.error("Failed to load syllabus", err));
//   }, [trainee]);


//   useEffect(() => {
//     if (!syllabusList.length) return;

//     let maxCompletedStep = 0;

//     syllabusList.forEach(syl => {
//       syl.subTopics?.forEach(sub => {
//         const completed = sub.stepProgress?.some(p => p?.complete);
//         if (completed) {
//           maxCompletedStep = Math.max(maxCompletedStep, sub.stepNumber);
//         }
//       });
//     });

//     const targetStep = maxCompletedStep + 1;

//     let options = [];

//     syllabusList.forEach(syl => {
//       syl.subTopics?.forEach(sub => {
//         if (sub.stepNumber === targetStep) {
//           options.push({
//             value: sub.subTopicId,
//             label: `${syl.title} - ${sub.name}`
//           });
//         }
//       });
//     });

//     // 🔁 fallback if no next step exists
//     if (!options.length) {
//       syllabusList.forEach(syl => {
//         syl.subTopics?.forEach(sub => {
//           if (sub.stepNumber === maxCompletedStep) {
//             options.push({
//               value: sub.subTopicId,
//               label: `${syl.title} - ${sub.name}`
//             });
//           }
//         });
//       });
//     }

//     setSubTopicOptions(options);
//   }, [syllabusList]);



//   const handleAutoSave = () => {
//     if (trainee && formData?.marks) {
//       const draftData = {
//         ...formData,
//         empid: trainee?.empid,
//         isDraft: true,
//         autoSaved: true
//       };

//       // Simulate auto-save
//       setAutoSaveStatus('Auto-saved');
//       setTimeout(() => setAutoSaveStatus(''), 3000);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     setHasUnsavedChanges(true);

//     // Clear specific field error
//     if (errors?.[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Subtopic validation
//     if (!formData.subTopicIds.length) {
//       newErrors.subTopicIds = 'Please select at least one subtopic';
//     }



//     // Marks validation
//     if (!formData?.marks) {
//       newErrors.marks = 'Marks are required';
//     } else {
//       const marks = parseFloat(formData?.marks);
//       const maxMarks = parseFloat(formData?.maxMarks);
//       if (isNaN(marks) || marks < 0) {
//         newErrors.marks = 'Marks must be a positive number';
//       } else if (marks > maxMarks) {
//         newErrors.marks = `Marks cannot exceed ${maxMarks}`;
//       }
//     }

//     // Assessment date validation
//     if (!formData?.assessmentDate) {
//       newErrors.assessmentDate = 'Assessment date is required';
//     } else {
//       const selectedDate = new Date(formData.assessmentDate);
//       const today = new Date();
//       if (selectedDate > today) {
//         newErrors.assessmentDate = 'Assessment date cannot be in the future';
//       }
//     }

//     // Remarks validation
//     if (!formData?.remarks?.trim()) {
//       newErrors.remarks = 'Remarks are required';
//     } else if (formData?.remarks?.trim()?.length < 10) {
//       newErrors.remarks = 'Remarks must be at least 10 characters';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors)?.length === 0;
//   };

//   const handleSubmit = async (isDraft = false) => {
//     if (!isDraft && !validateForm()) {
//       return;
//     }






//     const assessmentData = {
//       ...formData,
//       empid: trainee?.empid,
//       traineeName: trainee?.name,
//       currentStep: trainee?.currentStep,

//       submittedAt: new Date()?.toISOString(),
//       percentage: Math.round((parseFloat(formData?.marks) / parseFloat(formData?.maxMarks)) * 100)
//     };

//     try {
//       // setIsLoading(true);
//       console.log('Submitting assessment data:', assessmentData);
//       const response = await createAssessment(assessmentData.empid, assessmentData);
//       console.log('Assessment saved successfully:', response);
//       // setIsLoading(false);
//     } catch (error) {
//       console.error('Error submitting assessment:', error);
//     }

//     if (isDraft) {
//       onSaveDraft(assessmentData);
//     } else {
//       onSave(assessmentData);
//     }

//     setHasUnsavedChanges(false);
//   };

//   const handleCancel = () => {
//     if (hasUnsavedChanges) {
//       if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
//         onCancel();
//       }
//     } else {
//       onCancel();
//     }
//   };

//   const getGradeColor = (percentage) => {
//     if (percentage >= 90) return 'text-success';
//     if (percentage >= 80) return 'text-primary';
//     if (percentage >= 70) return 'text-warning';
//     return 'text-error';
//   };

//   const calculatePercentage = () => {
//     const marks = parseFloat(formData?.marks);
//     const maxMarks = parseFloat(formData?.maxMarks);
//     if (!isNaN(marks) && !isNaN(maxMarks) && maxMarks > 0) {
//       return Math.round((marks / maxMarks) * 100);
//     }
//     return 0;
//   };

//   if (!trainee) {
//     return (
//       <div className={`bg-card border border-border rounded-lg p-8 text-center ${className}`}>
//         <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-foreground mb-2">No Trainee Selected</h3>
//         <p className="text-muted-foreground">Please select a trainee to begin assessment entry.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`bg-card border border-border rounded-lg ${className}`}>
//       {/* Header */}
//       <div className="p-6 border-b border-border">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-foreground">Assessment Entry</h2>
//             <p className="text-sm text-muted-foreground">
//               {/* Assessing: {trainee?.username} (Step {trainee?.currentStep}) */}
//               Assessing: {trainee?.username} (Current Step: Auto-detected)

//             </p>
//           </div>
//           <div className="flex items-center space-x-2">
//             {autoSaveStatus && (
//               <span className="text-xs text-success flex items-center">
//                 <Icon name="Check" size={12} className="mr-1" />
//                 {autoSaveStatus}
//               </span>
//             )}
//             {hasUnsavedChanges && (
//               <span className="text-xs text-warning flex items-center">
//                 <Icon name="AlertCircle" size={12} className="mr-1" />
//                 Unsaved changes
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="p-6 space-y-6">
//         {/* Assessment Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Select
//             label="Subtopics"
//             options={subTopicOptions}
//             value={formData.subTopicIds}
//             onChange={(values) =>
//               handleInputChange(
//                 'subTopicIds',
//                 Array.isArray(values) ? values : [values]
//               )
//             }
//             multiple
//             required
//           />



//           <Select
//             label="Assessment Type"
//             options={assessmentTypeOptions}
//             value={formData?.assessmentType}
//             onChange={(value) => handleInputChange('assessmentType', value)}
//             required
//           />
//           <Input
//             label="Assessment Date"
//             type="date"
//             value={formData?.assessmentDate}
//             onChange={(e) => handleInputChange('assessmentDate', e?.target?.value)}
//             error={errors?.assessmentDate}
//             required
//           />
//         </div>

//         {/* Marks Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             label="Marks Obtained"
//             type="number"
//             placeholder="Enter marks"
//             value={formData?.marks}
//             onChange={(e) => handleInputChange('marks', e?.target?.value)}
//             error={errors?.marks}
//             min="0"
//             max={formData?.maxMarks}
//             required
//           />
//           <Input
//             label="Maximum Marks"
//             type="number"
//             value={formData?.maxMarks}
//             onChange={(e) => handleInputChange('maxMarks', e?.target?.value)}
//             min="1"
//           />
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-foreground mb-2">Percentage</label>
//             <div className={`flex items-center justify-center h-10 px-3 border border-border rounded-lg bg-muted ${getGradeColor(calculatePercentage())}`}>
//               <span className="text-lg font-semibold">
//                 {calculatePercentage()}%
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Remarks Section */}
//         <div>
//           <label className="block text-sm font-medium text-foreground mb-2">
//             General Remarks *
//           </label>
//           <textarea
//             className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//             placeholder="Enter detailed remarks about the trainee's performance..."
//             value={formData?.remarks}
//             onChange={(e) => handleInputChange('remarks', e?.target?.value)}
//           />
//           {errors?.remarks && (
//             <p className="text-sm text-error mt-1">{errors?.remarks}</p>
//           )}
//         </div>

//         {/* Detailed Feedback */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Strengths
//             </label>
//             <textarea
//               className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//               placeholder="What did the trainee do well?"
//               value={formData?.strengths}
//               onChange={(e) => handleInputChange('strengths', e?.target?.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Areas for Improvement
//             </label>
//             <textarea
//               className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//               placeholder="What needs improvement?"
//               value={formData?.improvements}
//               onChange={(e) => handleInputChange('improvements', e?.target?.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Recommendations
//             </label>
//             <textarea
//               className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//               placeholder="Specific recommendations..."
//               value={formData?.recommendations}
//               onChange={(e) => handleInputChange('recommendations', e?.target?.value)}
//             />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
//           <Button
//             variant="default"
//             onClick={() => handleSubmit(false)}
//             loading={isLoading}
//             iconName="Save"
//             iconPosition="left"
//             className="flex-1 sm:flex-none"
//           >
//             Save Assessment
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => handleSubmit(true)}
//             iconName="FileText"
//             iconPosition="left"
//             className="flex-1 sm:flex-none"
//           >
//             Save as Draft
//           </Button>
//           <Button
//             variant="ghost"
//             onClick={handleCancel}
//             iconName="X"
//             iconPosition="left"
//             className="flex-1 sm:flex-none"
//           >
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssessmentForm;

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { createAssessment } from '../../../api_service'
import { fromTheme } from 'tailwind-merge';
import { fetchCompletedSubTopics } from '../../../api_service';

const AssessmentForm = ({
  trainee,
  onSave,
  onSaveDraft,
  onCancel,
  isLoading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    
    marks: '',
    maxMarks: '100',
    assessmentDate: new Date()?.toISOString()?.split('T')?.[0],
    assessmentType: 'weekly',
    remarks: '',
    strengths: '',
    improvements: '',
    recommendations: '',
    subTopicId: null
  });
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [completedSubTopics, setCompletedSubTopics] = useState([]);


  const assessmentTypeOptions = [
    { value: 'weekly', label: 'Weekly Assessment' },
    { value: 'monthly', label: 'Monthly Review' },
    { value: 'milestone', label: 'Milestone Assessment' },
    { value: 'final', label: 'Final Evaluation' }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && trainee) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData, hasUnsavedChanges, trainee]);

  const handleAutoSave = () => {
    if (trainee && formData?.marks) {
      const draftData = {
        ...formData,
        empid: trainee?.trngid,
        isDraft: true,
        autoSaved: true
      };

      // Simulate auto-save
      setAutoSaveStatus('Auto-saved');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  };

  // console.log('Form data state:', trainee);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Clear specific field error
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Subtopic validation
    // if (!formData?.subTopic?.trim()) {
    //   newErrors.subTopic = 'Subtopic is required';
    // }

    if (!formData?.subTopicId) {
  newErrors.subTopicId = 'Subtopic is required';
}

    // Marks validation
    if (!formData?.marks) {
      newErrors.marks = 'Marks are required';
    } else {
      const marks = parseFloat(formData?.marks);
      const maxMarks = parseFloat(formData?.maxMarks);
      if (isNaN(marks) || marks < 0) {
        newErrors.marks = 'Marks must be a positive number';
      } else if (marks > maxMarks) {
        newErrors.marks = `Marks cannot exceed ${maxMarks}`;
      }
    }

    // Assessment date validation
    if (!formData?.assessmentDate) {
      newErrors.assessmentDate = 'Assessment date is required';
    } else {
      const selectedDate = new Date(formData.assessmentDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.assessmentDate = 'Assessment date cannot be in the future';
      }
    }

    // Remarks validation
    if (!formData?.remarks?.trim()) {
      newErrors.remarks = 'Remarks are required';
    } else if (formData?.remarks?.trim()?.length < 10) {
      newErrors.remarks = 'Remarks must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    const assessmentData = {
      ...formData,
      empid: trainee?.trngid,
      traineeName: trainee?.name,
      currentStep: trainee?.currentStep,
      subTopicId:formData.subTopicId,
      // isDraft,
      submittedAt: new Date()?.toISOString(),
      percentage: Math.round((parseFloat(formData?.marks) / parseFloat(formData?.maxMarks)) * 100)
    };

    console.log('Final assessment data to submit:', assessmentData);

    try {
      // setIsLoading(true);
      console.log('Submitting assessment data:', assessmentData);
      const response = await createAssessment(assessmentData.empid, assessmentData);
      console.log('Assessment saved successfully:', response);


      alert("Assessment saved successfully!");
      // setIsLoading(false);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }

    if (isDraft) {
      onSaveDraft(assessmentData);
    } else {
      onSave(assessmentData);
    }

    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-primary';
    if (percentage >= 70) return 'text-warning';
    return 'text-error';
  };


  useEffect(() => {
    if (!trainee?.trngid) {
      setCompletedSubTopics([]);
      return;
    }

    const loadData = async () => {
      try {
        const response = await fetchCompletedSubTopics();

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const filteredSubTopics = data.flatMap(syllabus =>
          syllabus.subTopics?.flatMap(subTopic =>
            subTopic.stepProgress
              ?.filter(progress =>
                progress.checker === true &&
                progress.user?.empid === trainee.trngid
              )
              ?.map(() => ({
                value: subTopic.subTopicId,
                label: `${subTopic.stepNumber}. ${subTopic.name}`
              })) || []
          ) || []
        );

        console.log(
          "Filtered SubTopics for",
          trainee.trngid,
          filteredSubTopics
        );

        setCompletedSubTopics(filteredSubTopics);

      } catch (err) {
        console.error("Error fetching completed subtopics", err);
        setCompletedSubTopics([]);
      }
    };

    loadData();
  }, [trainee?.trngid]);

  const calculatePercentage = () => {
    const marks = parseFloat(formData?.marks);
    const maxMarks = parseFloat(formData?.maxMarks);
    if (!isNaN(marks) && !isNaN(maxMarks) && maxMarks > 0) {
      return Math.round((marks / maxMarks) * 100);
    }
    return 0;
  };

  if (!trainee) {
    return (
      <div className={`bg-card border border-border rounded-lg p-8 text-center ${className}`}>
        <Icon name="ClipboardList" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Trainee Selected</h3>
        <p className="text-muted-foreground">Please select a trainee to begin assessment entry.</p>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assessment Entry</h2>
            <p className="text-sm text-muted-foreground">
              Assessing: {trainee?.username} (Step {trainee?.currentStep})
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {autoSaveStatus && (
              <span className="text-xs text-success flex items-center">
                <Icon name="Check" size={12} className="mr-1" />
                {autoSaveStatus}
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="text-xs text-warning flex items-center">
                <Icon name="AlertCircle" size={12} className="mr-1" />
                Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Assessment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* <Input
            label="Subtopic"
            placeholder="Enter subtopic name"
            value={formData?.subTopic}
            onChange={(e) => handleInputChange('subTopic', e?.target?.value)}
            error={errors?.subTopic}
            required
          /> */}
          <Select
            label="Assessment Type"
            options={assessmentTypeOptions}
            value={formData?.assessmentType}
            onChange={(value) => handleInputChange('assessmentType', value)}
            required
          />
          <Input
            label="Assessment Date"
            type="date"
            value={formData?.assessmentDate}
            onChange={(e) => handleInputChange('assessmentDate', e?.target?.value)}
            error={errors?.assessmentDate}
            required
          />
        </div>

        {/* Marks Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Marks Obtained"
            type="number"
            placeholder="Enter marks"
            value={formData?.marks}
            onChange={(e) => handleInputChange('marks', e?.target?.value)}
            error={errors?.marks}
            min="0"
            max={formData?.maxMarks}
            required
          />
          <Input
            label="Maximum Marks"
            type="number"
            value={formData?.maxMarks}
            onChange={(e) => handleInputChange('maxMarks', e?.target?.value)}
            min="1"
          />
          <div className="flex flex-col">
            <label className="text-sm font-medium text-foreground mb-2">Percentage</label>
            <div className={`flex items-center justify-center h-10 px-3 border border-border rounded-lg bg-muted ${getGradeColor(calculatePercentage())}`}>
              <span className="text-lg font-semibold">
                {calculatePercentage()}%
              </span>
            </div>
          </div>
        </div>


        <Select
          label="Select Sub Topic"
          required
          options={completedSubTopics}
          value={formData.subTopicId}
          onChange={(value) =>
            handleInputChange('subTopicId', value)
          }
          
          searchable
        />


        {/* Remarks Section */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            General Remarks *
          </label>
          <textarea
            className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Enter detailed remarks about the trainee's performance..."
            value={formData?.remarks}
            onChange={(e) => handleInputChange('remarks', e?.target?.value)}
          />
          {errors?.remarks && (
            <p className="text-sm text-error mt-1">{errors?.remarks}</p>
          )}
        </div>

        {/* Detailed Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Strengths
            </label>
            <textarea
              className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="What did the trainee do well?"
              value={formData?.strengths}
              onChange={(e) => handleInputChange('strengths', e?.target?.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Areas for Improvement
            </label>
            <textarea
              className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="What needs improvement?"
              value={formData?.improvements}
              onChange={(e) => handleInputChange('improvements', e?.target?.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Recommendations
            </label>
            <textarea
              className="w-full h-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Specific recommendations..."
              value={formData?.recommendations}
              onChange={(e) => handleInputChange('recommendations', e?.target?.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={() => handleSubmit(false)}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Save Assessment
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            iconName="FileText"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Save as Draft
          </Button>
          <Button
            variant="ghost"
            onClick={handleCancel}
            iconName="X"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;