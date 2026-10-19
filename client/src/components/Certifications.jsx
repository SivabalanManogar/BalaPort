import React from "react";
import { seedCertifications, seedAchievements } from "../firebase/seedData";
import "../styles/Certifications.css";

const CertCard = ({ cert, index }) => (
  <div className="cert-card glass-card reveal">
    {cert.image ? (
      <img src={cert.image} alt={cert.title} className="cert-img" loading="lazy" />
    ) : (
      <div className="cert-icon-wrap">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#certGrad)" strokeWidth="1.5">
          <defs>
            <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f8ef7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      </div>
    )}
    <div className="cert-body">
      <h3 className="cert-title">{cert.title}</h3>
      <p className="cert-issuer">{cert.issuer}</p>
      {cert.link && (
        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Certificate
        </a>
      )}
    </div>
  </div>
);

const AchievementCard = ({ achievement, index }) => (
  <div className="achievement-card glass-card reveal">
    <div className="achievement-icon">
      🏆
    </div>
    <div className="achievement-body">
      <h3 className="achievement-title">{achievement.title}</h3>
      <p className="achievement-desc">{achievement.description}</p>
    </div>
  </div>
);

const Certifications = ({ certifications, achievements }) => {
  const certs = certifications?.length ? certifications : seedCertifications;
  const achiev = achievements?.length ? achievements : seedAchievements;

  return (
    <section id="certifications" className="section">
      <div className="container">
        {/* Certifications */}
        <h2 className="section-title reveal">Certifications</h2>
        <div className="divider reveal" />
        <p className="section-subtitle reveal">
          Professional certifications that validate my technical expertise.
        </p>

        <div className="certs-grid">
          {certs.map((c, i) => (
            <CertCard key={c.id || i} cert={c} index={i} />
          ))}
        </div>

        {/* Achievements */}
        <div style={{ marginTop: "80px" }}>
          <h2 className="section-title reveal">Achievements</h2>
          <div className="divider reveal" />
          <p className="section-subtitle reveal">
            Milestones and recognitions from my academic and professional journey.
          </p>
          <div className="achievements-grid">
            {achiev.map((a, i) => (
              <AchievementCard key={a.id || i} achievement={a} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
