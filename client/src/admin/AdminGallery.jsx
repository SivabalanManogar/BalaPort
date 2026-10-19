import React, { useState, useEffect } from "react";
import { subscribeCollection, addItem, updateItem, deleteItem } from "../firebase/firebaseUtils";
import { compressImage } from "../utils/imageCompress";
import { useToast } from "../components/Toast";

const AdminGallery = () => {
  const { addToast } = useToast();
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editCaption, setEditCaption] = useState("");

  useEffect(() => {
    const unsub = subscribeCollection("gallery", setGallery, "order");
    return unsub;
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    let uploaded = 0;
    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        await addItem("gallery", {
          image: compressed,
          caption: file.name.replace(/\.[^.]+$/, ""),
          order: gallery.length + uploaded,
        });
        uploaded++;
      } catch { addToast(`Failed to upload ${file.name}`, "error"); }
    }
    addToast(`${uploaded} image(s) uploaded!`, "success");
    setUploading(false);
    e.target.value = "";
  };

  const handleUpdateCaption = async () => {
    try {
      await updateItem("gallery", editItem.id, { caption: editCaption });
      addToast("Caption updated!", "success");
      setEditItem(null);
    } catch { addToast("Update failed.", "error"); }
  };

  const handleDelete = async () => {
    try {
      await deleteItem("gallery", deleteId);
      addToast("Image deleted.", "success");
      setDeleteId(null);
    } catch { addToast("Delete failed.", "error"); }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gallery ({gallery.length} images)</h1>
        <label
          className="btn btn-primary"
          style={{ cursor: "pointer", position: "relative" }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            onChange={handleUpload}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {uploading ? "Uploading..." : "Upload Images"}
        </label>
      </div>

      {gallery.length === 0 && !uploading ? (
        <div className="empty-state glass-card" style={{ padding: "60px 24px" }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3>No images yet</h3>
          <p>Upload images to build your gallery.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {gallery.map((img) => (
            <div
              key={img.id}
              className="glass-card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                <img
                  src={img.image}
                  alt={img.caption || "Gallery"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: 12 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                  {img.caption || "No caption"}
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setEditItem(img); setEditCaption(img.caption || ""); }}
                  >
                    Edit Caption
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(img.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Caption Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20, fontWeight: 700 }}>Edit Caption</h2>
            <img
              src={editItem.image}
              alt="Preview"
              style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: 16 }}
            />
            <div className="form-group">
              <label className="form-label">Caption</label>
              <input
                className="form-control"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Enter caption..."
              />
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdateCaption}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-box">
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
              <h3>Delete Image?</h3>
              <p>This will permanently remove the image from the gallery.</p>
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

export default AdminGallery;
