import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import {
  fetchAssessmentsByTrainee,
  createAssessment,
  updateAssessment, fetchCompletedSubTopics
} from "../../../api_service";

const AssessmentEntryModal = ({ isOpen, onClose, trainee }) => {

  /* ---------------- STATES ---------------- */
  const [assessmentList, setAssessmentList] = useState([]);
  const [existingAssessmentId, setExistingAssessmentId] = useState(null);
  const [apiError, setApiError] = useState('');
  const [completedSubTopics, setCompletedSubTopics] = useState([]);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);


  const [assessmentData, setAssessmentData] = useState({
    traineeId: '',
    assessmentType: '',
    marks: '',
    maxMarks: '100',
    remarks: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    subTopicId: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- OPTIONS ---------------- */
  const assessmentTypeOptions = [
    { value: 'weekly', label: 'Weekly Assessment' },
    { value: 'monthly', label: 'Monthly Assessment' },
    { value: 'module', label: 'Module Assessment' },
    { value: 'practical', label: 'Practical Assessment' },
    { value: 'project', label: 'Project Assessment' }
  ];

  useEffect(() => {
    if (!isOpen) return;

    setAssessmentList([]);
    setExistingAssessmentId(null);
    setApiError('');
    setErrors({});

    setAssessmentData({
      traineeId: trainee?.traineeId || '',
      assessmentType: '',
      marks: '',
      maxMarks: '100',
      remarks: '',
      assessmentDate: new Date().toISOString().split('T')[0]
    });

  }, [isOpen, trainee?.traineeId]);




  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!isOpen || !trainee?.traineeId) return;

    const loadAssessments = async () => {
      try {
        const res = await fetchAssessmentsByTrainee(trainee.traineeId);
        const list = Array.isArray(res?.data) ? res.data : [];

        if (list.length === 0) {
          setApiError('Assessment data not found');
          setAssessmentList([]);
          setCompletedSubTopics([]);
          return;
        }

        setAssessmentList(list);

        // 🔹 Build subTopic dropdown from all subTopics in assessment data
        const subTopicsFromAssessments = list
          .map(a => a.subTopic)
          .filter(Boolean)
          .map(st => {
            if (typeof st === 'object') {
              return { id: st.id, name: st.name };
            } else if (typeof st === 'number') {
              return { id: st, name: `SubTopic ${st}` }; // fallback name
            }
            return null;
          })
          .filter(Boolean);

        setCompletedSubTopics(subTopicsFromAssessments);

        // 🔹 Populate first assessment in form
        populateForm(list[0]);

      } catch (err) {
        console.error(err);
      }
    };

    loadAssessments();
  }, [isOpen, trainee?.traineeId]);


  /* ---------------- POPULATE FORM ---------------- */
  const populateForm = (a) => {
    if (!a?.assessmentId) return;

    setExistingAssessmentId(a.assessmentId);

    const subTopicId =
      a.subTopic && typeof a.subTopic === 'object' ? a.subTopic.id :
        typeof a.subTopic === 'number' ? a.subTopic :
          '';

    setAssessmentData({
      traineeId: trainee.traineeId,
      assessmentType: a.assessmentType?.toLowerCase() || '',
      marks: String(a.marks || ''),
      maxMarks: String(a.maxMarks || '100'),
      remarks: a.remarks || '',
      assessmentDate: a.assessmentDate
        ? new Date(a.assessmentDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      subTopicId
    });
  };


  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (field, value) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!assessmentData.assessmentType)
      newErrors.assessmentType = 'Required';

    if (!assessmentData.marks)
      newErrors.marks = 'Required';

    if (!assessmentData.remarks || assessmentData.remarks.length < 10)
      newErrors.remarks = 'Minimum 10 characters';

    if (!assessmentData.subTopicId) newErrors.subTopicId = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...assessmentData,
      marks: parseInt(assessmentData.marks),
      maxMarks: parseInt(assessmentData.maxMarks),
      percentage: Math.round(
        (assessmentData.marks / assessmentData.maxMarks) * 100
      )
    };

    try {
      if (existingAssessmentId) {
        await updateAssessment(existingAssessmentId, payload);

        // ✅ UPDATE SUCCESS ALERT
        setShowUpdateAlert(true);

        // 2 sec baad modal close
        setTimeout(() => {
          setShowUpdateAlert(false);
          onClose();
        }, 2000);

      } else {
        await createAssessment(trainee.traineeId, payload);
        onClose();
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* HEADER (X preserved) */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {existingAssessmentId ? "Update Assessment" : "Add Assessment"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {trainee?.name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">

          {/* LEFT LIST (ONLY IF DATA EXISTS) */}
          {assessmentList.length > 0 && (
            <div className="col-span-1 border rounded-lg p-3 space-y-2">
              {assessmentList.map(a => (
                <div
                  key={a.assessmentId}
                  onClick={() => populateForm(a)}
                  className={`p-3 rounded cursor-pointer border
                    ${existingAssessmentId === a.assessmentId
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'}`}
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{a.assessmentType}</span>
                    <span>{a.marks}/{a.maxMarks}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {a.assessmentDate}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* FORM (UNCHANGED UI) */}
          <div className={assessmentList.length > 0 ? "col-span-2" : "col-span-3"}>
            {showUpdateAlert && (
              <div className="mb-4 bg-green-50 text-green-700 border border-green-200 p-3 rounded text-sm">
                ✅ Assessment updated successfully
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {trainee && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {trainee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{trainee?.name}</p>
                      <p className="text-sm text-muted-foreground">{trainee?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Current Progress: {trainee?.completionPercentage}% - {trainee?.currentStep}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                <Select
                  label="Select Sub Topic"
                  required
                  options={completedSubTopics.map(st => ({ value: st.id, label: st.name }))}
                  value={assessmentData.subTopicId}
                  onChange={(v) => handleInputChange('subTopicId', v)}
                  error={errors.subTopicId}
                  searchable
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
                <Button type="submit" loading={isSubmitting}>
                  Save Assessment
                </Button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssessmentEntryModal;
