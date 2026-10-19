import React from "react";
import { seedProfile, seedEducation } from "../firebase/seedData";
import "../styles/About.css";

const About = ({ profile, education }) => {
  const p = profile || seedProfile;
  const edu = education?.length ? education : seedEducation;
  const profileImg = p.profilePhoto || "/profile.png";

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-title reveal">About Me</div>
        <div className="divider reveal" />

        <div className="about-inner">
          {/* Photo */}
          <div className="about-photo reveal-left">
            <div className="about-img-wrap">
              <img src={profileImg} alt={p.name} loading="lazy" />
              <div className="about-img-deco" />
            </div>
            <div className="about-quick-info">
              <div className="quick-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18C.21.66.54.25 1 .1A2 2 0 012.18 2v2.18" />
                </svg>
                {p.phone}
              </div>
              <div className="quick-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {p.email}
              </div>
              <div className="quick-info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {p.location}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="about-content reveal-right">
            <h3 className="about-heading">
              I'm <span className="gradient-text">{p.name}</span>
            </h3>
            <p className="about-title-tag">{p.title}</p>
            <p className="about-summary">{p.summary}</p>

            {/* Stats */}
            <div className="about-stats">
              {[
                { val: "7.41", label: "CGPA" },
                { val: "3+", label: "Projects" },
                { val: "1", label: "Internship" },
                { val: "1", label: "Hackathon Prize" },
              ].map((s) => (
                <div key={s.label} className="about-stat glass-card">
                  <span className="about-stat-val gradient-text">{s.val}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="about-langs">
              <h4 className="langs-title">Languages</h4>
              <div className="langs-list">
                {[
                  { lang: "Tamil", level: "Fluent" },
                  { lang: "English", level: "Intermediate" },
                  { lang: "Telugu", level: "Basic" },
                ].map((l) => (
                  <span key={l.lang} className="tag">
                    {l.lang} – {l.level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        <div className="edu-section reveal">
          <h3 className="edu-heading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Education
          </h3>
          <div className="edu-timeline">
            {edu.map((e, i) => (
              <div key={e.id || i} className="edu-item glass-card">
                <div className="edu-dot" />
                <div className="edu-info">
                  <h4 className="edu-degree">{e.degree}</h4>
                  <p className="edu-inst">{e.institution}</p>
                  <div className="edu-meta">
                    {e.period && <span className="tag">{e.period}</span>}
                    {e.score && <span className="tag edu-score">{e.score}</span>}
                    {e.location && (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                        📍 {e.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
