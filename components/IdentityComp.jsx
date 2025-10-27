import React, { useState, useEffect } from 'react';
import '@/public/css/IdentityComp.css';

const IdentityComp = ({
  name = "Anup Pradhan (Mors)",
  title = "Full Stack Developer", 
  company = "Non",
  photo = "./images/your-photo.jpg",
  id = "EMP001"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setIsHovered(true);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setTimeout(() => setIsHovered(false), 2000);
    }
  };

  return (
    <div className="identity-container">
      {/* Lanyard String - Only show on desktop */}
      {!isMobile && (
        <>
          <div className="lanyard-string" />
          <div className="lanyard-clip" />
        </>
      )}

      {/* ID Card */}
      <div
        className={`identity-card ${isHovered ? 'hovered' : ''} ${isMobile ? 'mobile' : ''}`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Identity card"
      >
        {/* Subtle grid/glow backdrop */}
        <div aria-hidden className="backdrop-glow" />

        {/* CRT scanlines overlay */}
        <div aria-hidden className="crt-scanlines" />

        {/* Card Header - Smaller on mobile */}
        <div className="card-header">
          <div className="company-logo">
            <span className="logo-icon">&lt;/&gt;</span>
          </div>
          <div className="company-name">
            {company}
          </div>
        </div>

        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-frame">
            <img
              src={photo}
              alt="Profile"
              className="profile-photo"
            />
            <div className="photo-overlay" />
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3 className="employee-name">
            {name}
          </h3>
          <p className="employee-title">
            {title}
          </p>
          <div className="employee-id">
            ID: {id}
          </div>
        </div>

        {/* Card Footer - Hide AUTHORIZED on mobile */}
        {!isMobile && (
          <div className="card-footer">
            <div className="access-level">
              <span className="status-indicator" />
              <span>AUTHORIZED</span>
            </div>
          </div>
        )}

        {/* Holographic Effect */}
        <div aria-hidden className="holographic-overlay" />
      </div>

      {/* Interactive Label */}
      <div className="interaction-label">
        {isMobile ? '[負けたらどうせ俺はその程度の男なんだから…]' : '[負けたらどうせ俺はその程度の男なんだから…]'}
      </div>
    </div>
  );
};

export default IdentityComp;
