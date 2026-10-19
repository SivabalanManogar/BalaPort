import React, { useState } from "react";
import { seedProjects } from "../firebase/seedData";
import "../styles/Projects.css";

const CATEGORIES = ["All", "Full Stack", "Data Science", "Frontend"];

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-lg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {project.image && (
          <img src={project.image} alt={project.title} className="modal-project-img" loading="lazy" />
        )}
        <div className="modal-project-cat">
          <span className="tag">{project.category}</span>
          {project.featured && <span className="tag featured-tag">⭐ Featured</span>}
        </div>
        <h2 className="modal-project-title">{project.title}</h2>
        <p className="modal-project-desc">{project.description}</p>
        {project.bullets?.length > 0 && (
          <ul className="modal-bullets">
            {project.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
        <div className="modal-tags">
          {(project.techTags || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="modal-project-links">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
              GitHub
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = ({ projects }) => {
  const data = projects?.length ? projects : seedProjects;
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = filter === "All" ? data : data.filter((p) => p.category === filter);

  const cats = ["All", ...new Set(data.map((p) => p.category).filter(Boolean))];

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title reveal">Projects</h2>
        <div className="divider reveal" />
        <p className="section-subtitle reveal">
          A selection of projects that showcase my skills across full-stack development and data science.
        </p>

        {/* Filter buttons */}
        <div className="project-filters reveal">
          {cats.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map((p, i) => (
            <div key={p.id || i} className="project-card glass-card reveal">
              <div className="project-img-wrap">
                {p.image ? (
                  <img src={p.image} alt={p.title} loading="lazy" />
                ) : (
                  <div className="project-img-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6M9 12h6M9 15h4" />
                    </svg>
                  </div>
                )}
                {p.featured && <div className="project-featured-badge">⭐ Featured</div>}
                <div className="project-cat-badge">{p.category}</div>
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>
                <div className="project-tags">
                  {(p.techTags || []).slice(0, 4).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  {(p.techTags || []).length > 4 && (
                    <span className="tag">+{p.techTags.length - 4}</span>
                  )}
                </div>
                <div className="project-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(p)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Details
                  </button>
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {p.liveLink && (
                    <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
            <h3>No projects in this category</h3>
            <p>Try selecting a different filter.</p>
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default Projects;
