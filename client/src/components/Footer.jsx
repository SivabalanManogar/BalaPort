import React from "react";
import { seedProfile } from "../firebase/seedData";
import "../styles/Footer.css";

const Footer = ({ profile }) => {
  const p = profile || seedProfile;
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">SB<span className="logo-dot-sm" /></div>
            <p className="footer-tagline">{p.title}</p>
            <p className="footer-desc">
              Building modern, scalable web applications and data-driven solutions. Available for freelance and full-time opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              {["hero", "about", "skills", "projects", "experience", "certifications", "gallery", "contact"].map((id) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <div className="footer-contact-list">
              <a href={`tel:${p.phone}`}>{p.phone}</a>
              <a href={`mailto:${p.email}`}>{p.email}</a>
              <span>{p.location}</span>
            </div>
            <div className="footer-socials">
              <a href={p.linkedin || "#"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href={p.github || "#"} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
              <a href={`mailto:${p.email}`} aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} <span className="gradient-text">{p.name}</span>. All rights reserved.</p>
          <p>Built with React + Firebase ⚡</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
