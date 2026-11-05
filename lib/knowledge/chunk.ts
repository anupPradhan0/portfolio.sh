export function cleanContent(content: string): string {
  return content
    .replace(/<!--[^]*?-->/g, "")
    .replace(/^\s*(?:import|export)\s+[^\n]+$/gm, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// A chunk with half an emoji can't be stored: Prisma rejects lone surrogates, failing the build.
const isLowSurrogate = (text: string, index: number) => (text.charCodeAt(index) & 0xfc00) === 0xdc00;

// Character bounds also keep long code blocks and text without whitespace bounded.
export function chunkContent(content: string, size = 1800, overlap = 200): string[] {
  if (size < 100 || overlap < 0 || overlap >= size) throw new Error("Invalid chunk bounds");
  const text = cleanContent(content);
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    if (end < text.length) {
      const paragraph = text.lastIndexOf("\n\n", end);
      const space = text.lastIndexOf(" ", end);
      if (paragraph > start + size / 2) end = paragraph;
      else if (space > start + size / 2) end = space;
      if (isLowSurrogate(text, end)) end--;
    }
    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end === text.length) break;
    start = end - overlap;
    if (isLowSurrogate(text, start)) start--;
  }
  return chunks;
}
