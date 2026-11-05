"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BlogCard, { formatPostDate } from "@/components/TerminalComp/BlogCard";
import ViewStats from "@/components/TerminalComp/ViewStats";
import CommentSection from "@/components/TerminalComp/CommentSection";
import { PaneHeader } from "@/components/TerminalComp/ui";
import type { BlogInitialPost } from "@/components/BlogTerminalPage.types";

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

interface FullPost extends PostMeta {
  html: string;
}

type LoadState = "loading" | "ready" | "error";

interface BlogProps {
  slug?: string | null;
  initialPost?: BlogInitialPost | null;
  syncUrls?: boolean;
}

function rankRecommendations(
  current: PostMeta,
  pool: PostMeta[],
  limit = 3
): PostMeta[] {
  const currentTags = new Set(current.tags ?? []);
  return pool
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const overlap = (p.tags ?? []).reduce(
        (acc, t) => acc + (currentTags.has(t) ? 1 : 0),
        0
      );
      return { post: p, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return a.post.date < b.post.date ? 1 : -1;
    })
    .slice(0, limit)
    .map((x) => x.post);
}

const WORD_REVEAL_MAX_WORDS = 400;

function applyWordReveal(root: HTMLElement): void {
  if (root.dataset.wordsWalked === "1") return;
  root.dataset.wordsWalked = "1";

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const parent = (n as Text).parentElement;
    if (!parent) continue;
    if (parent.closest("code, pre, a")) continue;
    if (n.textContent && n.textContent.trim()) textNodes.push(n as Text);
  }

  let totalWords = 0;
  const splitCache: string[][] = textNodes.map((tn) => {
    const parts = (tn.textContent || "").split(/(\s+)/);
    totalWords += parts.filter((p) => p && !/^\s+$/.test(p)).length;
    return parts;
  });

  if (totalWords > WORD_REVEAL_MAX_WORDS) {
    return;
  }

  const perWordMs = Math.min(28, Math.max(6, 3000 / Math.max(1, totalWords)));

  let wordIdx = 0;
  textNodes.forEach((tn, i) => {
    const parts = splitCache[i];
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement("span");
        span.className = "blog-word";
        span.style.setProperty("--d", `${Math.round(wordIdx * perWordMs)}ms`);
        span.textContent = part;
        frag.appendChild(span);
        wordIdx++;
      }
    });
    tn.parentNode?.replaceChild(frag, tn);
  });
}

interface RecommendationsProps {
  items: PostMeta[];
  syncUrls: boolean;
  onSelect: (slug: string) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  items,
  syncUrls,
  onSelect,
}) => {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="More posts to read"
      className="terminal-blog-read-next"
    >
      <h3 className="pane-subtitle mb-3">Read next</h3>
      <ul className="pane-divided">
        {items.map((p) => (
          <li key={p.slug}>
            <BlogCard
              post={p}
              href={syncUrls ? `/blog/${p.slug}` : undefined}
              onClick={syncUrls ? undefined : () => onSelect(p.slug)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

const Blog: React.FC<BlogProps> = ({
  slug: slugProp = null,
  initialPost = null,
  syncUrls = false,
}) => {
  const router = useRouter();
  const [internalSlug, setInternalSlug] = useState<string | null>(null);
  const activeSlug = syncUrls ? slugProp : internalSlug;

  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [listState, setListState] = useState<LoadState>("loading");
  const [post, setPost] = useState<FullPost | null>(null);
  const [postState, setPostState] = useState<LoadState>("ready");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const articleRef = useRef<HTMLDivElement | null>(null);

  const goToSlug = (next: string | null) => {
    if (syncUrls) {
      if (next) router.push(`/blog/${next}`);
      else router.push("/blog");
      return;
    }
    setInternalSlug(next);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { posts: PostMeta[] } = await res.json();
        if (!cancelled) {
          setPosts([...data.posts].reverse());
          setListState("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : String(err));
          setListState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeSlug) {
      setPost(null);
      setPostState("ready");
      return;
    }

    if (initialPost && initialPost.slug === activeSlug) {
      setPost(initialPost);
      setPostState("ready");
      setNotFound(false);
      return;
    }

    let cancelled = false;
    setPostState("loading");
    setNotFound(false);
    (async () => {
      try {
        const res = await fetch(`/api/blog/${activeSlug}`);
        if (res.status === 404) {
          if (!cancelled) {
            setNotFound(true);
            setPostState("error");
          }
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: FullPost = await res.json();
        if (!cancelled) {
          setPost(data);
          setPostState("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : String(err));
          setPostState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSlug, initialPost]);

  useEffect(() => {
    if (postState !== "ready" || !post || !contentRef.current) return;
    applyWordReveal(contentRef.current);
    contentRef.current.querySelectorAll("a").forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });
    const scrollParent = articleRef.current?.closest(".terminal-body");
    const article = articleRef.current;
    if (scrollParent instanceof HTMLElement && article) {
      const parentRect = scrollParent.getBoundingClientRect();
      const articleRect = article.getBoundingClientRect();
      const top =
        scrollParent.scrollTop + (articleRect.top - parentRect.top) - 8;
      scrollParent.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, [postState, post, activeSlug]);

  useEffect(() => {
    if (!activeSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      goToSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSlug, syncUrls]);

  if (activeSlug) {
    return (
      <div className="pane terminal-blog" ref={articleRef}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {syncUrls ? (
            <Link
              href="/blog"
              title="Press Esc to go back"
              className="text-xs sm:text-sm text-gray-400 hover:text-green-400 transition-colors py-1"
            >
              ← back to posts{" "}
              <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-[10px] border border-white/15 rounded text-gray-400">
                Esc
              </kbd>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => goToSlug(null)}
              title="Press Esc to go back"
              className="text-xs sm:text-sm text-gray-400 hover:text-green-400 transition-colors cursor-pointer py-1"
            >
              ← back to posts{" "}
              <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-[10px] border border-white/15 rounded text-gray-400">
                Esc
              </kbd>
            </button>
          )}
          {post && (
            <span className="text-xs sm:text-sm text-gray-500 truncate min-w-0">
              {post.slug}.mdx
            </span>
          )}
        </div>

        {postState === "loading" && (
          <p className="text-green-400/70 text-sm">Loading post…</p>
        )}
        {postState === "error" && notFound && (
          <p className="text-red-400 text-sm break-words">
            cat: {activeSlug}.mdx: No such file or directory
          </p>
        )}
        {postState === "error" && !notFound && (
          <p className="text-red-400 text-sm break-words">
            Failed to load post: {errorMsg}
          </p>
        )}
        {postState === "ready" && post && (
          <article className="pane">
            <PaneHeader title={post.title}>
              <div className="pane-meta flex flex-wrap gap-x-3">
                {post.date && (
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                )}
                <ViewStats slug={post.slug} />
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="pane-tags mt-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="pane-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </PaneHeader>

            <div
              ref={contentRef}
              className="terminal-blog-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            <Recommendations
              items={rankRecommendations(post, posts)}
              syncUrls={syncUrls}
              onSelect={(s) => goToSlug(s)}
            />

            <CommentSection slug={post.slug} />
          </article>
        )}
      </div>
    );
  }

  return (
    <div className="pane terminal-blog">
      <PaneHeader
        title="~/blog"
        aside={
          listState === "ready" && posts.length > 0 ? (
            <span className="pane-meta">
              {posts.length} post{posts.length === 1 ? "" : "s"}
            </span>
          ) : null
        }
      />

      {listState === "loading" && (
        <p className="text-green-400/70 text-sm">Loading posts…</p>
      )}
      {listState === "error" && (
        <p className="text-red-400 text-sm break-words">
          Failed to load posts: {errorMsg}
        </p>
      )}
      {listState === "ready" && posts.length === 0 && (
        <p className="text-gray-400 text-sm">No posts yet.</p>
      )}
      {listState === "ready" && posts.length > 0 && (
        <ul className="pane-divided">
          {posts.map((p) => (
            <li key={p.slug} className="min-w-0">
              <BlogCard
                post={p}
                href={syncUrls ? `/blog/${p.slug}` : undefined}
                onClick={syncUrls ? undefined : () => goToSlug(p.slug)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
