"use client";

import { useEffect, useState, type FormEvent } from "react";
import StickerPicker from "@/components/TerminalComp/StickerPicker";
import Sticker from "@/components/TerminalComp/Sticker";
import { formatRelativeTime } from "@/lib/time";

interface CommentDTO {
  id: number;
  authorName: string;
  body: string | null;
  stickerId: string | null;
  createdAt: string;
}

interface CommentsPage {
  comments: CommentDTO[];
  nextCursor: number | null;
  total: number;
}

type ListState = "loading" | "ready" | "error";

interface CommentSectionProps {
  slug: string;
}

const PAGE_SIZE = 4;

async function fetchPage(slug: string, cursor?: number): Promise<CommentsPage> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (cursor) params.set("cursor", String(cursor));
  const res = await fetch(`/api/blog/${slug}/comments?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [listState, setListState] = useState<ListState>("loading");
  const [loadingMore, setLoadingMore] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [stickerId, setStickerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setListState("loading");
    setComments([]);
    setNextCursor(null);
    (async () => {
      try {
        const page = await fetchPage(slug);
        if (!cancelled) {
          setComments(page.comments);
          setNextCursor(page.nextCursor);
          setTotal(page.total);
          setListState("ready");
        }
      } catch {
        if (!cancelled) setListState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await fetchPage(slug, nextCursor);
      setComments((prev) => [...prev, ...page.comments]);
      setNextCursor(page.nextCursor);
      setTotal(page.total);
    } catch {
      // list stays as-is; the button remains for the user to retry
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !stickerId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          body,
          stickerId: stickerId ?? undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : `HTTP ${res.status}`
        );
      }
      setComments((prev) => [data as CommentDTO, ...prev]);
      setTotal((t) => t + 1);
      setBody("");
      setStickerId(null);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to post comment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = (body.trim().length > 0 || stickerId !== null) && !submitting;

  return (
    <section
      aria-label="Comments"
      className="terminal-blog-comments pt-5 sm:pt-6 border-t border-green-800/40"
    >
      <h3 className="pane-subtitle mb-3">
        {total} comment{total === 1 ? "" : "s"}
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Name (optional)"
          maxLength={40}
          className="w-full bg-black/40 border border-green-800/40 focus:border-green-400/60 outline-none rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder:text-gray-600"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment…"
          maxLength={2000}
          rows={3}
          className="w-full bg-black/40 border border-green-800/40 focus:border-green-400/60 outline-none rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 resize-none"
        />
        <StickerPicker selectedId={stickerId} onSelect={setStickerId} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="pane-button cursor-pointer"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </div>
        {submitError && (
          <p className="text-red-400 text-xs">{submitError}</p>
        )}
      </form>

      {listState === "loading" && (
        <p className="text-green-400/70 text-sm">
          Loading comments…
        </p>
      )}
      {listState === "error" && (
        <p className="text-red-400 text-sm">
          Failed to load comments.
        </p>
      )}
      {listState === "ready" && comments.length === 0 && (
        <p className="text-gray-500 text-sm">
          No comments yet — be the first.
        </p>
      )}
      {listState === "ready" && comments.length > 0 && (
        <ul className="space-y-3 list-none p-0 m-0">
          {comments.map((c) => (
            <li
              key={c.id}
              className="pane-card"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="pane-item-title">{c.authorName}</span>
                <time dateTime={c.createdAt} className="pane-meta shrink-0">
                  {formatRelativeTime(c.createdAt)}
                </time>
              </div>
              {c.body && (
                <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                  {c.body}
                </p>
              )}
              {c.stickerId && (
                <div className="mt-1">
                  <Sticker id={c.stickerId} size={72} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {nextCursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-4 text-green-400/80 text-xs hover:text-green-300 transition-colors disabled:opacity-50"
        >
          {loadingMore ? "Loading…" : "→ read more comments"}
        </button>
      )}
    </section>
  );
}
