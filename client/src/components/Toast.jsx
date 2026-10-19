import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "360px",
        width: "calc(100vw - 40px)",
      }}>
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  };

  const colors = {
    success: { bg: "#0f2a1a", border: "#22c55e", icon: "#22c55e" },
    error: { bg: "#2a0f0f", border: "#ef4444", icon: "#ef4444" },
    info: { bg: "#0f1a2a", border: "#4f8ef7", icon: "#4f8ef7" },
    warning: { bg: "#2a200f", border: "#f59e0b", icon: "#f59e0b" },
  };

  const c = colors[toast.type] || colors.info;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "16px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "12px",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}30`,
      animation: "slideInRight 0.3s ease",
      backdropFilter: "blur(16px)",
    }}>
      <span style={{ color: c.icon, flexShrink: 0, marginTop: "1px" }}>
        {icons[toast.type]}
      </span>
      <p style={{
        flex: 1,
        fontSize: "0.9rem",
        color: "#f0f4ff",
        lineHeight: 1.5,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 500,
      }}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#94a3c0",
          cursor: "pointer",
          padding: "2px",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};
