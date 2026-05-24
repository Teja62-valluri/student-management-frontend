import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ToastContainer from "./ToastNotification";

function Layout({ children, title, breadcrumbs, toasts, removeToast }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className="main-wrapper">
        <Navbar
          title={title}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content">{children}</main>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default Layout;
