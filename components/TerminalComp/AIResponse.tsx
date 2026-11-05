"use client";

import { useEffect, useState } from "react";

export default function AIResponse({ text }: { text: string }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= text.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setVisible(count => reducedMotion ? text.length : Math.min(count + 4, text.length)), 12);
    return () => window.clearTimeout(timer);
  }, [visible, text]);

  return (
    <div className="ai-response">
      <div className="mb-2 text-green-400 font-mono text-sm">AI Assistant:</div>
      <div role="status" aria-label={text} className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        <span aria-hidden="true">
        {text.slice(0, visible)}
        {visible < text.length && <span className="animate-pulse text-green-400">|</span>}
        </span>
      </div>

    </div>
  );
}
