"use client";

import { useState } from "react";
import Sticker from "@/components/TerminalComp/Sticker";

interface StickerMeta {
  id: string;
  url: string;
}

type LoadState = "idle" | "loading" | "ready" | "error";

interface StickerPickerProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function StickerPicker({
  selectedId,
  onSelect,
}: StickerPickerProps) {
  const [open, setOpen] = useState(false);
  const [stickers, setStickers] = useState<StickerMeta[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && loadState === "idle") {
      setLoadState("loading");
      fetch("/api/stickers")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: { stickers: StickerMeta[] }) => {
          setStickers(data.stickers);
          setLoadState("ready");
        })
        .catch(() => setLoadState("error"));
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={toggleOpen}
        className={`rounded border text-xs transition-colors ${
          selectedId
            ? "p-1 border-green-400/60"
            : "px-2.5 py-1.5 border-white/15 text-green-400/80 hover:border-green-400/60"
        }`}
      >
        {selectedId ? <Sticker id={selectedId} size={48} /> : "sticker"}
      </button>

      {/* Inline panel (not absolutely positioned) — an overlay popover gets
          clipped by the scrolling terminal body on narrow mobile viewports. */}
      {open && (
        <div className="mt-2 max-h-48 overflow-y-auto border border-white/15 rounded-sm p-2">
          {loadState === "loading" && (
            <p className="text-gray-500 text-xs px-1 py-2">
              Loading stickers…
            </p>
          )}
          {loadState === "error" && (
            <p className="text-red-400 text-xs px-1 py-2">
              Failed to load stickers.
            </p>
          )}
          {loadState === "ready" && stickers.length === 0 && (
            <p className="text-gray-500 text-xs px-1 py-2">
              No stickers available.
            </p>
          )}
          {loadState === "ready" && stickers.length > 0 && (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
              {stickers.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelect(selectedId === s.id ? null : s.id);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-center p-1 rounded border transition-colors ${
                    selectedId === s.id
                      ? "border-green-400/70"
                      : "border-transparent hover:border-white/30"
                  }`}
                >
                  <Sticker id={s.id} size={36} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
