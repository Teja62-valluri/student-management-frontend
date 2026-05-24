import { useEffect } from "react";

const ICON_MAP = {
  success: "bi-check-circle-fill",
  error:   "bi-x-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info:    "bi-info-circle-fill",
};

function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div className={`toast-item ${toast.type || "info"}`}>
      <i className={`bi ${ICON_MAP[toast.type] || ICON_MAP.info} toast-icon`} />
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, marginBottom: 2, fontSize: 13 }}>
            {toast.title}
          </div>
        )}
        <div style={{ color: "#374151" }}>{toast.message}</div>
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>
        <i className="bi bi-x" />
      </button>
    </div>
  );
}

function ToastContainer({ toasts = [], removeToast }) {
  return (
    <div className="toast-container-custom">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}

export default ToastContainer;
