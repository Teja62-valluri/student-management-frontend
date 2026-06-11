import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
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

const INITIAL_FORM = {
  id: "",
  name: "",
  department: "",
  email: "",
  phone: "",
};

const INITIAL_ERRORS = {
  id: "",
  name: "",
  department: "",
  email: "",
  phone: "",
};

function AddStudentPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = { ...INITIAL_ERRORS };
    let valid = true;

    // ID Validation
    if (!form.id.trim()) {
      e.id = "Student ID is required.";
      valid = false;
    } else if (!/^\d+$/.test(form.id.trim())) {
      e.id = "Student ID must contain only numbers.";
      valid = false;
    }

    // Name Validation
    if (!form.name.trim()) {
      e.name = "Full name is required.";
      valid = false;
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
      valid = false;
    }

    // Department Validation
    if (!form.department) {
      e.department = "Please select a department.";
      valid = false;
    }

    // Email Validation
    if (!form.email.trim()) {
      e.email = "Email address is required.";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      e.email = "Please enter a valid email address.";
      valid = false;
    }

    // Phone Validation
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
      valid = false;
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      e.phone = "Phone number must contain exactly 10 digits.";
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
      .create({
        id: Number(form.id),
        name: form.name.trim(),
        department: form.department,
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
      .then(() => {
        toast.success(
          `${form.name.trim()} has been added successfully.`,
          "Student Created"
        );

        navigate("/students");
      })
      .catch((err) => {
        toast.error(
          err.message || "Failed to add student.",
          "Create Error"
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
  };

  return (
    <Layout
      title="Add Student"
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Students", path: "/students" },
        { label: "Add Student", path: "/students/add" },
      ]}
      toasts={toast.toasts}
      removeToast={toast.removeToast}
    >
      <div className="page-header">
        <h1>Add New Student</h1>
        <p>Fill in the details below to register a new student.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">

          {/* INFO CARD */}
          <div
            className="d-flex align-items-start gap-3 p-3 mb-4"
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 10,
              fontSize: 14,
              color: "#1d4ed8",
            }}
          >
            <i
              className="bi bi-info-circle-fill"
              style={{ marginTop: 1 }}
            />

            <div>
  <strong>Backend API Status</strong> —
  Connected to live Spring Boot server and successfully fetching student data.
</div>
          </div>

          <div className="form-card">

            {/* HEADER */}
            <div className="form-card-header">
              <div className="d-flex align-items-center gap-2">

                <div
                  style={{
                    width: 36,
                    height: 36,
                    background:
                      "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 15,
                  }}
                >
                  <i className="bi bi-person-plus-fill" />
                </div>

                <div>
                  <h5
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Student Information
                  </h5>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    All fields are required
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="form-card-body">
              <form onSubmit={handleSubmit} noValidate>

                <div className="row g-4">

                  {/* ID */}
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="id">
                      Student ID *
                    </label>

                    <input
                      id="id"
                      name="id"
                      type="text"
                      className={`form-control ${
                        errors.id ? "is-invalid" : ""
                      }`}
                      placeholder="e.g. 101"
                      value={form.id}
                      onChange={handleChange}
                    />

                    {errors.id && (
                      <div className="invalid-feedback">
                        {errors.id}
                      </div>
                    )}
                  </div>

                  {/* NAME */}
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="name">
                      Full Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="e.g. Teja"
                      value={form.name}
                      onChange={handleChange}
                    />

                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* DEPARTMENT */}
                  <div className="col-12 col-md-6">
                    <label
                      className="form-label"
                      htmlFor="department"
                    >
                      Department *
                    </label>

                    <select
                      id="department"
                      name="department"
                      className={`form-select ${
                        errors.department ? "is-invalid" : ""
                      }`}
                      value={form.department}
                      onChange={handleChange}
                    >
                      <option value="">
                        -- Select Department --
                      </option>

                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {errors.department && (
                      <div className="invalid-feedback">
                        {errors.department}
                      </div>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="email">
                      Email Address *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="teja@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                    />

                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* PHONE */}
                  <div className="col-12">
                    <label className="form-label" htmlFor="phone">
                      Phone Number *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={handleChange}
                    />

                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone}
                      </div>
                    )}
                  </div>

                </div>

                {/* BUTTONS */}
                <div
                  className="d-flex align-items-center justify-content-between flex-wrap gap-3"
                  style={{
                    marginTop: 32,
                    paddingTop: 24,
                    borderTop: "1px solid #f1f5f9",
                  }}
                >

                  <div className="d-flex gap-2">

                    <Link
                      to="/students"
                      className="btn btn-outline-secondary"
                    >
                      Back
                    </Link>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleReset}
                      disabled={submitting}
                    >
                      Reset
                    </button>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Add Student"}
                  </button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddStudentPage;