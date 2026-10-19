import React from "react";
import { seedExperience } from "../firebase/seedData";
import "../styles/Experience.css";

const Experience = ({ experience }) => {
  const data = experience?.length ? experience : seedExperience;

  return (
    <section id="experience" className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <h2 className="section-title reveal">Experience</h2>
        <div className="divider reveal" />
        <p className="section-subtitle reveal">
          My professional journey — from internships to project development.
        </p>

        <div className="timeline">
          {data.map((item, i) => (
            <div key={item.id || i} className={`timeline-item ${i % 2 === 0 ? "left" : "right"} reveal`}>
              <div className="timeline-dot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M20 7l-8 8-4-4" />
                </svg>
              </div>
              <div className="timeline-card glass-card">
                <div className="timeline-period">{item.period}</div>
                <h3 className="timeline-role">{item.role}</h3>
                {item.company && (
                  <p className="timeline-company">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" />
                    </svg>
                    {item.company}
                    {item.location && ` • ${item.location}`}
                  </p>
                )}
                <p className="timeline-desc">{item.description}</p>
              </div>
            </div>
          ))}

          {/* Timeline center line */}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  );
};

export default Experience;
