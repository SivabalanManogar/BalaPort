import React, { useState } from "react";
import { addMessage } from "../firebase/firebaseUtils";
import { seedProfile } from "../firebase/seedData";
import { useToast } from "./Toast";
import "../styles/Contact.css";

const Contact = ({ profile }) => {
  const p = profile || seedProfile;
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    if (form.name.length > 100) e.name = "Name is too long.";
    if (form.message.length > 2000) e.message = "Message is too long (max 2000 chars).";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    try {
      await addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      addToast("Message sent successfully! I'll get back to you soon.", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      addToast("Failed to send message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title reveal">Get In Touch</h2>
        <div className="divider reveal" />
        <p className="section-subtitle reveal">
          Have a project in mind? Let's collaborate and build something amazing together.
        </p>

        <div className="contact-inner">
          {/* Info */}
          <div className="contact-info reveal-left">
            <h3 className="contact-info-title">Let's Talk</h3>
            <p className="contact-info-desc">
              I'm always open to new opportunities, collaborations, or just a friendly conversation about technology and development.
            </p>

            <div className="contact-cards">
              <a href={`tel:${p.phone}`} className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18C.21.66.54.25 1 .1A2 2 0 012.18 2v2.18" />
                  </svg>
                </div>
                <div>
                  <p className="contact-label">Phone</p>
                  <p className="contact-value">{p.phone}</p>
                </div>
              </a>
              <a href={`mailto:${p.email}`} className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="contact-label">Email</p>
                  <p className="contact-value">{p.email}</p>
                </div>
              </a>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="contact-label">Location</p>
                  <p className="contact-value">{p.location}</p>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <a href={p.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a href={p.github || "#"} target="_blank" rel="noopener noreferrer" className="social-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap reveal-right">
            <form className="contact-form glass-card" onSubmit={handleSubmit} noValidate>
              <h3 className="form-heading">Send a Message</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-control"
                  placeholder="Tell me about your project or just say hello..."
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  maxLength={2000}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "right" }}>
                  {form.message.length}/2000
                </span>
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: "100%" }}>
                {sending ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
