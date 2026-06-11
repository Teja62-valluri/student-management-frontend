import axios from "axios";

// FIXED: Changed 'localhost' to '127.0.0.1' to force IPv4 connection pathways
const BASE_URL =
   "https://student-management-backend-1-1f4n.onrender.com";
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

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
const studentService = {

  // GET ALL: Targets http://127.0.0.1:8080/students
  getAll: () => api.get(""), 

  // GET BY ID: Targets http://127.0.0.1:8080/students/[id]
  getById: (id) => api.get(`${id}`), 

  // CREATE: Targets http://127.0.0.1:8080/students
  create: (studentData) =>
    api.post("", { 
      id: Number(studentData.id),
      name: studentData.name,
      email: studentData.email,
      department: studentData.department,
      phone: studentData.phone,
    }),

  // UPDATE: Targets http://127.0.0.1:8080/students/[id]
  update: (id, studentData) =>
    api.put(`${id}`, { 
      id: Number(id),
      name: studentData.name,
      email: studentData.email,
      department: studentData.department,
      phone: studentData.phone,
    }),

  // DELETE: Targets http://127.0.0.1:8080/students/[id]
  delete: (id) => api.delete(`${id}`),
};
export default studentService;