import React, { useState, useEffect } from "react";
import { subscribeCollection, addItem, updateItem, deleteItem } from "../firebase/firebaseUtils";
import { useToast } from "../components/Toast";

// Generic CRUD list admin for simple collections
const GenericAdminList = ({
  collection: colName,
  title,
  fields,
  emptyIcon,
}) => {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  const emptyForm = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default ?? "" }), {});

  useEffect(() => {
    const unsub = subscribeCollection(colName, setItems, "order");
    return unsub;
  }, [colName]);

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (item) => {
    const f = fields.reduce((acc, fd) => ({ ...acc, [fd.name]: item[fd.name] ?? fd.default ?? "" }), {});
    setForm(f);
    setModal(item);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const required = fields.filter((f) => f.required);
    for (const f of required) {
      if (!form[f.name]?.toString().trim()) {
        addToast(`${f.label} is required.`, "error");
        return;
      }
    }
    setSaving(true);
    try {
      const data = { ...form, order: Number(form.order) || 0 };
      if (modal === "add") await addItem(colName, data);
      else await updateItem(colName, modal.id, data);
      addToast(modal === "add" ? `${title.slice(0, -1)} added!` : "Updated!", "success");
      setModal(null);
    } catch (err) { addToast("Save failed: " + err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(colName, deleteId);
      addToast("Deleted.", "success");
      setDeleteId(null);
    } catch { addToast("Delete failed.", "error"); }
  };

  const displayField = fields.find((f) => f.primary)?.name || fields[0]?.name;
  const subField = fields.find((f) => f.secondary)?.name;

  return (
    <div>
      <div className="admin-section-header">
        <h1 className="admin-section-title">{title} ({items.length})</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add {title.slice(0, -1)}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: "60px 24px" }}>
          {emptyIcon}
          <h3>No {title.toLowerCase()} yet</h3>
          <p>Click the button above to add your first entry.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                {fields.filter((f) => f.showInTable !== false).map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.order || 0}</td>
                  {fields.filter((f) => f.showInTable !== false).map((f) => (
                    <td key={f.name} style={f.primary ? { fontWeight: 600 } : {}}>
                      {f.truncate
                        ? (item[f.name] || "—").slice(0, 60) + ((item[f.name] || "").length > 60 ? "..." : "")
                        : item[f.name] || "—"}
                    </td>
                  ))}
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 24, fontWeight: 700 }}>
              {modal === "add" ? `Add ${title.slice(0, -1)}` : `Edit ${title.slice(0, -1)}`}
            </h2>
            <form onSubmit={handleSave}>
              {fields.map((f) => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}{f.required ? " *" : ""}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      className="form-control"
                      value={form[f.name] || ""}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      rows={f.rows || 4}
                    />
                  ) : (
                    <input
                      name={f.name}
                      type={f.type || "text"}
                      className="form-control"
                      value={form[f.name] || ""}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : `Save ${title.slice(0, -1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-box">
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
              <h3>Delete Entry?</h3>
              <p>This action cannot be undone.</p>
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

// ─── Experience ───────────────────────────────────────────────────────────────
export const AdminExperience = () => (
  <GenericAdminList
    collection="experience"
    title="Experiences"
    fields={[
      { name: "role", label: "Role / Title", required: true, primary: true },
      { name: "company", label: "Company", secondary: true },
      { name: "location", label: "Location" },
      { name: "period", label: "Period", placeholder: "2024 – Present" },
      { name: "description", label: "Description", type: "textarea", truncate: true },
      { name: "order", label: "Order", type: "number", default: 0 },
    ]}
    emptyIcon={<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>}
  />
);

// ─── Education ────────────────────────────────────────────────────────────────
export const AdminEducation = () => (
  <GenericAdminList
    collection="education"
    title="Educations"
    fields={[
      { name: "degree", label: "Degree / Course", required: true, primary: true },
      { name: "institution", label: "Institution", secondary: true },
      { name: "location", label: "Location" },
      { name: "period", label: "Period", placeholder: "2023 – 2027" },
      { name: "score", label: "Score / CGPA", placeholder: "CGPA: 7.41" },
      { name: "order", label: "Order", type: "number", default: 0 },
    ]}
    emptyIcon={<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>}
  />
);

// ─── Certifications ───────────────────────────────────────────────────────────
export const AdminCertifications = () => (
  <GenericAdminList
    collection="certifications"
    title="Certifications"
    fields={[
      { name: "title", label: "Certificate Title", required: true, primary: true },
      { name: "issuer", label: "Issued By", secondary: true },
      { name: "link", label: "Certificate Link / URL", type: "url", placeholder: "https://..." },
      { name: "order", label: "Order", type: "number", default: 0 },
    ]}
    emptyIcon={<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>}
  />
);

// ─── Achievements ─────────────────────────────────────────────────────────────
export const AdminAchievements = () => (
  <GenericAdminList
    collection="achievements"
    title="Achievements"
    fields={[
      { name: "title", label: "Achievement Title", required: true, primary: true },
      { name: "description", label: "Description", type: "textarea", truncate: true },
      { name: "order", label: "Order", type: "number", default: 0 },
    ]}
    emptyIcon={<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></svg>}
  />
);

export default GenericAdminList;
