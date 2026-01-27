// import React, { useState } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';
// import Input from '../../../components/ui/Input';
// import Select from '../../../components/ui/Select';

// const TraineeSelector = ({ 
//   selectedTrainee, 
//   onTraineeSelect, 
//   trainees = [],
//   className = '' 
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStep, setFilterStep] = useState('');

//   const stepOptions = [
//     { value: '', label: 'All Steps' },
//     { value: '1', label: 'Step 1: Foundation' },
//     { value: '2', label: 'Step 2: Intermediate' },
//     { value: '3', label: 'Step 3: Advanced' },
//     { value: '4', label: 'Step 4: Specialization' },
//     { value: '5', label: 'Step 5: Final Assessment' }
//   ];

//   const filteredTrainees = trainees?.filter(trainee => {
//     const matchesSearch = trainee?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
//                          trainee?.empid?.toLowerCase()?.includes(searchTerm?.toLowerCase());
//     const matchesStep = !filterStep || trainee?.currentStep?.toString() === filterStep;
//     return matchesSearch && matchesStep;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'text-success bg-success/10';
//       case 'pending': return 'text-warning bg-warning/10';
//       case 'completed': return 'text-primary bg-primary/10';
//       default: return 'text-muted-foreground bg-muted';
//     }
//   };

//   const getProgressPercentage = (currentStep, totalSteps = 5) => {
//     return Math.round((currentStep / totalSteps) * 100);
//   };

//   return (
//     <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">Select Trainee</h2>
//           <p className="text-sm text-muted-foreground">Choose a trainee to assess</p>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//           <Icon name="Users" size={16} />
//           <span>{filteredTrainees?.length} trainees</span>
//         </div>
//       </div>
//       {/* Search and Filter Controls */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <Input
//           type="search"
//           placeholder="Search by name or employee ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e?.target?.value)}
//           className="w-full"
//         />
//         <Select
//           options={stepOptions}
//           value={filterStep}
//           onChange={setFilterStep}
//           placeholder="Filter by current step"
//         />
//       </div>
//       {/* Trainees List */}
//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {filteredTrainees?.length === 0 ? (
//           <div className="text-center py-8">
//             <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground">No trainees found matching your criteria</p>
//           </div>
//         ) : (
//           filteredTrainees?.map((trainee) => (
//             <div
//               key={trainee?.empid}
//               className={`border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 hover:elevation-1 ${
//                 selectedTrainee?.empid === trainee?.empid
//                   ? 'border-primary bg-primary/5' :'hover:border-primary/50'
//               }`}
//               onClick={() => onTraineeSelect(trainee)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                     <Icon name="User" size={20} className="text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-foreground">{trainee?.username}</h3>
//                     <p className="text-sm text-muted-foreground">ID: {trainee?.empid}</p>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <span className="text-xs text-muted-foreground">Step {trainee?.currentStep || 0}/5</span>
//                       <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-primary transition-all duration-300"
//                           style={{ width: `${getProgressPercentage(trainee?.currentStep || 0)}%` }}
//                         />
//                       </div>
//                       <span className="text-xs text-muted-foreground">
//                         {getProgressPercentage(trainee?.currentStep || 0)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainee?.status || 'active')}`}>
//                     {trainee?.status}
//                   </span>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Last assessment: {trainee?.lastAssessment || 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       {/* Selected Trainee Summary */}
//       {selectedTrainee && (
//         <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-medium text-foreground">Selected: {selectedTrainee?.name}</h4>
//               <p className="text-sm text-muted-foreground">
//                 Current Step: {selectedTrainee?.currentStep} | Status: {selectedTrainee?.status}
//               </p>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onTraineeSelect(null)}
//               iconName="X"
//               iconSize={16}
//             >
//               Clear
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TraineeSelector;


import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TraineeSelector = ({
  selectedTrainee,
  onTraineeSelect,
  trainees = [],
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStep, setFilterStep] = useState('');

  // const stepOptions = [
  //   { value: '', label: 'All Steps' },
  //   { value: '1', label: 'Step 1: Foundation' },
  //   { value: '2', label: 'Step 2: Intermediate' },
  //   { value: '3', label: 'Step 3: Advanced' },
  //   { value: '4', label: 'Step 4: Specialization' },
  //   { value: '5', label: 'Step 5: Final Assessment' }
  // ];

  const filteredTrainees = trainees?.filter(trainee => {
    const matchesSearch = trainee?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      trainee?.empid?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStep = !filterStep || trainee?.currentStep?.toString() === filterStep;
    return matchesSearch && matchesStep;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'completed': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressPercentage = (currentStep, totalSteps = 5) => {
    return Math.round((currentStep / totalSteps) * 100);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Select Trainee</h2>
          <p className="text-sm text-muted-foreground">Choose a trainee to assess</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Users" size={16} />
          <span>{filteredTrainees?.length} trainees</span>
        </div>
      </div>
      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search by name or employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
        {/* <Select
          options={stepOptions}
          value={filterStep}
          onChange={setFilterStep}
          placeholder="Filter by current step"
        /> */}
      </div>
      {/* Trainees List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTrainees?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No trainees found matching your criteria</p>
          </div>
        ) : (
          filteredTrainees?.map((trainee) => (
            <div
              key={trainee?.trngid}
              className={`border border-border rounded-lg p-4 cursor-pointer transition-all duration-150 hover:elevation-1 ${selectedTrainee?.trngid === trainee?.trngid
                ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
              onClick={() => onTraineeSelect(trainee)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{trainee?.username}</h3>
                    <p className="text-sm text-muted-foreground">ID: {trainee?.trngid}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">Step {trainee?.currentStep || 0}/5</span>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${getProgressPercentage(trainee?.currentStep || 0)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getProgressPercentage(trainee?.currentStep || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainee?.status || 'active')}`}>
                    {trainee?.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last assessment: {trainee?.lastAssessment || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Selected Trainee Summary */}
      {selectedTrainee && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Selected: {selectedTrainee?.name}</h4>
              <p className="text-sm text-muted-foreground">
                Current Step: {selectedTrainee?.currentStep} | Status: {selectedTrainee?.status}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTraineeSelect(null)}
              iconName="X"
              iconSize={16}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeSelector;