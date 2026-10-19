import React, { useState } from "react";
import "../styles/Gallery.css";

const Gallery = ({ gallery }) => {
  const [lightbox, setLightbox] = useState(null);
  const images = gallery || [];

  if (images.length === 0) {
    return (
      <section id="gallery" className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="section-title reveal">Gallery</h2>
          <div className="divider reveal" />
          <div className="empty-state reveal">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h3>No gallery images yet</h3>
            <p>Upload images from the admin panel.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <h2 className="section-title reveal">Gallery</h2>
        <div className="divider reveal" />
        <p className="section-subtitle reveal">
          A visual showcase of my work and achievements.
        </p>

        <div className="gallery-grid">
          {images.map((img, i) => (
            <div
              key={img.id || i}
              className="gallery-item reveal"
              onClick={() => setLightbox(img)}
            >
              <img
                src={img.image}
                alt={img.caption || `Gallery ${i + 1}`}
                loading="lazy"
              />
              {img.caption && (
                <div className="gallery-overlay">
                  <p>{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.caption || "Gallery"} />
            {lightbox.caption && <p className="lightbox-caption">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
