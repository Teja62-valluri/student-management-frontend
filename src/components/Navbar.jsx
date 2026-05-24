import { Link } from "react-router-dom";

function Navbar({ title, breadcrumbs, onMenuClick }) {
  return (
    <header className="top-navbar">
      <button className="sidebar-toggle" onClick={onMenuClick} aria-label="Toggle sidebar">
        <i className="bi bi-list" />
      </button>

      <div style={{ flex: 1 }}>
        <div className="navbar-title">{title}</div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              {breadcrumbs.map((crumb, i) =>
                i < breadcrumbs.length - 1 ? (
                  <li key={crumb.path} className="breadcrumb-item">
                    <Link to={crumb.path}>{crumb.label}</Link>
                  </li>
                ) : (
                  <li key={i} className="breadcrumb-item active">
                    {crumb.label}
                  </li>
                )
              )}
            </ol>
          </nav>
        )}
      </div>

      <button className="navbar-icon-btn" title="Notifications">
        <i className="bi bi-bell" />
      </button>

      <button className="navbar-icon-btn" title="Settings">
        <i className="bi bi-gear" />
      </button>

      <div className="navbar-avatar" title="Admin">A</div>
    </header>
  );
}

export default Navbar;
