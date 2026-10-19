import React, { useState, useEffect } from "react";
import { subscribeCollection, addItem, updateItem, deleteItem } from "../firebase/firebaseUtils";
import { useToast } from "../components/Toast";

const EMPTY_SKILL = { category: "", items: [], order: 0 };

const SkillForm = ({ initial, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial || EMPTY_SKILL);
  const [itemInput, setItemInput] = useState("");
  const { addToast } = useToast();

  const addSkillItem = (e) => {
    e.preventDefault();
    if (itemInput.trim() && !form.items.includes(itemInput.trim())) {
      setForm((f) => ({ ...f, items: [...f.items, itemInput.trim()] }));
      setItemInput("");
    }
  };

  const removeItem = (item) =>
    setForm((f) => ({ ...f, items: f.items.filter((i) => i !== item) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category.trim()) { addToast("Category name required.", "error"); return; }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Category Name *</label>
        <input
          className="form-control"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          placeholder="e.g. Frontend, Backend..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Display Order</label>
        <input
          type="number"
          className="form-control"
          value={form.order}
          onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Skills</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-control"
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
            placeholder="React.js, Node.js..."
            onKeyDown={(e) => e.key === "Enter" && addSkillItem(e)}
          />
          <button type="button" className="btn btn-outline btn-sm" onClick={addSkillItem} style={{ flexShrink: 0 }}>
            Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {form.items.map((item) => (
            <span
              key={item}
              className="tag"
              style={{ cursor: "pointer" }}
              onClick={() => removeItem(item)}
            >
              {item} ×
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Category"}
        </button>
      </div>
    </form>
  );
};

const AdminSkills = () => {
  const { addToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection("skills", setSkills, "order");
    return unsub;
  }, []);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal === "add") await addItem("skills", form);
      else await updateItem("skills", modal.id, form);
      addToast(modal === "add" ? "Skill category added!" : "Updated!", "success");
      setModal(null);
    } catch (err) { addToast("Save failed: " + err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteItem("skills", deleteId);
      addToast("Category deleted.", "success");
      setDeleteId(null);
    } catch (err) { addToast("Delete failed.", "error"); }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Skills ({skills.length} categories)</h1>
        <button className="btn btn-primary" onClick={() => setModal("add")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {skills.map((s) => (
          <div key={s.id} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.category}
              </h3>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Order: {s.order}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {(s.items || []).map((item) => <span key={item} className="tag">{item}</span>)}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(s)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(s.id)}>Delete</button>
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <h3>No skill categories</h3>
            <p>Add your first skill category.</p>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 24, fontWeight: 700 }}>
              {modal === "add" ? "Add Skill Category" : "Edit Category"}
            </h2>
            <SkillForm
              initial={modal !== "add" ? modal : null}
              onSave={handleSave}
              onCancel={() => setModal(null)}
              saving={saving}
            />
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-box">
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
              <h3>Delete Category?</h3>
              <p>This will permanently remove this skill category.</p>
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

export default AdminSkills;
