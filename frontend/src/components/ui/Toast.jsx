import { createContext, useState, useCallback, useContext } from "react";
import { createPortal } from "react-dom";
import "./Toast.css";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (msg, d) => showToast(msg, "success", d),
    error: (msg, d) => showToast(msg, "danger", d),
    info: (msg, d) => showToast(msg, "info", d),
    warning: (msg, d) => showToast(msg, "warning", d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="toast-stack">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type} glass-strong`}>
              <ToastIcon type={t.type} />
              <span className="toast-message">{t.message}</span>
              <button className="toast-close" onClick={() => removeToast(t.id)}>
                ×
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

function ToastIcon({ type }) {
  const icons = {
    success: "✓",
    danger: "✕",
    warning: "!",
    info: "i",
  };
  return <span className="toast-icon">{icons[type] || icons.info}</span>;
}