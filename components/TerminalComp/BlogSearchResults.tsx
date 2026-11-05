"use client";

import BlogCard, { type BlogCardPost } from "@/components/TerminalComp/BlogCard";

interface BlogSearchResultsProps {
  posts: BlogCardPost[];
  query?: string;
}

export default function BlogSearchResults({
  posts,
  query,
}: BlogSearchResultsProps) {
  if (posts.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        No blog posts found{query ? ` for "${query}"` : ""}.
      </p>
    );
  }

  return (
    <div className="blog-search-results text-sm">
      <p className="text-green-400/90 mb-2">
        $ blog search{query ? ` "${query}"` : ""} — {posts.length} result
        {posts.length === 1 ? "" : "s"}
      </p>
      <ul className="space-y-2 list-none p-0 m-0">
        {posts.map((p) => (
          <li key={p.slug}>
            <BlogCard post={p} href={`/blog/${p.slug}`} showBlogLabel />
          </li>
        ))}
      </ul>
    </div>
  );
}
