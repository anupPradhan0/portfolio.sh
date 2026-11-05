import React from "react";

interface PaneHeaderProps {
  title: string;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

export const PaneHeader: React.FC<PaneHeaderProps> = ({ title, lede, aside, children }) => (
  <header className="pane-header">
    <div className="pane-header-top">
      <h2 className="pane-title">{title}</h2>
      {aside}
    </div>
    {lede && <p className="pane-meta">{lede}</p>}
    {children}
  </header>
);
