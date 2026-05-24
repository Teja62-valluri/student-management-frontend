import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import DeleteModal from "../components/DeleteModal";
import useToast from "../hooks/useToast";
import studentService from "../services/studentService";

function getDeptClass(dept) {
  const d = (dept || "").toLowerCase();

  if (d.includes("comput") || d.includes("cs") || d.includes("it")) {
    return "dept-cs";
  }

  if (d.includes("engi")) {
    return "dept-eng";
  }

  if (d.includes("math")) {
    return "dept-math";
  }

  if (d.includes("phys")) {
    return "dept-phys";
  }

  if (
    d.includes("busi") ||
    d.includes("mba") ||
    d.includes("commerce")
  ) {
    return "dept-biz";
  }

  if (
    d.includes("art") ||
    d.includes("design") ||
    d.includes("media")
  ) {
    return "dept-arts";
  }

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

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const fetchStudents = () => {
    setLoading(true);

    studentService
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setStudents(data);
      })
      .catch(() => {
        toast.error(
          "Failed to load students. Check your Spring Boot backend.",
          "Load Error"
        );

        setStudents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) {
      return students;
    }

    return students.filter((s) => {
      return (
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.department || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q) ||
        String(s.id || "").includes(q)
      );
    });
  }, [students, search]);

  const handleDelete = (id) => {
    setIsDeleting(true);

    studentService
      .delete(id)
      .then(() => {
        setStudents((prev) =>
          prev.filter((student) => student.id !== id)
        );

        setDeleteTarget(null);

        toast.success(
          "Student deleted successfully.",
          "Deleted"
        );
      })
      .catch((err) => {
        toast.error(
          err.message || "Failed to delete student.",
          "Delete Error"
        );
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <Layout
      title="Students"
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Students", path: "/students" },
      ]}
      toasts={toast.toasts}
      removeToast={toast.removeToast}
    >
      <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h1>Students</h1>

          <p>
            {loading
              ? "Loading..."
              : `${filtered.length} student${
                  filtered.length !== 1 ? "s" : ""
                }${search ? " found" : " total"}`}
          </p>
        </div>

        <Link
          to="/students/add"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <i className="bi bi-person-plus-fill"></i>
          Add Student
        </Link>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h5>
            <i className="bi bi-people-fill me-2 text-primary"></i>
            Student Records
          </h5>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="search-wrapper">
              <i className="bi bi-search"></i>

              <input
                type="search"
                className="form-control search-input"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              style={{
                height: 38,
                fontSize: 13,
              }}
              onClick={fetchStudents}
              disabled={loading}
            >
              <i
                className={`bi bi-arrow-clockwise ${
                  loading ? "spin" : ""
                }`}
              ></i>

              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching students..." />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {search ? (
                <i className="bi bi-search"></i>
              ) : (
                <i className="bi bi-person-x"></i>
              )}
            </div>

            <h5>
              {search
                ? "No matching students"
                : "No students found"}
            </h5>

            <p>
              {search
                ? `No students match "${search}".`
                : "Add your first student to begin."}
            </p>

            {!search && (
              <Link
                to="/students/add"
                className="btn btn-primary"
              >
                <i className="bi bi-person-plus-fill me-2"></i>
                Add First Student
              </Link>
            )}

            {search && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearch("")}
              >
                <i className="bi bi-x me-1"></i>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th style={{ textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((student, index) => (
                  <tr key={student.id}>
                    <td
                      style={{
                        color: "#94a3b8",
                        fontSize: 13,
                        width: 48,
                      }}
                    >
                      {index + 1}
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="student-avatar">
                          {getInitials(student.name)}
                        </div>

                        <div>
                          <div className="student-name">
                            {student.name}
                          </div>

                          <div className="student-email">
                            {student.email || (
                              <span
                                style={{
                                  color: "#cbd5e1",
                                }}
                              >
                                No email
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`dept-badge ${getDeptClass(
                          student.department
                        )}`}
                      >
                        {student.department || "—"}
                      </span>
                    </td>

                    <td style={{ color: "#64748b" }}>
                      {student.phone ? (
                        <span className="d-flex align-items-center gap-1">
                          <i
                            className="bi bi-telephone"
                            style={{ fontSize: 12 }}
                          ></i>

                          {student.phone}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>
                          —
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          to={`/students/edit/${student.id}`}
                          className="btn-action edit"
                          title="Edit student"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </Link>

                        <button
                          className="btn-action delete"
                          title="Delete student"
                          onClick={() =>
                            setDeleteTarget(student)
                          }
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f1f5f9",
              fontSize: 13,
              color: "#94a3b8",
            }}
          >
            Showing {filtered.length} of {students.length} records

            {search && (
              <button
                style={{
                  marginLeft: 10,
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      <DeleteModal
        student={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </Layout>
  );
}

export default StudentsPage;