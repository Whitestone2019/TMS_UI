import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

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
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const fetchAllTrainees = async () => {
  try {
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
