import React, { useState, useEffect } from "react";
import Image from "next/image";
import "@/public/css/IdentityComp.css";

interface IdentityCompProps {
  name?: string;
  title?: string;
  company?: string;
  photo?: string;
  id?: string;
}

const IdentityComp: React.FC<IdentityCompProps> = ({
  name = "Anup Pradhan",
  title = "Software Developer",
  company = "chati.ai",
  photo = "/images/your-photo.jpg",
  id = "EMP001",
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = (): void => {
    if (isMobile) {
      setIsHovered(true);
    }
  };

  const handleTouchEnd = (): void => {
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
      <article
        className={`identity-card ${isHovered ? "hovered" : ""} ${
          isMobile ? "mobile" : ""
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`Identity card for ${name}, ${title}`}
        itemScope
        itemType="https://schema.org/Person"
      >
        {/* Subtle grid/glow backdrop */}
        <div aria-hidden="true" className="backdrop-glow" />

        {/* CRT scanlines overlay */}
        <div aria-hidden="true" className="crt-scanlines" />

        {/* Card Header - Smaller on mobile */}
        <header className="card-header">
          <div className="company-logo" aria-hidden="true">
            <span className="logo-icon">&lt;/&gt;</span>
          </div>
          <div className="company-name" itemProp="worksFor">
            {company}
          </div>
        </header>

        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-frame">
            <Image
              src={photo}
              alt={`${name} profile photo`}
              width={150}
              height={150}
              className="profile-photo"
              priority
              itemProp="image"
            />
            <div className="photo-overlay" aria-hidden="true" />
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3 className="employee-name" itemProp="name">
            {name}
          </h3>
          <p className="employee-title" itemProp="jobTitle">
            {title}
          </p>
          <div className="employee-id" itemProp="identifier">
            ID: {id}
          </div>
        </div>

        {/* Card Footer - Hide AUTHORIZED on mobile */}
        {!isMobile && (
          <footer className="card-footer">
            <div className="access-level">
              <span className="status-indicator" aria-hidden="true" />
              <span>AUTHORIZED</span>
            </div>
          </footer>
        )}

        {/* Holographic Effect */}
        <div aria-hidden="true" className="holographic-overlay" />
      </article>

      {/* Interactive Label */}
      <div
        className="interaction-label"
        role="complementary"
        aria-label="Motivational quote"
      >
        {isMobile
          ? "[負けたらどうせ俺はその程度の男なんだから…]"
          : "[負けたらどうせ俺はその程度の男なんだから…]"}
      </div>
    </div>
  );
};

export default IdentityComp;
