import axios from "axios";

// Backend base URL (NO /students here — keep it clean)
const BASE_URL =
  "https://student-management-backend-1-1f4n.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optional: better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Something went wrong";

    return Promise.reject(
      new Error(
        typeof message === "string"
          ? message
          : JSON.stringify(message)
      )
    );
  }
);

// Student Service
const studentService = {
  
  // GET ALL STUDENTS
  getAll: () => api.get("/students"),

  // GET STUDENT BY ID
  getById: (id) => api.get(`/students/${id}`),

  // CREATE STUDENT
  create: (studentData) =>
    api.post("/students", studentData),

  // UPDATE STUDENT
  update: (id, studentData) =>
    api.put(`/students/${id}`, studentData),

  // DELETE STUDENT
  delete: (id) => api.delete(`/students/${id}`),
};

export default studentService;