import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

function DeleteModal({ student, onConfirm, onCancel, isDeleting }) {
  const modalRef = useRef(null);
  const bsModal = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current, { backdrop: "static" });
    }
    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (student) {
      bsModal.current?.show();
    } else {
      bsModal.current?.hide();
    }
  }, [student]);

  if (!student) return null;

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex={-1}
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={isDeleting}
              aria-label="Close"
            />
          </div>

          <div className="modal-body text-center px-4 pt-2 pb-3">
            <div className="delete-modal-icon">
              <i className="bi bi-trash3-fill" />
            </div>

            <h5 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
              Delete Student
            </h5>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "#0f172a" }}>{student.name}</strong>? This
              action cannot be undone and all associated data will be permanently
              removed.
            </p>

            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "#be123c",
                textAlign: "left",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 8,
              }}
            >
              <i className="bi bi-exclamation-triangle-fill" style={{ marginTop: 1 }} />
              <span>
                Student ID: <strong>{student.id}</strong> — Department:{" "}
                <strong>{student.department}</strong>
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onConfirm(student.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <i className="bi bi-trash3 me-2" />
                  Delete Student
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
