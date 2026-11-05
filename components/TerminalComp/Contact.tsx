import React, { useState } from "react";
import {
  socialLinks,
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  RESUME_URL,
} from "@/lib/portfolio-data";

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-green-400"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const MailIcon = () => (
  <Icon>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);

const LocationIcon = () => (
  <Icon>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

const ResumeIcon = () => (
  <Icon>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </Icon>
);

// Link metadata is shared; icons stay local to this pane.
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  YouTube: (
    <Icon>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </Icon>
  ),
  "Twitter / X": (
    <Icon>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  ),
  Instagram: (
    <Icon>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </Icon>
  ),
  LinkedIn: (
    <Icon>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  ),
  GitHub: (
    <Icon>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </Icon>
  ),
  LeetCode: (
    <Icon>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </Icon>
  ),
};

const ROW = "pane-card pane-row";

const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleEmailClick = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <div className="pane">
      <header className="pane-header">
        <h2 className="pane-title">~/contact</h2>
        <span className="pane-status">Ready for new challenges</span>
      </header>

      <p>Ready to collaborate on innovative projects and opportunities.</p>

      <section className="pane-section">
        <h3 className="pane-subtitle">Direct</h3>
        <div className="pane-grid pane-grid-compact">
          <button
            type="button"
            onClick={handleEmailClick}
            className={`${ROW} cursor-pointer`}
            aria-label={`Copy email address: ${CONTACT_EMAIL}`}
          >
            <MailIcon />
            <span className="min-w-0">
              <span className="pane-meta block">
                {copiedEmail ? "Copied to clipboard" : "Email · click to copy"}
              </span>
              <span className="block truncate text-gray-100">{CONTACT_EMAIL}</span>
            </span>
          </button>

          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={ROW}
            aria-label="Download resume (opens in new tab)"
          >
            <ResumeIcon />
            <span className="min-w-0">
              <span className="pane-meta block">Resume</span>
              <span className="block text-gray-100">Download CV</span>
            </span>
          </a>

          <div className={ROW}>
            <LocationIcon />
            <span className="min-w-0">
              <span className="pane-meta block">Location</span>
              <span className="block text-gray-100">{CONTACT_LOCATION}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="pane-section">
        <h3 className="pane-subtitle">Social</h3>
        <nav className="pane-grid pane-grid-compact" aria-label="Social media links">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={ROW}
              aria-label={`Visit ${social.name} profile (opens in new tab)`}
            >
              {SOCIAL_ICONS[social.name]}
              <span className="text-gray-100">{social.name}</span>
            </a>
          ))}
        </nav>
      </section>
    </div>
  );
};

export default Contact;
