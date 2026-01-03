import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
// const API_URL = "http://192.168.0.21:8085/TMS/api";
const API_URL = "http://localhost:8080/api";

console.log("API URL:", API_URL);

export const createAccount = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


export const sendOtp = async (trngId) => {
  try {
    const response = await axios.post(`${API_URL}/users/send-otp`, { trngId });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/users/verify-otp`, data); 
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const storeUserDetails = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/users/bulk-create`, data);
    return response.data;
  } catch (error) {
    console.error("Error storing user details:", error);
    throw error;
  }
};

export const fetchAllTrainees = async () => {
  const data = [
    {
      "userid": "2019Ws10019",
      "trngid": "Ws10111",
      "password": "$2a$10$uuitzF5IfvDByIhsOE5TieovEOJ6LyJJppMgaBjbECZBAaeLj0NnK",
      "username": "BB",
      "firstname": "BB",
      "lastname": "A",
      "emailid": "abs@gmail.bom",
      "phonenumber": "9787255965",
      "roleId": "R001",

    },
    {
      "userid": "2019wss123",
      "trngid": "wss123",
      "password": "$2a$10$2Z3nNVR5uGKJE33jSK9yreGFDwvktrzFuWwLb95IpQhex5eLOAk8e",
      "username": "wss123",
      "firstname": "BBB",
      "lastname": "A",
      "emailid": "wwm@gmail.com",
      "phonenumber": "987635616",
"roleId": "R001",
    },
    {
      "userid": "2019WS1155",
      "trngid": "WS1155",
      "password": "$2a$10$G7szEGln2OiGaqVA0SnUpu0mN7EeaS3JpLpC83OSD35sYSholZL3C",
      "username": null,
      "firstname": "Aswathi",
      "lastname": null,
      "emailid": "aswathi.ravindran@whitestones.co.in",
      "phonenumber": "09787255964",
"roleId": "R001",
    },
    {
      "userid": "2019WS1122",
      "trngid": "WS1122",
      "password": "$2a$10$VVz9JDazDVsGjfj3L5AzYeWPs1LCvU/HT6kcqUr55TRHVGJguIzGa",
      "username": "Arunmaran",
      "firstname": "Arunmaran",
      "lastname": "Murugasen",
      "emailid": "arunmaran.murugesan@whitestones.co.in",
      "phonenumber": "9345287327",

    },
    {
      "userid": "2019WS10018",
      "trngid": "WS10018",
      "password": "$2a$10$qECY9SHPCdM1cA16TuC9.eDKw7GrlLOCEoE27iJuP9HlAEYFftVOm",
      "username": "Britto",
      "firstname": "Brit",
      "lastname": "A",
      "emailid": "abs@gmail.bom",
      "phonenumber": "02345678444",

    },
    {
      "userid": "2019WS10009",
      "trngid": "WS10009",
      "password": "$2a$10$dCrmV.cSDhplIYnAvyNUR.XNiUn9d/pmW87uGj3AT79BN6dur8bum",
      "username": "ANBU",
      "firstname": "ANBU",
      "lastname": "S",
      "emailid": "anbarasan.sekar@whitestones.in",
      "phonenumber": "9788313457",
    }
  ]
  try {
    const alreadyCreated = localStorage.getItem("bulkUsersCreated");

    if (!alreadyCreated) {
      await storeUserDetails(data);
      localStorage.setItem("bulkUsersCreated", "true");
    }
    const response = await axios.get(`${API_URL}/users/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trainees:", error);
    throw error;
  }
};


export const createAssessment = async (empId, data) => {
  try {
    const response = await axios.post(`${API_URL}/assessments/create/${empId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
};

export const fetchAllAssessments = async () => {
  try {
    const response = await axios.get(`${API_URL}/assessments/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};




export const fetchAssessmentsByTrainee = async (empId) => {
  try {
    const response = await axios.get(`${API_URL}/assessments/trainee/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments for trainee:", error);
    throw error;
  }
};



export const fetchAllTraineeSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trainee summary:", error);
    throw error;
  }
};




export const getAllTrainers = async () => {
  try {
    const res = await axios.get(`${API_URL}/trainers/all`);
    return res.data;
  } catch (error) {
    console.error("Error fetching trainers:", error);
    throw error;
  }
};

// export const addTrainer = async (data) => {
//   try {
//     const res = await axios.post(`${API_URL}/trainers/add`, data);
//     return res.data;
//   } catch (error) {
//     console.error("Error adding trainer:", error);
//     throw error;
//   }
// };

export const createSchedule = async (trainerId, data) => {
  try {
    const res = await axios.post(`${API_URL}/schedule/create/${trainerId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

export const assignTrainees = async (scheduleId, traineeList) => {
  try {
    const res = await axios.post(`${API_URL}/schedule/assign/${scheduleId}`, traineeList);
    return res.data;
  } catch (error) {
    console.error("Error assigning trainees:", error);
    throw error;
  }
};

export const getAllSchedules = async () => {
  try {
    const res = await axios.get(`${API_URL}/schedule/all`);
    return res.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const uploadSyllabusAPI = async (formData) => {
  // const res = await axios.post(`${API_URL}/syllabus/add`, formData);
  const res = await axios.post(`${API_URL}/syllabus/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const getAllSyllabusAPI = async () => {
  const res = await axios.get(`${API_URL}/syllabus/all`);
  return res;
};

export const updateSyllabusAPI = async (id, formData) => {
  const res = await axios.put(`${API_URL}/syllabus/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};



export const fetchAllSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/schedule/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};


export const getSyllabusByIdAPI = async (id) => {
  //return await axios.get(`${API_URL}/syllabus/` + id);
  try {
    const response = axios.get(`${API_URL}/syllabus/` + id);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};





// export const updateStepProgress = async (empId, stepId, progress) => {
//   const payload = { empId, stepId, progress };
//   const response = await fetch("http://localhost:8080/api/progress/update-step", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) throw new Error("Failed to update step progress");
//   return await response.json(); // contains overallProgress
// };


// export const fetchSteps = async (empId) => {
//   const res = await axios.get(`${API_URL}/steps/${empId}`);
//   return res.data;
// };

export const updateStepProgress = async (empId, stepId, progress, durationTime) => {
  const res = await axios.post(`${API_URL}/progress/update-step`, {
    empId,
    stepId,
    progress,
    durationTime
  });
  return res.data;
};

export const getOverallProgressTime = async (empId) => {
  const response = await axios.get(`http://localhost:8080/api/progress/overall-time?empId=${empId}`);
  return response.data.overallTimeSeconds;
};


export const fetchUserByEmpId = async (empId) => {
  try {
    const res = await axios.get(`${API_URL}/users/${empId}`);

    // API response format:
    // { status: 200, success: true, message: "...", data: {...user} }

    return res.data.data; // return actual user object
  } catch (error) {
    console.error("Error fetching user by empId:", error);
    throw error;
  }
};

// export const fetchInterviewScheduleByEmpId = async (empId) => {
//   try {
//     const res = await axios.get(`${API_URL}/schedule/user/${empId}`);
//     return res.data; // return list of interviews
//   } catch (error) {
//     console.error("Error fetching interview schedule:", error);
//     throw error;
//   }
// };

export const fetchInterviewScheduleByEmpId = async (empId) => {

  try {
    const response = await axios.get(`${API_URL}/schedule/user-interview/${empId}`);

    // Pure accurate data return karenge
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const fetchStepByEmpId = async (empId) => {
  try {
    const response = await axios.get(
      `${API_URL}/step-progress/emp/${empId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};


export const startSubTopic = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/step-progress/start`, formData);
    return response.data;
  } catch (error) {
    console.error("Error starting subtopic:", error);
    throw error;
  }
}


export const completeSubTopic = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/step-progress/complete`, formData);
    return response.data;
  } catch (error) {
    console.error("Error completing subtopic:", error);
    throw error;
  }
}

export const fetchCompletedSubTopics = async () => {
  try {
    const response = await axios.get(`${API_URL}/syllabus/all-progress`);
    return response;
  } catch (error) {
    console.error("Error fetching completed subtopics:", error);
    throw error;
  }
}


// export const approveSubTopicAPI = async (progressId) => {
//   try {
//     const response = await fetch(
//       `${API_URL}/step-progress/approve/${progressId}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to approve subtopic");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Approve API error:", error);
//     throw error;
//   }
// };

export const approveSubTopicAPI = async (progressId, review = "") => {
  const url = review
    ? `${API_URL}/step-progress/approve/${progressId}?review=${encodeURIComponent(review)}`
    : `${API_URL}/step-progress/approve/${progressId}`;

  const response = await fetch(url, { method: "PUT" });

  if (!response.ok) {
    throw new Error("Failed to approve subtopic");
  }

  return response.json();
};


// export const rejectSubTopicAPI = async (progressId, review) => {
//   try {
//     const response = await fetch(
//       `${API_URL}/step-progress/reject/${progressId}?review=${encodeURIComponent(review)}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to reject subtopic");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Reject API error:", error);
//     throw error;
//   }
// };

export const rejectSubTopicAPI = async (progressId, review) => {
  if (!review || review.trim() === "") {
    throw new Error("Review is required for rejection");
  }

  const response = await fetch(
    `${API_URL}/step-progress/reject/${progressId}?review=${encodeURIComponent(review)}`,
    { method: "PUT" }
  );

  if (!response.ok) {
    throw new Error("Failed to reject subtopic");
  }

  return response.json();
};


export const fetchSyllabusProgressByEmpId = async (empid) => {
  try {
    const response = await axios.get(
      `${API_URL}/syllabus/all-progress/${empid}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching syllabus progress by empid:", error);
    throw error;
  }
};



const fetchSyllabusProgress = async (empId) => {
  const res = await fetch(
    `http://localhost:8080/api/syllabus/all-progress/${empId}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend error:", text);
    throw new Error("Failed to fetch syllabus progress");
  }

  return await res.json(); // ✅ guaranteed JSON
};
