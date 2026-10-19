
import React, { useState, useEffect } from "react";
import { getProfile, setProfile } from "../firebase/firebaseUtils";
import { compressImage } from "../utils/imageCompress";
import { useToast } from "../components/Toast";
import { seedProfile } from "../firebase/seedData";
import { auth } from "../firebase/firebase";
import "../styles/Admin.css";

const AdminProfile = () => {
  const { addToast } = useToast();

  const [form, setForm] = useState(seedProfile);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        if (active && profile) {
          setForm((previous) => ({
            ...previous,
            ...profile,
          }));
        }
      } catch (error) {
        console.error("[AdminProfile] Failed to load profile:", {
          code: error.code,
          message: error.message,
          projectId: auth.app.options.projectId,
          uid: auth.currentUser?.uid,
        });

        if (active) {
          setLoadError(error.message || "Unable to load profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select a valid image.", "error");
      event.target.value = "";
      return;
    }

    setImgUploading(true);

    try {
      const compressed = await compressImage(file);

      setForm((previous) => ({
        ...previous,
        profilePhoto: compressed,
      }));

      addToast("Photo processed. Click Save Profile to apply.", "info");
    } catch (error) {
      console.error("[AdminProfile] Photo processing failed:", error);
      addToast("Failed to process image.", "error");
    } finally {
      setImgUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving || imgUploading) return;

    setSaving(true);

    try {
      if (!auth.currentUser) {
        throw new Error("You are not signed in. Please log in again.");
      }

      console.log("Firebase project:", auth.app.options.projectId);
      console.log("Current UID:", auth.currentUser.uid);
      console.log("Current email:", auth.currentUser.email);

      await setProfile(form);

      setLoadError("");
      addToast("Profile saved successfully!", "success");
      console.log("[AdminProfile] Profile saved successfully.");
    } catch (error) {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Firebase project:", auth.app.options.projectId);
      console.error("Current UID:", auth.currentUser?.uid);

      addToast(
        "Save failed: " + (error.message || "Unknown error"),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-page">
      <div className="admin-section-header">
        <h1 className="admin-section-title">Profile Settings</h1>
        <p>Manage your personal and professional information.</p>
      </div>

      {loadError && (
        <div
          role="alert"
          style={{
            padding: 16,
            marginBottom: 20,
            border: "1px solid #e7a39a",
            borderRadius: 8,
            background: "#fff4f1",
            color: "#8b3025",
          }}
        >
          <strong>Could not load saved profile.</strong>
          <p style={{ margin: "8px 0 0" }}>{loadError}</p>
          <p style={{ margin: "8px 0 0" }}>
            You can still edit the available fields, but saving requires
            working Firestore permissions.
          </p>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 24,
          }}
        >
          <section
            className="glass-card"
            style={{ padding: 24, gridColumn: "1 / -1" }}
          >
            <h3 style={{ marginBottom: 20, fontWeight: 700 }}>
              Profile Photo
            </h3>

            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid var(--border-strong)",
                  background: "var(--bg-secondary)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={form.profilePhoto || "/profile.png"}
                  alt="Profile preview"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/profile.png";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="img-upload-area" style={{ padding: 20 }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    id="profile-photo-upload"
                    disabled={imgUploading}
                  />

                  <p style={{ fontWeight: 600, marginBottom: 4 }}>
                    {imgUploading
                      ? "Processing photo..."
                      : "Choose a profile photo"}
                  </p>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    JPEG, PNG, or WebP. The image is compressed before saving.
                  </p>
                </div>

                {form.profilePhoto?.startsWith("data:") && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        profilePhoto: "/profile.png",
                      }))
                    }
                  >
                    Reset to default
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 20, fontWeight: 700 }}>
              Basic Information
            </h3>

            {[
              { name: "name", label: "Full Name", placeholder: "Your full name", type: "text" },
              { name: "title", label: "Professional Title", placeholder: "MERN Stack Developer", type: "text" },
              { name: "phone", label: "Phone", placeholder: "Your phone number", type: "tel" },
              { name: "email", label: "Email", placeholder: "your@email.com", type: "email" },
              { name: "location", label: "Location", placeholder: "Tamil Nadu, India", type: "text" },
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label
                  className="form-label"
                  htmlFor={`profile-${field.name}`}
                >
                  {field.label}
                </label>
                <input
                  id={`profile-${field.name}`}
                  name={field.name}
                  type={field.type}
                  className="form-control"
                  placeholder={field.placeholder}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Links</h3>

            {[
              { name: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/your-profile" },
              { name: "github", label: "GitHub URL", placeholder: "https://github.com/your-username" },
              { name: "resumeUrl", label: "Resume URL", placeholder: "https://drive.google.com/..." },
            ].map((field) => (
              <div className="form-group" key={field.name}>
                <label
                  className="form-label"
                  htmlFor={`profile-${field.name}`}
                >
                  {field.label}
                </label>
                <input
                  id={`profile-${field.name}`}
                  name={field.name}
                  type="url"
                  className="form-control"
                  placeholder={field.placeholder}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </section>

          <section
            className="glass-card"
            style={{ padding: 24, gridColumn: "1 / -1" }}
          >
            <h3 style={{ marginBottom: 20, fontWeight: 700 }}>
              Professional Summary
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-summary">
                Summary
              </label>
              <textarea
                id="profile-summary"
                name="summary"
                className="form-control"
                rows={6}
                value={form.summary || ""}
                onChange={handleChange}
                placeholder="Write your professional summary..."
              />
            </div>
          </section>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || imgUploading}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
