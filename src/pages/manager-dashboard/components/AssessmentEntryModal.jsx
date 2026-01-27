// import React, { useState, useEffect } from 'react';
// import Button from '../../../components/ui/Button';
// import Input from '../../../components/ui/Input';
// import Select from '../../../components/ui/Select';
// import {
//   fetchAssessmentsByTrainee,
//   createAssessment,
//   updateAssessment, fetchCompletedSubTopics
// } from "../../../api_service";

// const AssessmentEntryModal = ({ isOpen, onClose, trainee }) => {

//   /* ---------------- STATES ---------------- */
//   const [assessmentList, setAssessmentList] = useState([]);
//   const [existingAssessmentId, setExistingAssessmentId] = useState(null);
//   const [apiError, setApiError] = useState('');
//   const [completedSubTopics, setCompletedSubTopics] = useState([]);
//   const [showUpdateAlert, setShowUpdateAlert] = useState(false);


//   const [assessmentData, setAssessmentData] = useState({
//     traineeId: '',
//     assessmentType: '',
//     marks: '',
//     maxMarks: '100',
//     remarks: '',
//     assessmentDate: new Date().toISOString().split('T')[0],
//     subTopicId: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   /* ---------------- OPTIONS ---------------- */
//   const assessmentTypeOptions = [
//     { value: 'weekly', label: 'Weekly Assessment' },
//     { value: 'monthly', label: 'Monthly Assessment' },
//     { value: 'module', label: 'Module Assessment' },
//     { value: 'practical', label: 'Practical Assessment' },
//     { value: 'project', label: 'Project Assessment' }
//   ];

//   useEffect(() => {
//     if (!isOpen) return;

//     setAssessmentList([]);
//     setExistingAssessmentId(null);
//     setApiError('');
//     setErrors({});

//     setAssessmentData({
//       traineeId: trainee?.traineeId || '',
//       assessmentType: '',
//       marks: '',
//       maxMarks: '100',
//       remarks: '',
//       assessmentDate: new Date().toISOString().split('T')[0]
//     });

//   }, [isOpen, trainee?.traineeId]);




//   /* ---------------- LOAD DATA ---------------- */
//   useEffect(() => {
//     if (!isOpen || !trainee?.traineeId) return;

//     const loadAssessments = async () => {
//     };

//     loadAssessments();
//   }, [isOpen, trainee?.traineeId]);


//   /* ---------------- POPULATE FORM ---------------- */
//   const populateForm = (a) => {
//     if (!a?.assessmentId) return;

//     setExistingAssessmentId(a.assessmentId);

//     const subTopicId =
//       a.subTopic && typeof a.subTopic === 'object' ? a.subTopic.id :
//         typeof a.subTopic === 'number' ? a.subTopic :
//           '';

//     setAssessmentData({
//       traineeId: trainee.traineeId,
//       assessmentType: a.assessmentType?.toLowerCase() || '',
//       marks: String(a.marks || ''),
//       maxMarks: String(a.maxMarks || '100'),
//       remarks: a.remarks || '',
//       assessmentDate: a.assessmentDate
//         ? new Date(a.assessmentDate).toISOString().split('T')[0]
//         : new Date().toISOString().split('T')[0],
//       subTopicId
//     });
//   };


//   /* ---------------- HANDLERS ---------------- */
//   const handleInputChange = (field, value) => {
//     setAssessmentData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!assessmentData.assessmentType)
//       newErrors.assessmentType = 'Required';

//     if (!assessmentData.marks)
//       newErrors.marks = 'Required';

//     if (!assessmentData.remarks || assessmentData.remarks.length < 10)
//       newErrors.remarks = 'Minimum 10 characters';

//     if (!assessmentData.subTopicId) newErrors.subTopicId = 'Required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     const payload = {
//       ...assessmentData,
//       marks: parseInt(assessmentData.marks),
//       maxMarks: parseInt(assessmentData.maxMarks),
//       percentage: Math.round(
//         (assessmentData.marks / assessmentData.maxMarks) * 100
//       )
//     };

//     try {
//       if (existingAssessmentId) {
//         await updateAssessment(existingAssessmentId, payload);

//         // ✅ UPDATE SUCCESS ALERT
//         setShowUpdateAlert(true);

//         // 2 sec baad modal close
//         setTimeout(() => {
//           setShowUpdateAlert(false);
//           onClose();
//         }, 2000);

//       } else {
//         await createAssessment(trainee.traineeId, payload);
//         onClose();
//       }

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">

//         {/* HEADER (X preserved) */}
//         <div className="flex items-center justify-between p-6 border-b">
//           <div>
//             <h2 className="text-xl font-semibold">
//               {existingAssessmentId ? "Update Assessment" : "Add Assessment"}
//             </h2>
//             <p className="text-sm text-muted-foreground">
//               {trainee?.name}
//             </p>
//           </div>
//           <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
//         </div>

//         <div className="grid grid-cols-3 gap-6 p-6">

//           {/* LEFT LIST (ONLY IF DATA EXISTS) */}
//           {assessmentList.length > 0 && (
//             <div className="col-span-1 border rounded-lg p-3 space-y-2">
//               {assessmentList.map(a => (
//                 <div
//                   key={a.assessmentId}
//                   onClick={() => populateForm(a)}
//                   className={`p-3 rounded cursor-pointer border
//                     ${existingAssessmentId === a.assessmentId
//                       ? 'bg-primary/10 border-primary'
//                       : 'hover:bg-muted'}`}
//                 >
//                   <div className="flex justify-between text-sm font-medium">
//                     <span>{a.assessmentType}</span>
//                     <span>{a.marks}/{a.maxMarks}</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {a.assessmentDate}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* FORM (UNCHANGED UI) */}
//           <div className={assessmentList.length > 0 ? "col-span-2" : "col-span-3"}>
//             {showUpdateAlert && (
//               <div className="mb-4 bg-green-50 text-green-700 border border-green-200 p-3 rounded text-sm">
//                 ✅ Assessment updated successfully
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">

//               {trainee && (
//                 <div className="bg-muted/30 rounded-lg p-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                       <span className="text-sm font-medium text-primary">
//                         {trainee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="font-medium text-foreground">{trainee?.name}</p>
//                       <p className="text-sm text-muted-foreground">{trainee?.email}</p>
//                       <p className="text-sm text-muted-foreground">
//                         Current Progress: {trainee?.completionPercentage}% - {trainee?.currentStep}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-6">
//                 <Select
//                   label="Assessment Type"
//                   options={assessmentTypeOptions}
//                   value={assessmentData.assessmentType}
//                   onChange={(v) => handleInputChange('assessmentType', v)}
//                   error={errors.assessmentType}
//                 />

//                 <Input
//                   label="Assessment Date"
//                   type="date"
//                   value={assessmentData.assessmentDate}
//                   onChange={(e) => handleInputChange('assessmentDate', e.target.value)}
//                 />

//                 <Input
//                   label="Marks Obtained"
//                   type="number"
//                   value={assessmentData.marks}
//                   onChange={(e) => handleInputChange('marks', e.target.value)}
//                   error={errors.marks}
//                 />

//                 <Input
//                   label="Maximum Marks"
//                   type="number"
//                   value={assessmentData.maxMarks}
//                   onChange={(e) => handleInputChange('maxMarks', e.target.value)}
//                 />
//                 <Select
//                   label="Select Sub Topic"
//                   required
//                   options={completedSubTopics.map(st => ({ value: st.id, label: st.name }))}
//                   value={assessmentData.subTopicId}
//                   onChange={(v) => handleInputChange('subTopicId', v)}
//                   error={errors.subTopicId}
//                   searchable
//                 />


//               </div>

//               {assessmentData?.marks && assessmentData?.maxMarks && (
//                 <div className="bg-muted/30 rounded-lg p-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-foreground">Percentage:</span>
//                     <span className="text-lg font-bold text-primary">
//                       {Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)}%
//                     </span>
//                   </div>
//                   <div className="mt-2 bg-muted rounded-full h-2">
//                     <div
//                       className="bg-primary h-2 rounded-full transition-all duration-300"
//                       style={{
//                         width: `${Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)}%`
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}



//               <textarea
//                 rows={4}
//                 className="w-full border rounded-lg p-2"
//                 placeholder="Remarks"
//                 value={assessmentData.remarks}
//                 onChange={(e) => handleInputChange('remarks', e.target.value)}
//               />
//               {errors.remarks && <p className="text-error text-sm">{errors.remarks}</p>}

//               <div className="flex justify-end gap-3">
//                 <Button variant="outline" onClick={onClose}>Cancel</Button>
//                 <Button type="submit" loading={isSubmitting}>
//                   Save Assessment
//                 </Button>
//               </div>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssessmentEntryModal;

import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import {
  fetchAssessmentsByTrainee,
  createAssessment,
  updateAssessment,
  fetchCompletedSubTopics
} from "../../../api_service";

const AssessmentEntryModal = ({ isOpen, onClose, trainee }) => {
  const [assessmentList, setAssessmentList] = useState([]);
  const [existingAssessmentId, setExistingAssessmentId] = useState(null);
  const [selectedSyllabus, setSelectedSyllabus] = useState([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState([]);

  const [syllabusData, setSyllabusData] = useState([]);
  const [completedSubTopics, setCompletedSubTopics] = useState([]);
  ;
  const [assessmentData, setAssessmentData] = useState({
    traineeId: '',
    assessmentType: '',
    marks: '',
    maxMarks: '100',
    remarks: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    // subTopics: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  const assessmentTypeOptions = [
    { value: 'weekly', label: 'Weekly Assessment' },
    { value: 'monthly', label: 'Monthly Assessment' },
    { value: 'module', label: 'Module Assessment' },
    { value: 'practical', label: 'Practical Assessment' },
    { value: 'project', label: 'Project Assessment' }
  ];



  // ---------------- LOAD ASSESSMENTS ----------------
  useEffect(() => {
    if (!isOpen || !trainee?.traineeId) return;


    const loadAssessments = async () => {
      try {
        // setSelectedSyllabus([]);
        // setSelectedSubTopics([]);
        console.log("Fetching assessments for traineeId:", trainee.traineeId);
        const res = await fetchAssessmentsByTrainee(trainee.traineeId);
        console.log("Assessments response:", res);
        const list = Array.isArray(res?.data) ? res.data : [];
        const sortedList = list.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAssessmentList(sortedList);
        if (sortedList.length > 0) populateForm(sortedList[0]);
      } catch (err) {
        console.error(err);
        setAssessmentList([]);
      }
    };

    loadAssessments();
  }, [isOpen, trainee?.traineeId]);




  const populateForm = (assessment) => {
    console.log("Populating form with assessment:", assessment);
    if (!assessment?.assessmentId) return;
    setSelectedSyllabus([]);
    setSelectedSubTopics([]);

    setExistingAssessmentId(assessment.assessmentId);


    const parsedSubTopics =
      typeof assessment.subTopics === "string"
        ? assessment.subTopics.split("|").map(Number)
        : [];


    setAssessmentData({
      traineeId: trainee.traineeId,
      assessmentType: assessment.assessmentType?.toLowerCase() || '',
      marks: String(assessment.marks || ''),
      maxMarks: String(assessment.maxMarks || '100'),
      remarks: assessment.remarks || '',
      assessmentDate: assessment.assessmentDate
        ? new Date(assessment.assessmentDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      subTopics: parsedSubTopics,


    });
    setSelectedSubTopics(parsedSubTopics);
    console.log("Parsed subtopics:", syllabusData);
    console.log("Populated form with assessment data:", assessmentData);
  };

  useEffect(() => {
    if (!syllabusData.length || !assessmentData.subTopics.length) return;

    const matchedSyllabusTitles = syllabusData
      .filter(syllabus =>
        syllabus.subTopics.some(subTopic =>
          assessmentData.subTopics.includes(subTopic.subTopicId)
        )
      )
      .map(syllabus => syllabus.title);

    setSelectedSyllabus(matchedSyllabusTitles);
  }, [syllabusData, assessmentData.subTopics]);



  const handleInputChange = (field, value) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

const validateForm = () => {
  const newErrors = {};

  // 1️⃣ Assessment Type
  if (!assessmentData.assessmentType) {
    newErrors.assessmentType = "Assessment type is required";
  }

  // 2️⃣ Marks
  if (!assessmentData.marks) {
    newErrors.marks = "Marks obtained is required";
  } 

  // 3️⃣ Max Marks
  if (!assessmentData.maxMarks) {
    newErrors.maxMarks = "Maximum marks is required";
  } 

  // 4️⃣ Syllabus
  if (!selectedSyllabus || selectedSyllabus.length === 0) {
    newErrors.syllabus = "Please select at least one syllabus";
  }

  // 5️⃣ Sub Topics
  if (!assessmentData.subTopics || assessmentData.subTopics.length === 0) {
    newErrors.subTopics = "Please select at least one sub topic";
  }

  // 6️⃣ Remarks
  if (!assessmentData.remarks || assessmentData.remarks.trim().length < 10) {
    newErrors.remarks = "Remarks must be at least 10 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting assessment data:", assessmentData,existingAssessmentId);
    // if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      ...assessmentData,
      subTopicIds: assessmentData.subTopicIds,
       subTopics: selectedSubTopics.join("|"),
      marks: parseInt(assessmentData.marks),
      maxMarks: parseInt(assessmentData.maxMarks),
      percentage: Math.round((assessmentData.marks / assessmentData.maxMarks) * 100),
    };

    console.log("Payload to submit:", payload);
    try {
      if (existingAssessmentId) {
        await updateAssessment(existingAssessmentId, payload);
        setShowUpdateAlert(true);
        setTimeout(() => { setShowUpdateAlert(false); }, 2000);
      } else {
        await createAssessment(trainee.traineeId, payload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!trainee?.traineeId) {
      setCompletedSubTopics([]);
      return;
    }

    const loadData = async () => {
      try {
        const response = await fetchCompletedSubTopics();

        const rawData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        // ✅ APPLY SAME LOGIC TO SYLLABUS
        const completedSyllabus = getCompletedSyllabusData(
          rawData,
          trainee.traineeId
        );


        setSyllabusData(completedSyllabus);

        // ✅ dropdown ke liye flat subtopic list
        const subTopicOptions = completedSyllabus.flatMap(syllabus =>
          syllabus.subTopics.map(subTopic => ({
            value: subTopic.subTopicId,
            label: `${syllabus.title} - ${subTopic.stepNumber}. ${subTopic.name}`,
            title: syllabus.title
          }))
        );

        setCompletedSubTopics(subTopicOptions);
      } catch (error) {
        console.error("Error fetching completed syllabus", error);
        setSyllabusData([]);
        setCompletedSubTopics([]);
      }
    };

    loadData();
  }, [trainee?.traineeId]);


  if (!isOpen) return null;



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

  const handleSyllabusChange = values => {
    let selected = Array.isArray(values) ? values : [values];

    if (selected.includes("ALL")) {
      selected = syllabusOptions
        .filter(opt => opt.value !== "ALL")
        .map(opt => opt.value);
    }

    setSelectedSyllabus(selected);
    //handleInputChange("syllabusTitles", selected);
    setSelectedSubTopics([]);
    handleInputChange("subTopicIds", []);
  };

  const handleSubTopicChange = values => {
    let selected = Array.isArray(values) ? values : [values];

    if (selected.includes("ALL_SUBTOPICS")) {
      selected = filteredSubTopicOptions
        .filter(opt => opt.value !== "ALL_SUBTOPICS")
        .map(opt => opt.value);
    }

    setSelectedSubTopics(selected);
    handleInputChange("subTopicIds", selected);
  };

  const getCompletedSyllabusData = (data, traineeId) => {
    return data
      .map(syllabus => {
        const completedSubTopics = syllabus.subTopics?.filter(subTopic =>
          subTopic.stepProgress?.some(
            progress =>
              progress.checker === true &&
              progress.complete === true &&
              progress.user?.empid === traineeId
          )
        );

        // ❌ syllabus hide if no valid subtopics
        if (!completedSubTopics || completedSubTopics.length === 0) {
          return null;
        }

        return {
          ...syllabus,
          subTopics: completedSubTopics
        };
      })
      .filter(Boolean);
  };

  // ---------------- UI ----------------
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{existingAssessmentId ? "Update Assessment" : "Add Assessment"}</h2>
            <p className="text-sm text-muted-foreground">{trainee?.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {assessmentList.length > 0 && (
            <div className="col-span-1 border rounded-lg p-3 space-y-2">
              {assessmentList.map(a => (
                <div
                  key={a.assessmentId}
                  onClick={() => populateForm(a)}
                  className={`p-3 rounded cursor-pointer border
                    ${existingAssessmentId === a.assessmentId ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{a.assessmentType}</span>
                    <span>{a.marks}/{a.maxMarks}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.assessmentDate}</p>
                </div>
              ))}
            </div>
          )}

          <div className={assessmentList.length > 0 ? "col-span-2" : "col-span-3"}>
            {showUpdateAlert && (
              <div className="mb-4 bg-green-50 text-green-700 border border-green-200 p-3 rounded text-sm">
                ✅ Assessment updated successfully
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Select
                  label="Assessment Type"
                  options={assessmentTypeOptions}
                  value={assessmentData.assessmentType}
                  onChange={(v) => handleInputChange('assessmentType', v)}
                  error={errors.assessmentType}
                />
                <Input
                  label="Assessment Date"
                  type="date"
                  value={assessmentData.assessmentDate}
                  onChange={(e) => handleInputChange('assessmentDate', e.target.value)}
                />
                <Input
                  label="Marks Obtained"
                  type="number"
                  value={assessmentData.marks}
                  onChange={(e) => handleInputChange('marks', e.target.value)}
                  error={errors.marks}
                />
                <Input
                  label="Maximum Marks"
                  type="number"
                  value={assessmentData.maxMarks}
                  onChange={(e) => handleInputChange('maxMarks', e.target.value)}
                />

              </div>

              {assessmentData?.marks && assessmentData?.maxMarks && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Percentage:</span>
                    <span className="text-lg font-bold text-primary">
                      {Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((parseInt(assessmentData?.marks) / parseInt(assessmentData?.maxMarks)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  {/* SYLLABUS MULTI SELECT */}
                  <Select
                    label="Syllabus"
                    options={syllabusOptions}
                    value={selectedSyllabus}
                    onChange={handleSyllabusChange}
                    multiple
                    searchable
                  />

                  {/* ✅ SELECTED SYLLABUS CHIPS – JUST BELOW */}
                  {selectedSyllabus.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Selected Syllabus
                      </p>

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
                    </div>
                  )}

                </div>


                <div className="space-y-3">
                  {/* 🔹 DROPDOWN */}
                  <Select
                    label="Completed Sub Topics"
                    options={filteredSubTopicOptions}
                    value={selectedSubTopics}
                    onChange={handleSubTopicChange}
                    multiple
                    searchable
                  />



                  {/* 🔹 SELECTED SUBTOPICS DISPLAY */}
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
              <textarea
                rows={4}
                className="w-full border rounded-lg p-2"
                placeholder="Remarks"
                value={assessmentData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
              />
              {errors.remarks && <p className="text-error text-sm">{errors.remarks}</p>}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={isSubmitting}>Save Assessment</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentEntryModal;
