import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import useToast from "../hooks/useToast";
import studentService from "../services/studentService";

const DEPARTMENTS = [
  "Computer Science",
  "Engineering",
  "Mathematics",
  "Physics",
  "Business Administration",
  "Arts & Design",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Chemistry",
  "Biology",
  "Economics",
  "Law",
  "Medicine",
  "Education",
  "Other",
];

const INITIAL_ERRORS = {
  name: "",
  department: "",
  email: "",
  phone: "",
};

function EditStudentPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const toast = useToast();

  const [form, setForm] = useState(null);

  const [errors, setErrors] = useState(INITIAL_ERRORS);

  const [loadError, setLoadError] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);

    studentService
      .getById(id)
      .then((res) => {
        const s = res.data;

        setForm({
          id: s.id || id,
          name: s.name || "",
          department: s.department || "",
          email: s.email || "",
          phone: s.phone || "",
        });
      })
      .catch((err) => {
        setLoadError(
          err.message || "Student not found."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const validate = () => {
    const e = { ...INITIAL_ERRORS };

    let valid = true;

    if (!form.name.trim()) {
      e.name = "Full name is required.";
      valid = false;
    } else if (form.name.trim().length < 2) {
      e.name =
        "Name must be at least 2 characters.";
      valid = false;
    }

    if (!form.department) {
      e.department =
        "Please select a department.";
      valid = false;
    }

    if (!form.email.trim()) {
      e.email = "Email address is required.";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      e.email =
        "Please enter a valid email address.";
      valid = false;
    }

    if (
      form.phone &&
      !/^\d{10}$/.test(form.phone.trim())
    ) {
      e.phone =
        "Phone number must contain exactly 10 digits.";
      valid = false;
    }

    setErrors(e);

    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    studentService
      .update(id, {
        id: Number(form.id),
        name: form.name.trim(),
        department: form.department,
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
      .then(() => {
        toast.success(
          `${form.name.trim()} updated successfully.`,
          "Student Updated"
        );

        navigate("/students");
      })
      .catch((err) => {
        toast.error(
          err.message ||
            "Failed to update student.",
          "Update Error"
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Layout
      title="Edit Student"
      breadcrumbs={[
        {
          label: "Dashboard",
          path: "/",
        },
        {
          label: "Students",
          path: "/students",
        },
        {
          label: "Edit Student",
          path: `/students/edit/${id}`,
        },
      ]}
      toasts={toast.toasts}
      removeToast={toast.removeToast}
    >
      <div className="page-header">
        <h1>Edit Student</h1>

        <p>
          Update the student information below.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading student..." />
      ) : loadError ? (
        <div className="alert alert-danger">
          {loadError}
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            {/* Student ID */}
            <div
              className="d-flex align-items-center gap-2 p-3 mb-4"
              style={{
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius: 10,
              }}
            >
              <i
                className="bi bi-person-badge"
                style={{
                  color: "#3b82f6",
                }}
              />

              <span>
                Editing Student ID :
                <strong
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {form.id}
                </strong>
              </span>
            </div>

            <div className="form-card">
              <div className="form-card-header">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background:
                        "linear-gradient(135deg,#f59e0b,#d97706)",
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      color: "#fff",
                      fontSize: 15,
                    }}
                  >
                    <i className="bi bi-pencil-fill" />
                  </div>

                  <div>
                    <h5
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      Edit Student
                    </h5>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      Update student details
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-card-body">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="row g-4">

                    {/* Student ID */}
                    <div className="col-12 col-md-6">
                      <label className="form-label">
                        Student ID
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={form.id}
                        disabled
                      />
                    </div>

                    {/* Name */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="name"
                      >
                        Full Name
                        <span
                          style={{
                            color: "#ef4444",
                          }}
                        >
                          *
                        </span>
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        className={`form-control ${
                          errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Student name"
                        value={form.name}
                        onChange={
                          handleChange
                        }
                      />

                      {errors.name && (
                        <div className="invalid-feedback">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    {/* Department */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="department"
                      >
                        Department
                        <span
                          style={{
                            color: "#ef4444",
                          }}
                        >
                          *
                        </span>
                      </label>

                      <select
                        id="department"
                        name="department"
                        className={`form-select ${
                          errors.department
                            ? "is-invalid"
                            : ""
                        }`}
                        value={
                          form.department
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="">
                          Select Department
                        </option>

                        {DEPARTMENTS.map(
                          (d) => (
                            <option
                              key={d}
                              value={d}
                            >
                              {d}
                            </option>
                          )
                        )}
                      </select>

                      {errors.department && (
                        <div className="invalid-feedback">
                          {
                            errors.department
                          }
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label"
                        htmlFor="email"
                      >
                        Email
                        <span
                          style={{
                            color: "#ef4444",
                          }}
                        >
                          *
                        </span>
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`form-control ${
                          errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="example@gmail.com"
                        value={form.email}
                        onChange={
                          handleChange
                        }
                      />

                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-12">
                      <label
                        className="form-label"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        className={`form-control ${
                          errors.phone
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={
                          handleChange
                        }
                      />

                      {errors.phone && (
                        <div className="invalid-feedback">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div
                    className="d-flex justify-content-between flex-wrap gap-3"
                    style={{
                      marginTop: 32,
                      paddingTop: 24,
                      borderTop:
                        "1px solid #f1f5f9",
                    }}
                  >
                    <Link
                      to="/students"
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-arrow-left me-2" />
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center gap-2"
                      disabled={
                        submitting
                      }
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2-circle" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default EditStudentPage;