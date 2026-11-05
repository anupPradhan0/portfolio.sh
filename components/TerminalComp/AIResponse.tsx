"use client";

import { useEffect, useState } from "react";
import type { KnowledgeSource } from "@/lib/knowledge/types";
import { SITE_URL } from "@/lib/seo-config";

export default function AIResponse({ text, sources = [] }: { text: string; sources?: KnowledgeSource[] }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= text.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setVisible(count => reducedMotion ? text.length : Math.min(count + 4, text.length)), 12);
    return () => window.clearTimeout(timer);
  }, [visible, text]);

  const safeSources = sources.filter(source => {
    try { return new URL(source.url).origin === new URL(SITE_URL).origin; }
    catch { return false; }
  });

  return (
    <div className="ai-response">
      <div className="mb-2 text-green-400 font-mono text-sm">AI Assistant:</div>
      <div role="status" className="sr-only">{text}</div>
      <div aria-hidden="true" className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {text.slice(0, visible)}
        {visible < text.length && <span className="animate-pulse text-green-400">|</span>}
      </div>
      {safeSources.length > 0 && (
        <nav aria-label="Answer sources" className="mt-3 border-l-2 border-green-800 pl-3 font-mono text-xs">
          <p className="mb-1 text-gray-400">Sources</p>
          <ul className="space-y-1">
            {safeSources.map(source => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noopener noreferrer"
                  className="text-green-400 underline underline-offset-2 hover:text-green-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400">
                  [{source.id}] {source.title}<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
