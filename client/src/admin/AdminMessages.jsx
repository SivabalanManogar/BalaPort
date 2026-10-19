// import React, { useState, useEffect } from "react";
// import { subscribeMessages, markMessageRead, deleteMessage } from "../../firebase/firebaseUtils";
// import { useToast } from "../../components/Toast";
import React, { useState, useEffect } from "react";

import {
  subscribeMessages,
  markMessageRead,
  deleteMessage
} from "../firebase/firebaseUtils";

import { useToast } from "../components/Toast";
const AdminMessages = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = subscribeMessages(setMessages);
    return unsub;
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      addToast("Marked as read.", "success");
    } catch { addToast("Failed to update.", "error"); }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(deleteId);
      addToast("Message deleted.", "success");
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
    } catch { addToast("Delete failed.", "error"); }
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="admin-section-header">
        <h1 className="admin-section-title">
          Messages ({messages.length})
          {unread > 0 && (
            <span style={{
              marginLeft: 12, padding: "4px 10px",
              background: "rgba(79,142,247,0.15)",
              color: "var(--accent-1)",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.78rem", fontWeight: 700,
            }}>
              {unread} unread
            </span>
          )}
        </h1>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: "60px 24px" }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <h3>No messages yet</h3>
          <p>Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.read) handleMarkRead(msg.id); }}
                style={{
                  padding: "16px",
                  background: selected?.id === msg.id ? "rgba(79,142,247,0.1)" : msg.read ? "var(--bg-card)" : "rgba(79,142,247,0.05)",
                  border: `1px solid ${selected?.id === msg.id ? "var(--accent-1)" : msg.read ? "var(--border)" : "var(--border-strong)"}`,
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  transition: "var(--transition-fast)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{msg.name}</p>
                  {!msg.read && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-1)" }} />
                  )}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{msg.email}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>
                  {formatDate(msg.createdAt)}
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: 6, lineHeight: 1.5 }}>
                  {(msg.message || "").slice(0, 70)}
                  {(msg.message || "").length > 70 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <div className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} style={{ color: "var(--accent-1)", fontSize: "0.88rem" }}>
                      {selected.email}
                    </a>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!selected.read && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleMarkRead(selected.id)}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(selected.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{
                  padding: 20,
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.92rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                  whiteSpace: "pre-wrap",
                }}>
                  {selected.message}
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <a href={`mailto:${selected.email}`} className="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Reply
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto 12px" }}>
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <p>Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-box">
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
              <h3>Delete Message?</h3>
              <p>This will permanently delete this message.</p>
              <div className="confirm-actions">
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
