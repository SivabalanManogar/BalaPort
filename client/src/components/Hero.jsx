import React, { useEffect, useRef } from "react";
import { seedProfile } from "../firebase/seedData";
import "../styles/Hero.css";

const ROLES = [
  "MERN Stack Developer",
  "Data Science Enthusiast",
  "Full-Stack Developer",
  "React.js Expert",
];

const Hero = ({ profile }) => {
  const data = profile || seedProfile;
  const typingRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer;

    const type = () => {
      const role = ROLES[roleIdx];
      if (!typingRef.current) return;

      if (!deleting) {
        typingRef.current.textContent = role.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === role.length) {
          deleting = true;
          timer = setTimeout(type, 1800);
          return;
        }
      } else {
        typingRef.current.textContent = role.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % ROLES.length;
        }
      }

      timer = setTimeout(type, deleting ? 60 : 100);
    };

    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const profileImg = data.profilePhoto || "/profile.png";

  return (
    <section id="hero" className="hero-section">
      {/* Background blobs */}
      <div className="hero-blob blob-1" />
      <div className="hero-blob blob-2" />
      <div className="hero-blob blob-3" />

      <div className="container hero-inner">
        {/* Text Side */}
        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="badge-dot" />
            Available for opportunities
          </div>

          <h1 className="hero-name reveal">{data.name}</h1>

          <div className="hero-typing reveal">
            <span ref={typingRef} className="typing-text" />
            <span className="typing-cursor">|</span>
          </div>

          <p className="hero-desc reveal">{data.summary?.slice(0, 200)}...</p>

          <div className="hero-stats reveal">
            <div className="stat-item">
              <span className="stat-num">7.41</span>
              <span className="stat-label">CGPA</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">3+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">2+</span>
              <span className="stat-label">Experience</span>
            </div>
          </div>

          <div className="hero-actions reveal">
            <button className="btn btn-primary" onClick={() => scrollTo("projects")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
              </svg>
              View Projects
            </button>
            <a
              href="SivaMano.pdf"
              download
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </a>
            <button className="btn btn-ghost" onClick={() => scrollTo("contact")}>
              {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18C.21.66.54.25 1 .1A2 2 0 012.18 2v2.18" />
              </svg> */}
              Contact Me
            </button>
          </div>

          <div className="hero-socials reveal">
            <a
              href={data.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
            <a
              href={data.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
              GitHub
            </a>
            <a
              href={`mailto:${data.email}`}
              className="social-link"
              aria-label="Email"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
          </div>
        </div>

        {/* Photo Side */}
        <div className="hero-photo-wrap reveal-right">
          <div className="photo-glow-ring">
            <div className="photo-frame">
              <img
                src={profileImg}
                alt="SIVA BALAN M – MERN Stack Developer"
                className="profile-photo"
                loading="eager"
              />
            </div>
          </div>
          <div className="photo-badge photo-badge-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            MERN Stack
          </div>
          <div className="photo-badge photo-badge-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Data Science
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll down</span>
      </div>
    </section>
  );
};

export default Hero;
