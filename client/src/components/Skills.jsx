import React, { useRef, useEffect } from "react";
import { seedSkills } from "../firebase/seedData";
import "../styles/Skills.css";

const SKILL_ICONS = {
  "JavaScript": "⚡",
  "Python": "🐍",
  "React.js": "⚛️",
  "Next.js": "▲",
  "HTML5": "🌐",
  "CSS3": "🎨",
  "Node.js": "🟢",
  "Express.js": "🚀",
  "REST APIs": "🔗",
  "MongoDB": "🍃",
  "MySQL": "🗄️",
  "Git": "🔧",
  "GitHub": "🐙",
  "Postman": "📮",
  "VS Code": "💻",
  "JWT": "🔐",
  "Pandas": "🐼",
  "NumPy": "📊",
  "Matplotlib": "📈",
  "Seaborn": "🌊",
  "Scikit-learn": "🤖",
};

const SKILL_LEVELS = {
  "JavaScript": 90,
  "Python": 85,
  "React.js": 90,
  "Next.js": 80,
  "HTML5": 95,
  "CSS3": 88,
  "Node.js": 85,
  "Express.js": 83,
  "REST APIs": 88,
  "MongoDB": 82,
  "MySQL": 78,
  "Git": 88,
  "GitHub": 88,
  "Postman": 80,
  "VS Code": 92,
  "JWT": 80,
  "Pandas": 85,
  "NumPy": 82,
  "Matplotlib": 80,
  "Seaborn": 78,
  "Scikit-learn": 78,
};

const ProgressBar = ({ level, label }) => {
  const barRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && barRef.current) {
          barRef.current.style.width = `${level}%`;
        }
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current.parentElement);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div className="skill-tag-item">
      <div className="skill-tag-top">
        <span>{SKILL_ICONS[label] || "●"} {label}</span>
        <span className="skill-level">{level}%</span>
      </div>
      <div className="skill-bar-bg">
        <div ref={barRef} className="skill-bar-fill" style={{ width: 0 }} />
      </div>
    </div>
  );
};

const Skills = ({ skills }) => {
  const data = skills?.length ? skills : seedSkills;

  return (
    <section id="skills" className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <h2 className="section-title reveal">Technical Skills</h2>
        <div className="divider reveal" />
        <p className="section-subtitle reveal">
          A curated set of technologies I work with daily to build powerful full-stack and data-driven applications.
        </p>

        <div className="skills-grid">
          {data.map((cat, i) => (
            <div key={cat.id || i} className="skill-card glass-card reveal">
              <div className="skill-cat-header">
                <h3 className="skill-cat-title">{cat.category}</h3>
                <span className="skill-cat-count">{cat.items?.length || 0} skills</span>
              </div>
              <div className="skill-items">
                {(cat.items || []).map((item) => (
                  <ProgressBar key={item} label={item} level={SKILL_LEVELS[item] || 75} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
