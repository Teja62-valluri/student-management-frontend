import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard",    icon: "bi-speedometer2",        path: "/" },
  { label: "All Students", icon: "bi-people-fill",         path: "/students" },
  { label: "Add Student",  icon: "bi-person-plus-fill",    path: "/students/add" },
];

function Sidebar({ open, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <a className="sidebar-brand" href="/">
        <div className="sidebar-brand-icon">
          <i className="bi bi-mortarboard-fill" />
        </div>
        <div className="sidebar-brand-text">
          <h6>EduAdmin</h6>
          <span>Student Management</span>
        </div>
      </a>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main Menu</span>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
            onClick={onClose}
            end={item.path === "/"}
          >
            <i className={`bi ${item.icon}`} />
            {item.label}
          </NavLink>
        ))}

        <span className="sidebar-section-label" style={{ marginTop: 20 }}>
          Reports
        </span>

        <a
          href="#"
          className="sidebar-link"
          onClick={(e) => e.preventDefault()}
          style={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          <i className="bi bi-bar-chart-fill" />
          Analytics
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              background: "rgba(99,102,241,.2)",
              color: "#818cf8",
              padding: "2px 7px",
              borderRadius: 20,
              fontWeight: 600,
            }}
          >
            Soon
          </span>
        </a>

        <a
          href="#"
          className="sidebar-link"
          onClick={(e) => e.preventDefault()}
          style={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          <i className="bi bi-download" />
          Export Data
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              background: "rgba(99,102,241,.2)",
              color: "#818cf8",
              padding: "2px 7px",
              borderRadius: 20,
              fontWeight: 600,
            }}
          >
            Soon
          </span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#64748b", fontSize: 12 }}>
            Connected to Spring Boot
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
