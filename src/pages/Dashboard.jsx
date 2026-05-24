import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import useToast from "../hooks/useToast";
import studentService from "../services/studentService";

const DEPT_COLORS = [
  "dept-cs", "dept-eng", "dept-math", "dept-phys", "dept-biz", "dept-arts", "dept-other",
];

function getDeptClass(dept) {
  const d = (dept || "").toLowerCase();
  if (d.includes("comput") || d.includes("cs") || d.includes("it"))     return "dept-cs";
  if (d.includes("engi"))                                                 return "dept-eng";
  if (d.includes("math"))                                                 return "dept-math";
  if (d.includes("phys"))                                                 return "dept-phys";
  if (d.includes("busi") || d.includes("mba") || d.includes("commerce")) return "dept-biz";
  if (d.includes("art") || d.includes("design") || d.includes("media"))  return "dept-arts";
  return "dept-other";
}

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function buildDeptStats(students) {
  const map = {};
  students.forEach((s) => {
    const key = s.department || "Unknown";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const toast = useToast();

  useEffect(() => {
    studentService
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setStudents(data);
      })
      .catch(() => {
        toast.error("Could not connect to the API. Make sure your Spring Boot server is running at localhost:8080.", "Connection Error");
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const deptStats  = buildDeptStats(students);
  const maxCount   = deptStats.length ? Math.max(...deptStats.map((d) => d[1])) : 1;
  const recent     = [...students].slice(-5).reverse();

  return (
    <Layout
      title="Dashboard"
      breadcrumbs={[{ label: "Dashboard", path: "/" }]}
      toasts={toast.toasts}
      removeToast={toast.removeToast}
    >
      {/* Page header */}
      <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h1>Welcome back, Admin</h1>
          <p>Here's what's happening with your students today.</p>
        </div>
        <Link to="/students/add" className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-person-plus-fill" />
          Add Student
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading dashboard data..." />
      ) : (
        <>
          {/* Stat cards */}
          <div className="row g-3 mb-4">
            {[
              {
                icon: "bi-people-fill",
                color: "blue",
                label: "Total Students",
                value: students.length,
                change: "All time",
                changeIcon: "bi-people",
                changeClass: "up",
              },
              {
                icon: "bi-building",
                color: "green",
                label: "Departments",
                value: new Set(students.map((s) => s.department).filter(Boolean)).size,
                change: "Active departments",
                changeIcon: "bi-check-circle",
                changeClass: "up",
              },
              {
                icon: "bi-person-check-fill",
                color: "purple",
                label: "Enrolled",
                value: students.length,
                change: "Current semester",
                changeIcon: "bi-calendar-check",
                changeClass: "up",
              },
              {
                icon: "bi-envelope-fill",
                color: "orange",
                label: "With Email",
                value: students.filter((s) => s.email).length,
                change: "Contact info available",
                changeIcon: "bi-envelope",
                changeClass: "up",
              },
            ].map((card) => (
              <div className="col-12 col-sm-6 col-xl-3" key={card.label}>
                <div className="stat-card">
                  <div className={`stat-icon ${card.color}`}>
                    <i className={`bi ${card.icon}`} />
                  </div>
                  <div className="stat-value">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                  <div className={`stat-change ${card.changeClass}`}>
                    <i className={`bi ${card.changeIcon}`} />
                    {card.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            {/* Dept distribution */}
            <div className="col-12 col-lg-6">
              <div className="table-card h-100">
                <div className="table-card-header">
                  <h5>
                    <i className="bi bi-bar-chart-fill me-2 text-primary" />
                    Students by Department
                  </h5>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  {deptStats.length === 0 ? (
                    <div className="empty-state" style={{ padding: "30px 20px" }}>
                      <div className="empty-icon">
                        <i className="bi bi-bar-chart" />
                      </div>
                      <p>No department data available yet.</p>
                    </div>
                  ) : (
                    deptStats.map(([dept, count]) => (
                      <div key={dept} className="dept-bar-row">
                        <span className="dept-bar-label">{dept}</span>
                        <div className="dept-bar-track">
                          <div
                            className="dept-bar-fill"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="dept-bar-count">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent students */}
            <div className="col-12 col-lg-6">
              <div className="table-card h-100">
                <div className="table-card-header">
                  <h5>
                    <i className="bi bi-clock-history me-2 text-primary" />
                    Recently Added
                  </h5>
                  <Link
                    to="/students"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ fontSize: 13 }}
                  >
                    View All
                  </Link>
                </div>
                <div style={{ padding: "8px 24px 16px" }}>
                  {recent.length === 0 ? (
                    <div className="empty-state" style={{ padding: "30px 20px" }}>
                      <div className="empty-icon">
                        <i className="bi bi-person-x" />
                      </div>
                      <p>No students added yet.</p>
                      <Link to="/students/add" className="btn btn-sm btn-primary">
                        Add First Student
                      </Link>
                    </div>
                  ) : (
                    recent.map((s) => (
                      <div key={s.id} className="recent-student-row">
                        <div
                          className="student-avatar"
                          style={{ borderRadius: 10 }}
                        >
                          {getInitials(s.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: "#0f172a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>
                            {s.email || "No email"}
                          </div>
                        </div>
                        <span
                          className={`dept-badge ${getDeptClass(s.department)}`}
                        >
                          {s.department || "—"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Dashboard;
