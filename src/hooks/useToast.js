import { useState, useCallback } from "react";

let nextId = 1;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", title = "", duration = 4000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type, title, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, title = "Success") => addToast(message, "success", title), [addToast]);
  const error   = useCallback((message, title = "Error")   => addToast(message, "error",   title), [addToast]);
  const warning = useCallback((message, title = "Warning") => addToast(message, "warning", title), [addToast]);
  const info    = useCallback((message, title = "")        => addToast(message, "info",    title), [addToast]);

  return { toasts, removeToast, success, error, warning, info };
}

export default useToast;
