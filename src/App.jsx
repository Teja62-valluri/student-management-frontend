import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import EditStudentPage from "./pages/EditStudentPage";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="/"                    element={<Dashboard />} />
        <Route path="/students"            element={<StudentsPage />} />
        <Route path="/students/add"        element={<AddStudentPage />} />
        <Route path="/students/edit/:id"   element={<EditStudentPage />} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
