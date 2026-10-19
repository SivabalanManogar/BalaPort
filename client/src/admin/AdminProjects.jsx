
import React, { useState, useEffect } from "react";

import {
  subscribeCollection,
  addItem,
  updateItem,
  deleteItem,
} from "../firebase/firebaseUtils";

import { compressImage } from "../utils/imageCompress";
import { useToast } from "../components/Toast";

const EMPTY_PROJECT = {
  title: "",
  description: "",
  bullets: [],
  techTags: [],
  githubLink: "",
  liveLink: "",
  category: "Full Stack",
  featured: false,
  order: 0,
  image: "",
};

const CATEGORIES = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Data Science",
  "Mobile",
  "Other",
];

// Normalize older or incomplete Firestore project documents.

const normalizeProject = (project = {}) => {
  const p = project && typeof project === "object" ? project : {};

  return {
    ...EMPTY_PROJECT,
    ...p,
    title: p.title ?? "",
    description: p.description ?? "",
    bullets: Array.isArray(p.bullets) ? p.bullets : [],
    techTags: Array.isArray(p.techTags) ? p.techTags : [],
    githubLink: p.githubLink ?? "",
    liveLink: p.liveLink ?? "",
    category: p.category ?? "Full Stack",
    featured: p.featured === true,
    order: Number(p.order) || 0,
    image: p.image ?? "",
  };
};

const ProjectForm = ({ initial, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(() => normalizeProject(initial));
  const [tagInput, setTagInput] = useState("");
  const [bulletInput, setBulletInput] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
  };

  const addTag = (e) => {
    e.preventDefault();

    const tag = tagInput.trim();

    if (!tag) return;

    if (
      form.techTags.some(
        (existing) => existing.toLowerCase() === tag.toLowerCase()
      )
    ) {
      addToast("This technology tag already exists.", "info");
      return;
    }

    setForm((prev) => ({
      ...prev,
      techTags: [...prev.techTags, tag],
    }));

    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      techTags: prev.techTags.filter((item) => item !== tag),
    }));
  };

  const addBullet = (e) => {
    e.preventDefault();

    const bullet = bulletInput.trim();

    if (!bullet) return;

    setForm((prev) => ({
      ...prev,
      bullets: [...prev.bullets, bullet],
    }));

    setBulletInput("");
  };

  const removeBullet = (index) => {
    setForm((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index),
    }));
  };

  const handleImg = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImgUploading(true);

    try {
      const compressed = await compressImage(file);

      setForm((prev) => ({
        ...prev,
        image: compressed,
      }));

      addToast("Image compressed successfully.", "info");
    } catch (error) {
      console.error("[AdminProjects] Image compression failed:", error);
      addToast("Image upload failed.", "error");
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      addToast("Title is required.", "error");
      return;
    }

    if (imgUploading || saving) return;

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      order: Number(form.order) || 0,
      bullets: [...form.bullets],
      techTags: [...form.techTags],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Title *</label>
          <input
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            placeholder="E-Commerce Platform"
            required
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-control"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Display Order</label>
          <input
            name="order"
            type="number"
            className="form-control"
            value={form.order}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">GitHub Link</label>
          <input
            name="githubLink"
            type="url"
            className="form-control"
            value={form.githubLink}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Live Demo Link</label>
          <input
            name="liveLink"
            type="url"
            className="form-control"
            value={form.liveLink}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Bullet Points */}
      <div className="form-group">
        <label className="form-label">Bullet Points</label>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-control"
            value={bulletInput}
            onChange={(e) => setBulletInput(e.target.value)}
            placeholder="Add a bullet point..."
          />

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={addBullet}
            style={{ flexShrink: 0 }}
          >
            Add
          </button>
        </div>

        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {form.bullets.map((bullet, index) => (
            <div
              key={`${index}-${bullet}`}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                • {bullet}
              </span>

              <button
                type="button"
                onClick={() => removeBullet(index)}
                aria-label={`Remove bullet ${index + 1}`}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Tags */}
      <div className="form-group">
        <label className="form-label">Tech Tags</label>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-control"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="React.js, Node.js..."
            onKeyDown={(e) => {
              if (e.key === "Enter") addTag(e);
            }}
          />

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={addTag}
            style={{ flexShrink: 0 }}
          >
            Add
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 8,
          }}
        >
          {form.techTags.map((tag) => (
            <button
              type="button"
              key={tag}
              className="tag"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              style={{ cursor: "pointer" }}
            >
              {tag} ×
            </button>
          ))}
        </div>
      </div>

      {/* Project Image */}
      <div className="form-group">
        <label className="form-label">Project Image</label>

        <div className="img-upload-area">
          <input type="file" accept="image/*" onChange={handleImg} />

          {form.image ? (
            <img
              src={form.image}
              alt="Project preview"
              className="img-upload-preview"
            />
          ) : (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              {imgUploading
                ? "Compressing..."
                : "Click to upload image (max ~700KB)"}
            </p>
          )}
        </div>

        {form.image && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 8 }}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                image: "",
              }))
            }
          >
            Remove Image
          </button>
        )}
      </div>

      {/* Featured Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          <span className="toggle-slider" />
        </label>

        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
          Featured Project
        </span>
      </div>

      {/* Form Actions */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving || imgUploading}
        >
          {imgUploading
            ? "Processing Image..."
            : saving
              ? "Saving..."
              : "Save Project"}
        </button>
      </div>
    </form>
  );
};

const AdminProjects = () => {
  const { addToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = subscribeCollection(
      "projects",
      (items) => {
        if (!active) return;

        const safeItems = Array.isArray(items)
          ? items.map((item) => normalizeProject(item))
          : [];

        setProjects(safeItems);
        setLoading(false);
      },
      "order"
    );

    return () => {
      active = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handleSave = async (form) => {
    setSaving(true);

    try {
      if (modal === "add") {
        await addItem("projects", form);
        addToast("Project added!", "success");
      } else if (modal?.id) {
        await updateItem("projects", modal.id, form);
        addToast("Project updated!", "success");
      } else {
        throw new Error("Project ID is missing.");
      }

      setModal(null);
    } catch (error) {
      console.error("[AdminProjects] Save failed:", error);
      addToast("Save failed: " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteItem("projects", deleteId);
      addToast("Project deleted.", "success");
      setDeleteId(null);
    } catch (error) {
      console.error("[AdminProjects] Delete failed:", error);
      addToast("Delete failed: " + error.message, "error");
    }
  };

  const openEdit = (project) => {
    setModal({
      ...project,
      ...normalizeProject(project),
    });
  };

  return (
    <div>
      <div className="admin-section-header">
        <h1 className="admin-section-title">
          Projects ({projects.length})
        </h1>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModal("add")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="empty-state glass-card" style={{ padding: "40px 24px" }}>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div
          className="empty-state glass-card"
          style={{ padding: "60px 24px" }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6M9 12h6M9 15h4" />
          </svg>

          <h3>No projects yet</h3>
          <p>Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.order}</td>

                  <td style={{ fontWeight: 600 }}>
                    {project.title || "Untitled Project"}
                  </td>

                  <td>
                    <span className="tag">{project.category}</span>
                  </td>

                  <td>{project.featured ? "⭐" : "—"}</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                      }}
                    >
                      {project.techTags.slice(0, 3).map((tag, index) => (
                        <span key={`${tag}-${index}`} className="tag">
                          {tag}
                        </span>
                      ))}

                      {project.techTags.length > 3 && (
                        <span className="tag">
                          +{project.techTags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(project)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={() => !saving && setModal(null)}
        >
          <div
            className="modal-box modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 24, fontWeight: 700 }}>
              {modal === "add" ? "Add New Project" : "Edit Project"}
            </h2>

            <ProjectForm
              key={modal === "add" ? "new-project" : modal.id}
              initial={modal === "add" ? null : modal}
              onSave={handleSave}
              onCancel={() => setModal(null)}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-box">
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>
                🗑️
              </div>

              <h3>Delete Project?</h3>

              <p>
                This action cannot be undone. The project will be permanently
                removed.
              </p>

              <div className="confirm-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
