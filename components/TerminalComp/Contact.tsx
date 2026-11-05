import React, { useState } from "react";
import {
  socialLinks,
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  RESUME_URL,
} from "@/lib/portfolio-data";
import { PaneHeader } from "@/components/TerminalComp/ui";

const displayUrl = (href: string): string =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = async (): Promise<void> => {
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
      <PaneHeader
        title="~/contact"
        lede="Ready to collaborate on innovative projects and opportunities."
        aside={<span className="pane-status">Ready for new challenges</span>}
      />

      <section className="pane-section">
        <h3 className="pane-subtitle">direct</h3>
        <dl className="pane-rows">
          <div>
            <dt>email</dt>
            <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a href={`mailto:${CONTACT_EMAIL}`} className="pane-link">
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="pane-button"
                aria-label={`Copy email address: ${CONTACT_EMAIL}`}
              >
                {copiedEmail ? "copied" : "copy"}
              </button>
            </dd>
          </div>
          <div>
            <dt>resume</dt>
            <dd>
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="pane-link">
                Download CV ↗
              </a>
            </dd>
          </div>
          <div>
            <dt>location</dt>
            <dd>{CONTACT_LOCATION}</dd>
          </div>
        </dl>
      </section>

      <section className="pane-section">
        <h3 className="pane-subtitle">social</h3>
        <dl className="pane-rows">
          {socialLinks.map((social) => (
            <div key={social.name}>
              <dt>{social.name.toLowerCase()}</dt>
              <dd>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pane-link"
                  aria-label={`Visit ${social.name} profile (opens in new tab)`}
                >
                  {displayUrl(social.href)} ↗
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};

export default Contact;
