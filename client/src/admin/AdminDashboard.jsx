import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { subscribeMessages } from "../firebase/firebaseUtils";
import {
  seedProfile, seedProjects, seedSkills, seedExperience,
  seedEducation, seedCertifications, seedAchievements,
} from "../firebase/seedData";
import { seedToFirestore } from "../firebase/firebaseUtils";
import { useToast } from "../components/Toast";
import "../styles/Admin.css";

const StatCard = ({ icon, label, value, color }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-icon" style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div className="dash-stat-num">{value}</div>
    <div className="dash-stat-label">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [counts, setCounts] = useState({});
  const [messages, setMessages] = useState([]);
  const [importing, setImporting] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(true);

  const COLLECTIONS = ["projects", "skills", "experience", "education", "certifications", "achievements", "gallery", "messages"];

  useEffect(() => {
    const fetchCounts = async () => {
      const c = {};
      for (const col of COLLECTIONS) {
        try {
          const snap = await getDocs(collection(db, col));
          c[col] = snap.size;
        } catch { c[col] = 0; }
      }
      setCounts(c);
      setLoadingCounts(false);
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const unsub = subscribeMessages((msgs) => setMessages(msgs.slice(0, 5)));
    return unsub;
  }, []);

  const handleImport = async () => {
    const hasData = Object.values(counts).some((v) => v > 0);
    if (hasData) {
      const ok = window.confirm(
        "⚠️ Existing data will be overwritten. Continue with import?"
      );
      if (!ok) return;
    }

    setImporting(true);
    try {
      await seedToFirestore({
        profile: seedProfile,
        projects: seedProjects,
        skills: seedSkills,
        experience: seedExperience,
        education: seedEducation,
        certifications: seedCertifications,
        achievements: seedAchievements,
      });
      addToast("Default data imported successfully!", "success");

      // Refresh counts
      const c = {};
      for (const col of COLLECTIONS) {
        try {
          const snap = await getDocs(collection(db, col));
          c[col] = snap.size;
        } catch { c[col] = 0; }
      }
      setCounts(c);
    } catch (err) {
      addToast("Import failed: " + err.message, "error");
    } finally {
      setImporting(false);
    }
  };

  const stats = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>,
      label: "Projects",
      value: loadingCounts ? "—" : counts.projects || 0,
      color: "#4f8ef7",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
      label: "Skill Categories",
      value: loadingCounts ? "—" : counts.skills || 0,
      color: "#7c3aed",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>,
      label: "Experience",
      value: loadingCounts ? "—" : counts.experience || 0,
      color: "#06b6d4",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>,
      label: "Certifications",
      value: loadingCounts ? "—" : counts.certifications || 0,
      color: "#22c55e",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
      label: "Gallery",
      value: loadingCounts ? "—" : counts.gallery || 0,
      color: "#f59e0b",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
      label: "Messages",
      value: loadingCounts ? "—" : counts.messages || 0,
      color: "#ef4444",
    },
  ];

  return (
    <div>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Dashboard Overview</h1>
        <button
          className="btn btn-primary"
          onClick={handleImport}
          disabled={importing}
        >
          {importing ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Importing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import Default Data
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Messages */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 20, fontWeight: 700, fontSize: "1rem" }}>
          Recent Messages ({messages.filter((m) => !m.read).length} unread)
        </h3>
        {messages.length === 0 ? (
          <div className="empty-state" style={{ padding: "32px 0" }}>
            <p>No messages yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "16px",
                  background: msg.read ? "var(--bg-secondary)" : "rgba(79,142,247,0.06)",
                  border: `1px solid ${msg.read ? "var(--border)" : "var(--border-strong)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{msg.name}</p>
                    <p style={{ color: "var(--accent-1)", fontSize: "0.8rem" }}>{msg.email}</p>
                  </div>
                  {!msg.read && (
                    <span className="tag" style={{ background: "rgba(79,142,247,0.15)", fontSize: "0.7rem", flexShrink: 0 }}>
                      New
                    </span>
                  )}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.6 }}>
                  {msg.message?.slice(0, 120)}
                  {msg.message?.length > 120 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
