"use client";

import Link from "next/link";
import { formatBlogPostLabel } from "@/lib/blog-search";

export interface BlogCardPost {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
}

export function formatPostDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const NEW_POST_DAYS = 30;

/** Badge on recency, not on "is it the last item" — a post shouldn't still
 *  say NEW two years from now just because nothing was written after it. */
function isNewPost(date: string): boolean {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const ageDays = (Date.now() - parsed.getTime()) / 86_400_000;
  return ageDays >= 0 && ageDays <= NEW_POST_DAYS;
}

interface BlogCardProps {
  post: BlogCardPost;
  /** Renders as a <Link> when set; otherwise a <button onClick>. */
  href?: string;
  onClick?: () => void;
  /** Suffix the title with "(blog)" — used when the card appears next to non-blog output. */
  showBlogLabel?: boolean;
}

/** The one fixed blog card design/layout — used by the post list, read-next
 *  recommendations, and inline terminal search results alike. */
export default function BlogCard({
  post,
  href,
  onClick,
  showBlogLabel = false,
}: BlogCardProps) {
  const className = "pane-entry";

  const content = (
    <>
      <div className="pane-spread">
        <h3 className="pane-item-title">
          {showBlogLabel ? formatBlogPostLabel(post.title) : post.title}
          {post.date && isNewPost(post.date) && (
            <span className="pane-prompt ml-2 text-xs font-normal">new</span>
          )}
        </h3>
        {post.date && (
          <time dateTime={post.date} className="pane-meta whitespace-nowrap">
            {formatPostDate(post.date)}
          </time>
        )}
      </div>
      {post.excerpt && <p className="line-clamp-2">{post.excerpt}</p>}
      {post.tags && post.tags.length > 0 && (
        <p className="pane-meta">
          {post.tags.slice(0, 3).map((tag) => `#${tag}`).join("  ")}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
