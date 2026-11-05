"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/public/css/TerminalComp.css";
import type { BlogInitialPost } from "@/components/BlogTerminalPage.types";

import About from "./TerminalComp/About";
import AIResponse from "./TerminalComp/AIResponse";
import type { ChatResponse, ChatTurn } from "@/lib/knowledge/types";
import { MAX_HISTORY_TURNS, MAX_QUESTION_CHARS } from "@/lib/knowledge/config";
import Projects from "./TerminalComp/Projects";
import Skills from "./TerminalComp/Skills";
import Contact from "./TerminalComp/Contact";
import Experience from "./TerminalComp/Experience";
import Blog from "./TerminalComp/Blog";
import BlogSearchResults from "./TerminalComp/BlogSearchResults";
import CommentSection from "./TerminalComp/CommentSection";
import {
  searchBlogPosts,
  type BlogSearchPost,
} from "@/lib/blog-search";
import {
  HOME_DIR,
  FILE_CONTENTS,
  formatLsLong,
  getCalOutput,
  printfFormat,
  MAN_PAGES,
  getFortune,
  getCowsay,
  getBanner,
  getNeofetchData,
  TOOL_VERSIONS,
  getUptime,
  getFreeOutput,
  getDfOutput,
  getPsOutput,
  getEnvOutput,
  getWhoOutput,
  getLastOutput,
  getTreeOutput,
  grepFile,
  getLsbRelease,
  getGitStatus,
  getSlTrain,
} from "./TerminalComp/commands/virtualFs";

// Type definitions
interface PromptProps {
  user: string;
  host: string;
}

interface OutputLineProps {
  children: React.ReactNode;
}

interface HistoryLine {
  type: "prompt" | "output";
  command?: string;
  content?: React.ReactNode | string;
}

interface HelpItem {
  type: "title" | "command";
  text?: string;
  command?: string;
  description?: string;
}

interface TerminalProps {
  onFirstCommand?: () => void;
  /** When set, this terminal is mounted on /blog routes. */
  blogRoute?: boolean;
  initialBlogSlug?: string | null;
  initialBlogPost?: BlogInitialPost | null;
  /** Deep-link from /?section=about */
  initialSection?: string | null;
  /** Deep-link from /?cmd=help */
  initialCommand?: string | null;
}

const HOME_CD_SECTIONS = [
  "about",
  "projects",
  "skills",
  "experience",
  "contact",
  "welcome",
] as const;

// ============ Typewriter Text Component ============
const TypewriterText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-green-400">|</span>
      )}
    </>
  );
};

// ============ NEW: Loading Indicator ============
const AILoading: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
      <span role="status">Searching Anup&apos;s portfolio and blogs</span>
      <span className="animate-pulse">...</span>
    </div>
  );
};

// Neofetch-style output: responsive two-column layout (logo left, info right)
const Neofetch: React.FC<{ user: string; host: string }> = ({ user, host }) => {
  const d = getNeofetchData(user, host);
  return (
    <div className="neofetch">
      <div className="neofetch-art">
        <pre className="neofetch-logo" aria-hidden="true">
{["  .--------------.",
  "  |  portfolio   |",
  "  |   terminal   |",
  "  '--------------'",
  "         |",
  "    .----+----.",
  "    |  ~ $     |",
  "    '----------'"].join("\n")}
        </pre>
      </div>
      <div className="neofetch-info">
        <div className="neofetch-user">{d.user}</div>
        <div className="neofetch-divider">───────────────</div>
        <dl className="neofetch-rows">
          <div className="neofetch-row">
            <dt>OS:</dt>
            <dd>{d.os}</dd>
          </div>
          <div className="neofetch-row">
            <dt>Host:</dt>
            <dd>{d.host}</dd>
          </div>
          <div className="neofetch-row">
            <dt>Kernel:</dt>
            <dd>{d.kernel}</dd>
          </div>
          <div className="neofetch-row">
            <dt>Uptime:</dt>
            <dd>{d.uptime}</dd>
          </div>
          <div className="neofetch-row">
            <dt>Shell:</dt>
            <dd>{d.shell}</dd>
          </div>
          <div className="neofetch-row">
            <dt>Theme:</dt>
            <dd>{d.theme}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

// Rendered once per history line, so memoized to skip re-rendering unchanged
// lines whenever the terminal re-renders (e.g. on every keystroke).
const Prompt: React.FC<PromptProps & { cwd?: string }> = React.memo(({ user, host, cwd = "~" }) => (
  <span
    className="terminal-prompt"
    aria-label={`Command prompt for ${user} at ${host}`}
  >
    <span className="prompt-user">
      {user}@{host}
    </span>
    <span className="prompt-separator">:</span>
    <span className="prompt-directory">{cwd === "~" ? "~" : cwd}</span>
    <span className="prompt-symbol">$ </span>
  </span>
));
Prompt.displayName = "Prompt";

const OutputLine: React.FC<OutputLineProps> = React.memo(({ children }) => (
  <div className="output-line">{children}</div>
));
OutputLine.displayName = "OutputLine";

// Static data moved outside components to avoid dependency issues
const HELP_ITEMS: HelpItem[] = [
  { type: "title", text: "Available commands:" },
  { type: "command", command: "help", description: "Display this help message." },
  { type: "command", command: "ls [-l|-a|-la]", description: "List directory contents." },
  { type: "command", command: "pwd", description: "Print working directory." },
  { type: "command", command: "cd [dir]", description: "Change directory. cd with no args goes home." },
  { type: "command", command: "cd welcome", description: "Display the welcome message." },
  { type: "command", command: "cd about", description: "Learn more about me." },
  { type: "command", command: "cd projects", description: "View my recent projects." },
  { type: "command", command: "cd skills", description: "See my technical skills." },
  { type: "command", command: "cd experience", description: "View my professional experience." },
  { type: "command", command: "cd contact", description: "Get my contact information." },
  { type: "command", command: "cd blog", description: "Open the blog (/blog)." },
  { type: "command", command: "blog [keyword]", description: "Open blog or search posts (e.g. blog Malware)." },
  { type: "command", command: "comment <post>", description: "Read only that post's comments (e.g. comment malware-nowadays)." },
  { type: "command", command: "cat <file>", description: "Print file contents (e.g. cat README, cat blog)." },
  { type: "command", command: "whoami", description: "Print current user." },
  { type: "command", command: "hostname", description: "Print system hostname." },
  { type: "command", command: "id", description: "Print user and group IDs." },
  { type: "command", command: "uname [-a]", description: "Print system info." },
  { type: "command", command: "date", description: "Print current date and time." },
  { type: "command", command: "cal", description: "Display current month calendar." },
  { type: "command", command: "echo <text>", description: "Print the given text." },
  { type: "command", command: "printf <format> [args]", description: "Print formatted string (%s, %d, \\n)." },
  { type: "command", command: "history", description: "List recent commands." },
  { type: "command", command: "man <cmd>", description: "Show manual for command." },
  { type: "command", command: "neofetch", description: "Display system info and ASCII logo." },
  { type: "command", command: "fortune", description: "Print a random quote." },
  { type: "command", command: "cowsay [msg]", description: "Cow says your message." },
  { type: "command", command: "banner <text>", description: "Print text in large ASCII." },
  { type: "command", command: "yes [string]", description: "Repeat string (limited)." },
  { type: "command", command: "ai <question>", description: "Ask about my portfolio and blogs (up to 10 requests/day)." },
  { type: "command", command: "clear", description: "Clear the terminal screen." },
  { type: "command", command: "exit", description: "Close this tab/window." },
  { type: "title", text: "System & files:" },
  { type: "command", command: "uptime", description: "Show how long the system has been up." },
  { type: "command", command: "free [-h]", description: "Show memory usage." },
  { type: "command", command: "df [-h]", description: "Show disk space usage." },
  { type: "command", command: "ps [aux]", description: "Snapshot of running processes." },
  { type: "command", command: "top", description: "Running processes (snapshot)." },
  { type: "command", command: "env", description: "Print environment variables." },
  { type: "command", command: "groups", description: "Print the current user's groups." },
  { type: "command", command: "who / w / users", description: "Show who is logged on." },
  { type: "command", command: "last", description: "Show recent login history." },
  { type: "command", command: "arch", description: "Print machine architecture." },
  { type: "command", command: "lsb_release [-a]", description: "Print distribution info." },
  { type: "command", command: "tree", description: "List files as a tree." },
  { type: "command", command: "head/tail <file>", description: "Print a file's contents." },
  { type: "command", command: "wc <file>", description: "Count lines, words, bytes." },
  { type: "command", command: "grep <pat> [file]", description: "Print lines matching a pattern." },
  { type: "command", command: "which <cmd>", description: "Locate a command." },
  { type: "command", command: "whatis <cmd>", description: "One-line command description." },
  { type: "command", command: "git [status|log]", description: "Show repository status." },
  { type: "command", command: "node/npm/python", description: "Print tool versions." },
  { type: "command", command: "sl", description: "Steam locomotive (for ls typos)." },
];

const WELCOME_LINES: string[] = [
  "Hi, I'm Anup Pradhan, a Software Engineer.",
  "Welcome to my interactive portfolio terminal!",
  "Type 'help' or 'ls' for commands. Use 'cd <name>' to open sections (e.g. cd about, cd blog, cd projects).",
  "✨ NEW: Try 'ai <your question>' to chat with AI assistant!",
];

// Tab completion: full-line completions (for backward compatibility)
const TAB_COMPLETIONS: string[] = [
  "cd welcome",
  "cd about",
  "cd projects",
  "cd skills",
  "cd experience",
  "cd contact",
  "cd blog",
  "blog",
  "cat blog",
  "help",
  "ls",
  "ls -l",
  "ls -la",
  "pwd",
  "cat",
  "whoami",
  "hostname",
  "id",
  "uname",
  "uname -a",
  "date",
  "cal",
  "echo",
  "printf",
  "history",
  "man",
  "neofetch",
  "fortune",
  "cowsay",
  "banner",
  "yes",
  "clear",
  "blog",
  "comment",
  "exit",
  "uptime",
  "free",
  "free -h",
  "df",
  "df -h",
  "ps",
  "ps aux",
  "top",
  "env",
  "groups",
  "who",
  "last",
  "arch",
  "lsb_release -a",
  "tree",
  "git status",
  "git log",
  "which",
  "whatis",
  "sl",
];

// Command names for first-word completion and man
const COMMAND_NAMES = [
  "help",
  "ls",
  "ls -l",
  "ls -la",
  "ls -a",
  "pwd",
  "cd",
  "cat",
  "whoami",
  "hostname",
  "id",
  "uname",
  "date",
  "cal",
  "echo",
  "printf",
  "history",
  "man",
  "clear",
  "blog",
  "comment",
  "exit",
  "ai",
  "neofetch",
  "fortune",
  "cowsay",
  "banner",
  "yes",
  "uptime",
  "free",
  "df",
  "ps",
  "top",
  "env",
  "printenv",
  "groups",
  "who",
  "w",
  "users",
  "last",
  "arch",
  "lsb_release",
  "tree",
  "head",
  "tail",
  "wc",
  "grep",
  "which",
  "whatis",
  "node",
  "npm",
  "python",
  "python3",
  "git",
  "sl",
  "sudo",
  "touch",
  "mkdir",
  "rm",
  "rmdir",
  "mv",
  "cp",
  "reboot",
  "shutdown",
  "poweroff",
  "halt",
  "vim",
  "vi",
  "nano",
  "emacs",
  "apt",
  "apt-get",
  "pacman",
  "yum",
];

const CD_SECTIONS = [
  "welcome",
  "about",
  "blog",
  "projects",
  "skills",
  "experience",
  "contact",
];

/** Accepts a raw slug or a full/partial blog URL and returns the slug candidate. */
function extractBlogSlug(arg: string): string {
  const trimmed = arg.trim();
  const match = trimmed.match(/\/blog\/([^/?#]+)/i);
  if (match) return decodeURIComponent(match[1]);
  return trimmed.replace(/^\/+|\/+$/g, "");
}

function getCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let i = 0;
  while (i < strings[0].length) {
    const c = strings[0][i];
    if (strings.every((s) => s[i] === c)) i++;
    else break;
  }
  return strings[0].slice(0, i);
}

/** Context-aware tab completion: returns matches and the line to set (single match or common prefix). */
function getTabCompletion(
  input: string,
  blogPosts: BlogSearchPost[] = []
): { matches: string[]; setLine: string; isPartial: boolean } {
  const raw = input.trimEnd();
  const endsWithSpace = /\s$/.test(input);
  const parts = raw.split(/\s+/).filter(Boolean);
  const command = parts[0]?.toLowerCase() ?? "";
  const isCompletingArg = endsWithSpace || parts.length > 1;
  const prefix = isCompletingArg && parts.length > 0
    ? (endsWithSpace ? "" : (parts[parts.length - 1] ?? ""))
    : raw;
  const argPrefix = prefix.toLowerCase();
  const baseForArg = endsWithSpace ? raw + " " : parts.slice(0, -1).join(" ") + (parts.length > 1 ? " " : "");

  if (
    isCompletingArg &&
    (command === "blog" || command === "comment" || command === "comments") &&
    blogPosts.length > 0
  ) {
    const matches = blogPosts
      .filter(
        (p) =>
          p.slug.toLowerCase().startsWith(argPrefix) ||
          p.title.toLowerCase().includes(argPrefix)
      )
      .map((p) => p.slug);
    if (matches.length === 0) return { matches: [], setLine: input, isPartial: false };
    const common = getCommonPrefix(matches);
    const setLine = matches.length === 1 ? baseForArg + matches[0] : baseForArg + common;
    return {
      matches,
      setLine,
      isPartial: matches.length > 1 && common.length === prefix.length,
    };
  }

  if (isCompletingArg && (command === "cd" || command === "cat" || command === "man")) {
    const list =
      command === "cd" ? CD_SECTIONS
      : command === "cat" ? [...HOME_DIR]
      : COMMAND_NAMES;
    const matches = list.filter((s) => String(s).toLowerCase().startsWith(argPrefix));
    if (matches.length === 0) return { matches: [], setLine: input, isPartial: false };
    const common = getCommonPrefix(matches);
    const setLine = matches.length === 1 ? baseForArg + matches[0] : baseForArg + common;
    return {
      matches,
      setLine,
      isPartial: matches.length > 1 && common.length === prefix.length,
    };
  }

  if (parts.length === 1 && !endsWithSpace) {
    const matches = COMMAND_NAMES.filter((c) => c.startsWith(argPrefix));
    if (matches.length === 0) return { matches: [], setLine: input, isPartial: false };
    const common = getCommonPrefix(matches);
    return {
      matches,
      setLine: matches.length === 1 ? matches[0] : common,
      isPartial: matches.length > 1 && common.length === prefix.length,
    };
  }

  const matches = TAB_COMPLETIONS.filter((c) => c.startsWith(raw));
  if (matches.length === 0) return { matches: [], setLine: input, isPartial: false };
  const common = getCommonPrefix(matches);
  return {
    matches,
    setLine: matches.length === 1 ? matches[0] : (common.length > raw.length ? common : raw),
    isPartial: matches.length > 1 && common.length === raw.length,
  };
}

const Help: React.FC = () => {
  const [displayedItems, setDisplayedItems] = useState<HelpItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < HELP_ITEMS.length) {
        setDisplayedItems((prev) => [...prev, HELP_ITEMS[currentStep]]);
        setCurrentStep(currentStep + 1);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="help-command" role="region" aria-label="Help menu">
      {displayedItems.map((item, i) =>
        item.type === "title" ? (
          <p key={i}>
            <TypewriterText text={item.text || ""} speed={20} />
          </p>
        ) : (
          <ul key={i}>
            <li>
              <span className="command-name">
                <TypewriterText text={item.command || ""} speed={20} />
              </span>{" "}
              –{" "}
              <TypewriterText text={item.description || ""} speed={20} />
            </li>
          </ul>
        )
      )}
    </div>
  );
};

const Welcome: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < WELCOME_LINES.length) {
        setDisplayedLines((prev) => [...prev, WELCOME_LINES[currentLine]]);
        setCurrentLine(currentLine + 1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [currentLine]);

  return (
    <div role="region" aria-label="Welcome message">
      {displayedLines.map((line, i) => (
        <OutputLine key={i}>
          <TypewriterText text={line} speed={20} />
        </OutputLine>
      ))}
    </div>
  );
};

const MAX_COMMAND_HISTORY = 50;

const PWD_DISPLAY = "/home/anup";

export default function Terminal({
  onFirstCommand,
  blogRoute = false,
  initialBlogSlug = null,
  initialBlogPost = null,
  initialSection = null,
  initialCommand = null,
}: TerminalProps) {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState<string>("");
  const [cwd, setCwd] = useState<string>("~");
  const [tabSuggestions, setTabSuggestions] = useState<string[] | null>(null);
  const [isFirstUserCommand, setIsFirstUserCommand] = useState<boolean>(true);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const savedInputRef = useRef<string>("");
  const aiConversation = useRef<ChatTurn[]>([]);
  const aiRequestPending = useRef(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [blogPostsCache, setBlogPostsCache] = useState<BlogSearchPost[]>([]);

  const user = "anup";
  const host = "ruki";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) return;
        const data: { posts: BlogSearchPost[] } = await res.json();
        if (!cancelled) setBlogPostsCache(data.posts ?? []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ============ AI Command Handler: shows user question (prompt) + AI response ============
  const handleAICommand = async (
    question: string,
    historyWithPrompt: HistoryLine[]
  ): Promise<void> => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setHistory([
        ...historyWithPrompt,
        {
          type: "output",
          content: "Please provide a question. Usage: ai <your question>",
        },
      ]);
      return;
    }

    if (aiRequestPending.current) return;
    if (trimmedQuestion.length > MAX_QUESTION_CHARS) {
      setHistory([...historyWithPrompt, { type: "output", content: `Please keep your question under ${MAX_QUESTION_CHARS + 1} characters.` }]);
      return;
    }
    aiRequestPending.current = true;

    setIsAILoading(true);
    setHistory([
      ...historyWithPrompt,
      { type: "output", content: <AILoading /> },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedQuestion, history: aiConversation.current }),
        signal: AbortSignal.timeout(60_000),
      });

      const data: ChatResponse = await response.json();
      if (response.ok && data.success && typeof data.response === "string") {
        const answer = data.response;
        aiConversation.current = [...aiConversation.current, { question: trimmedQuestion, answer: answer.slice(0, 1600) }].slice(-MAX_HISTORY_TURNS);
        setHistory(prev => [
          ...prev.slice(0, -1),
          { type: "output", content: <AIResponse text={answer} sources={data.sources} /> },
        ]);
      } else {
        setHistory(prev => [...prev.slice(0, -1), { type: "output", content: `AI Error: ${data.error ?? "AI temporarily unavailable. Please try again."}` }]);
      }
    } catch {
      setHistory((prev) => [
        ...prev.slice(0, -1),
        {
          type: "output",
          content: "Failed to connect to AI. Please try again.",
        },
      ]);
    } finally {
      aiRequestPending.current = false;
      setIsAILoading(false);
    }
  };

  const redirectFromBlogRoute = (trimmedCmd: string): boolean => {
    if (!blogRoute) return false;

    const parts = trimmedCmd.split(/\s+/);
    const commandName = parts[0]?.toLowerCase() ?? "";
    const args = parts.slice(1);

    if (commandName === "blog") {
      const q = args.join(" ").trim();
      if (q) {
        router.push(`/?cmd=${encodeURIComponent(`blog ${q}`)}`);
      } else {
        router.push("/blog");
      }
      return true;
    }

    if (commandName === "cd" && args[0]?.toLowerCase() === "blog") {
      router.push("/blog");
      return true;
    }

    if (
      commandName === "cd" &&
      args[0] &&
      HOME_CD_SECTIONS.includes(
        args[0].toLowerCase() as (typeof HOME_CD_SECTIONS)[number]
      )
    ) {
      const dir = args[0].toLowerCase();
      router.push(dir === "welcome" ? "/" : `/?section=${dir}`);
      return true;
    }

    router.push(`/?cmd=${encodeURIComponent(trimmedCmd)}`);
    return true;
  };

  const processCommand = async (
    cmd: string,
    isAuto: boolean = false
  ): Promise<void> => {
    if (aiRequestPending.current) return;
    const trimmedCmd = cmd.trim();

    if (!isAuto && blogRoute && trimmedCmd) {
      redirectFromBlogRoute(trimmedCmd);
      return;
    }

    const newHist: HistoryLine[] = [
      ...history,
      { type: "prompt", command: cmd },
    ];

    if (isFirstUserCommand && !isAuto && onFirstCommand) {
      onFirstCommand();
      setIsFirstUserCommand(false);
    }

    // Command history: store every successfully run command (newest first), skip empty and auto
    if (!isAuto && trimmedCmd) {
      setCommandHistory((prev) => {
        if (prev[0] === trimmedCmd) return prev;
        return [trimmedCmd, ...prev].slice(0, MAX_COMMAND_HISTORY);
      });
      setHistoryIndex(-1);
    }

    // ============ AI command: show user prompt + response (handleAICommand adds prompt so it stays visible) ============
    if (trimmedCmd.toLowerCase().startsWith("ai ")) {
      const question = trimmedCmd.substring(3).trim();
      await handleAICommand(question, newHist);
      return;
    }

    // Handle 'ai' alone without question
    if (trimmedCmd.toLowerCase() === "ai") {
      newHist.push({
        type: "output",
        content: "Please provide a question. Usage: ai <your question>",
      });
      setHistory(newHist);
      return;
    }

    // echo: repeat what the user typed (flavor command)
    if (trimmedCmd.toLowerCase().startsWith("echo ")) {
      newHist.push({
        type: "output",
        content: trimmedCmd.slice(5).trim() || " ",
      });
      setHistory(newHist);
      return;
    }
    if (trimmedCmd.toLowerCase() === "echo") {
      newHist.push({ type: "output", content: " " });
      setHistory(newHist);
      return;
    }

    const parts = trimmedCmd.split(/\s+/);
    const commandName = parts[0]?.toLowerCase() ?? "";
    const args = parts.slice(1);

    // cd [dir] — changes the working "directory" and may navigate (side effects)
    if (commandName === "cd") {
      if (args.length === 0) {
        setCwd("~");
        newHist.push({ type: "output", content: "" });
        setHistory(newHist);
        return;
      }
      const dir = args[0].toLowerCase();
      if (dir === "blog") {
        router.push("/blog");
        return;
      }
      const sectionMap: Record<string, React.ReactNode> = {
        welcome: <Welcome />,
        about: <About />,
        projects: <Projects />,
        skills: <Skills />,
        experience: <Experience />,
        contact: <Contact />,
      };
      if (sectionMap[dir] !== undefined) {
        setCwd("~");
        newHist.push({ type: "output", content: sectionMap[dir] });
        setHistory(newHist);
        return;
      }
      newHist.push({
        type: "output",
        content: (
          <span className="terminal-stderr">
            cd: {args[0]}: No such file or directory
          </span>
        ),
      });
      setHistory(newHist);
      return;
    }

    // clear — wipe the screen, no output line
    if (commandName === "clear") {
      aiConversation.current = [];
      setHistory([]);
      return;
    }

    // blog — navigate to the blog index or render search results (side effects)
    if (commandName === "blog") {
      const query = args.join(" ").trim();
      if (!query) {
        router.push("/blog");
        return;
      }
      const matches = searchBlogPosts(blogPostsCache, query);
      newHist.push({
        type: "output",
        content: <BlogSearchResults posts={matches} query={query} />,
      });
      setHistory(newHist);
      return;
    }

    // comment <post-slug-or-url> — show just that post's comments, read-only
    if (commandName === "comment" || commandName === "comments") {
      const query = args.join(" ").trim();
      if (!query) {
        newHist.push({
          type: "output",
          content: (
            <span className="terminal-stderr">
              Usage: comment &lt;post-slug-or-url&gt; (e.g. comment
              malware-nowadays)
            </span>
          ),
        });
        setHistory(newHist);
        return;
      }
      const candidate = extractBlogSlug(query).toLowerCase();
      const exact = blogPostsCache.find(
        (p) => p.slug.toLowerCase() === candidate
      );
      const resolvedSlug =
        exact?.slug ?? searchBlogPosts(blogPostsCache, query, 1)[0]?.slug;

      if (!resolvedSlug) {
        newHist.push({
          type: "output",
          content: (
            <span className="terminal-stderr">
              comment: no blog post found for &quot;{query}&quot;
            </span>
          ),
        });
        setHistory(newHist);
        return;
      }

      newHist.push({
        type: "output",
        content: <CommentSection slug={resolvedSlug} />,
      });
      setHistory(newHist);
      return;
    }

    // Helpers for the pure-command map below.
    const pre = (s: string) => <pre className="pre-output">{s}</pre>;
    const stderr = (s: string) => <span className="terminal-stderr">{s}</span>;
    // This is a read-only, in-browser filesystem — mutating commands always fail.
    const readOnlyFs = (cmd: string) => (a: string[]) =>
      stderr(`${cmd}: cannot operate on '${a[0] ?? ""}': Read-only file system`);
    // Privileged commands are politely refused.
    const notPermitted = (cmd: string) => () =>
      stderr(`${cmd}: Operation not permitted — this is a portfolio, not your server. Nice try 😄`);
    // Editors can't run in here; nudge toward cat.
    const editorJoke = (cmd: string) => (a: string[]) =>
      `${cmd}: cannot open a real editor here. Use 'cat ${a[0] ?? "<file>"}' to read files instead.`;
    // Package managers need a real machine.
    const pkgManager = (cmd: string) => () =>
      stderr(`E: Could not open lock file — are you root? '${cmd}' isn't available on this read-only terminal. Try 'cd skills' instead.`);

    // Pure commands: each maps args to output content with no side effects.
    const outputCommands: Record<string, (args: string[]) => React.ReactNode> = {
      pwd: () => (cwd === "~" ? PWD_DISPLAY : cwd),
      ls: (a) => {
        const long = a.includes("-l") || a.includes("-la");
        const list = [...HOME_DIR];
        const out = long ? formatLsLong(list) : list.join("  ");
        return <pre className="pre-output">{out}</pre>;
      },
      cat: (a) => {
        const name = a[0];
        if (!name) return "cat: missing operand";
        const key = HOME_DIR.find((e) => e.toLowerCase() === name.toLowerCase());
        if (key && FILE_CONTENTS[key]) return FILE_CONTENTS[key];
        return (
          <span className="terminal-stderr">
            cat: {name}: No such file or directory
          </span>
        );
      },
      hostname: () => host,
      id: () => `uid=1000(${user}) gid=1000(${user}) groups=1000(${user})`,
      uname: (a) =>
        a.includes("-a")
          ? `Linux ${host} 6.x portfolio-terminal #1 Next.js`
          : "Linux",
      cal: () => <pre className="pre-output">{getCalOutput()}</pre>,
      history: () => {
        const list = commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join("\n");
        return <pre className="pre-output">{list || " (empty)"}</pre>;
      },
      printf: (a) => printfFormat(a[0] ?? "", a.slice(1)),
      man: (a) => {
        const topic = a[0]?.toLowerCase();
        const page = topic ? MAN_PAGES[topic] : null;
        if (page) return page;
        return (
          <span className="terminal-stderr">
            No manual entry for {topic ?? ""}
          </span>
        );
      },
      neofetch: () => <Neofetch user={user} host={host} />,
      fortune: () => getFortune(),
      cowsay: (a) => (
        <pre className="pre-output">{getCowsay(a.length ? a.join(" ") : "moo")}</pre>
      ),
      banner: (a) => (
        <pre className="pre-output">{getBanner(a.length ? a.join(" ") : " ")}</pre>
      ),
      yes: (a) => Array(8).fill(a.length ? a.join(" ") : "y").join("\n"),
      help: () => <Help />,
      whoami: () => user,
      date: () => new Date().toString(),
      exit: () => "Close this tab to exit.",

      // --- System info ---
      uptime: () => getUptime(),
      arch: () => "x86_64",
      free: (a) => pre(getFreeOutput(a.includes("-h"))),
      df: (a) => pre(getDfOutput(a.includes("-h"))),
      ps: (a) => pre(getPsOutput(a.includes("aux") || a.includes("-aux") || a.includes("-ef"))),
      top: () => pre(getPsOutput(true)),
      env: () => pre(getEnvOutput(user)),
      printenv: () => pre(getEnvOutput(user)),
      groups: () => `${user} sudo docker users developers`,
      who: () => getWhoOutput(user),
      w: () => getWhoOutput(user),
      users: () => user,
      last: () => pre(getLastOutput(user)),
      lsb_release: () => pre(getLsbRelease()),

      // --- Files ---
      tree: () => pre(getTreeOutput(HOME_DIR)),
      head: (a) => outputCommands.cat(a),
      tail: (a) => outputCommands.cat(a),
      wc: (a) => {
        const name = a[0];
        const key = name && HOME_DIR.find((e) => e.toLowerCase() === name.toLowerCase());
        if (!key || FILE_CONTENTS[key] === undefined) {
          return stderr(`wc: ${name ?? ""}: No such file or directory`);
        }
        const text = FILE_CONTENTS[key];
        const lines = text.split("\n").length;
        const words = text.trim().split(/\s+/).length;
        const bytes = text.length;
        return ` ${lines}  ${words}  ${bytes} ${key}`;
      },
      grep: (a) => {
        if (a.length < 1) return stderr("usage: grep <pattern> [file]");
        const pattern = a[0];
        const fileArg = a[1];
        const key = fileArg
          ? HOME_DIR.find((e) => e.toLowerCase() === fileArg.toLowerCase())
          : undefined;
        const out = grepFile(pattern, key, FILE_CONTENTS, HOME_DIR);
        return out ? pre(out) : "";
      },
      which: (a) => {
        if (a.length === 0) return stderr("usage: which <command>");
        const lines = a.map((name) => {
          const cmd = name.toLowerCase();
          return MAN_PAGES[cmd] !== undefined
            ? `/usr/bin/${cmd}`
            : `which: no ${name} in (/usr/local/bin:/usr/bin:/bin)`;
        });
        return lines.length === 1 ? lines[0] : pre(lines.join("\n"));
      },
      whatis: (a) => {
        const topic = a[0]?.toLowerCase();
        const page = topic ? MAN_PAGES[topic] : undefined;
        if (!page) return `${topic ?? ""}: nothing appropriate.`;
        const desc = page.split("—")[1]?.trim() ?? page;
        return `${topic} (1)         - ${desc}`;
      },

      // --- Toolchain versions ---
      node: () => TOOL_VERSIONS.node,
      npm: () => TOOL_VERSIONS.npm,
      python: () => TOOL_VERSIONS.python,
      python3: () => TOOL_VERSIONS.python,

      // --- Source control ---
      git: (a) => pre(getGitStatus((a[0] ?? "").toLowerCase())),

      // --- Easter egg ---
      sl: () => pre(getSlTrain()),

      // --- Privileged / mutating commands: refused on a read-only terminal ---
      sudo: () => stderr(`${user} is not in the sudoers file. This incident will be reported.`),
      touch: readOnlyFs("touch"),
      mkdir: readOnlyFs("mkdir"),
      rm: readOnlyFs("rm"),
      rmdir: readOnlyFs("rmdir"),
      mv: readOnlyFs("mv"),
      cp: readOnlyFs("cp"),
      reboot: notPermitted("reboot"),
      shutdown: notPermitted("shutdown"),
      poweroff: notPermitted("poweroff"),
      halt: notPermitted("halt"),
      vim: editorJoke("vim"),
      vi: editorJoke("vi"),
      nano: editorJoke("nano"),
      emacs: editorJoke("emacs"),
      apt: pkgManager("apt"),
      "apt-get": pkgManager("apt-get"),
      pacman: pkgManager("pacman"),
      yum: pkgManager("yum"),
    };

    const handler = outputCommands[commandName];
    if (handler) {
      newHist.push({ type: "output", content: handler(args) });
      setHistory(newHist);
      return;
    }

    // Try blog title/slug search before "command not found"
    if (blogPostsCache.length > 0 && trimmedCmd.length >= 2) {
      const blogMatches = searchBlogPosts(blogPostsCache, trimmedCmd);
      if (blogMatches.length > 0) {
        newHist.push({
          type: "output",
          content: (
            <div>
              <p className="text-gray-400 font-mono text-sm mb-2">
                No command &quot;{parts[0]}&quot; — blog posts matching &quot;
                {trimmedCmd}&quot;:
              </p>
              <BlogSearchResults posts={blogMatches} query={trimmedCmd} />
              <p className="text-gray-500 font-mono text-xs mt-2">
                Tip: use <span className="text-green-400">blog {trimmedCmd}</span>{" "}
                next time
              </p>
            </div>
          ),
        });
        setHistory(newHist);
        return;
      }
    }

    newHist.push({
      type: "output",
      content: (
        <span className="terminal-stderr">
          bash: command not found: {parts[0] ?? commandName}
        </span>
      ),
    });
    setHistory(newHist);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isAILoading) return;
    setTabSuggestions(null);
    processCommand(input);
    setInput("");
  };

  const handleNav = async (cmd: string): Promise<void> => {
    if (blogRoute) {
      if (cmd === "blog") {
        router.push("/blog");
        return;
      }
      const cdSections = ["about", "projects", "skills", "experience", "contact"];
      if (cdSections.includes(cmd)) {
        router.push(`/?section=${cmd}`);
        return;
      }
      router.push(`/?cmd=${encodeURIComponent(cmd)}`);
      return;
    }

    const cdSections = ["about", "projects", "skills", "experience", "contact"];
    const commandToRun = cdSections.includes(cmd) ? `cd ${cmd}` : cmd;
    await processCommand(commandToRun);
  };

  const focusInput = (e?: React.SyntheticEvent): void => {
    // Don't steal focus from real form controls (e.g. the comment textarea) —
    // only the bare terminal chrome should snap focus back to the prompt.
    const target = e?.target as HTMLElement | undefined;
    if (
      target &&
      !target.closest("#terminal-input") &&
      target.closest("input, textarea, select, button, a, [contenteditable]")
    ) {
      return;
    }

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (inputRef.current && !isTouchDevice) {
      inputRef.current.focus();
    }

    setTimeout(() => {
      terminalRef.current?.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      aiConversation.current = [];
      setHistory([]);
      setHistoryIndex(-1);
      return;
    }
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      if (input) {
        setHistory((prev) => [
          ...prev,
          { type: "prompt", command: input },
          { type: "output", content: "^C" },
        ]);
      }
      setInput("");
      setHistoryIndex(-1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        savedInputRef.current = input;
        setHistoryIndex(0);
        setInput(commandHistory[0]);
      } else if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex((i) => i + 1);
        setInput(commandHistory[historyIndex + 1]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput(savedInputRef.current);
      } else {
        setHistoryIndex((i) => i - 1);
        setInput(commandHistory[historyIndex - 1]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const { matches, setLine } = getTabCompletion(input, blogPostsCache);
      if (matches.length === 1) {
        setInput(setLine);
        setTabSuggestions(null);
      } else if (matches.length > 1) {
        setInput(setLine);
        setTabSuggestions(matches);
      }
    }
  };

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      inputRef.current?.focus();
    }
    setTimeout(() => {
      if (blogRoute) {
        setHistory([
          { type: "prompt", command: "cd welcome" },
          { type: "output", content: <Welcome /> },
          { type: "prompt", command: "blog" },
          {
            type: "output",
            content: (
              <Blog
                slug={initialBlogSlug}
                initialPost={initialBlogPost}
                syncUrls
              />
            ),
          },
        ]);
        setIsFirstUserCommand(false);
        return;
      }

      const boot = async () => {
        if (initialSection) {
          if (initialSection === "blog") {
            router.replace("/blog", { scroll: false });
            return;
          }
          await processCommand(`cd ${initialSection}`, true);
          router.replace("/", { scroll: false });
        } else if (initialCommand) {
          await processCommand(initialCommand, true);
          router.replace("/", { scroll: false });
        } else {
          await processCommand("cd welcome", true);
        }
      };
      void boot();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      const blogEl = el.querySelector(".terminal-blog");
      if (blogEl && blogRoute) {
        const top = (blogEl as HTMLElement).offsetTop - 8;
        el.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        return;
      }
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [history, blogRoute]);

  return (
    <div
      className="terminal-container"
      onClick={focusInput}
      role="application"
      aria-label="Interactive terminal"
    >
      <header className="terminal-header">
        <div className="window-dots" aria-hidden="true">
          <div className="dot dot-red" aria-label="Close"></div>
          <div className="dot dot-yellow" aria-label="Minimize"></div>
          <div className="dot dot-green" aria-label="Maximize"></div>
        </div>
        <nav className="terminal-nav" aria-label="Terminal navigation">
          {[
            "help",
            "about",
            "projects",
            "skills",
            "experience",
            "contact",
            "clear",
            "blog",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleNav(cmd)}
              disabled={isAILoading}
              className="nav-button"
              type="button"
              aria-label={`Navigate to ${cmd}`}
            >
              {cmd}
            </button>
          ))}
        </nav>
      </header>
      <main
        ref={terminalRef}
        className="terminal-body"
        aria-live="polite"
        aria-atomic="false"
      >
        {history.map((line, i) => (
          <div key={i} className="history-line">
            {line.type === "prompt" ? (
              <div>
                <Prompt user={user} host={host} cwd={cwd} />
                <span className="command-text">{line.command}</span>
              </div>
            ) : (
              line.content
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="input-form">
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command input
          </label>
          <Prompt user={user} host={host} cwd={cwd} />
          <div className="input-area">
            <span className="input-value" aria-hidden="true">
              {input}
            </span>
            <span className="cursor-block" aria-hidden="true" />
            <input
              id="terminal-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setHistoryIndex(-1);
                setTabSuggestions(null);
              }}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              onFocus={focusInput}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
              disabled={isAILoading}
            />
          </div>
        </form>
        {tabSuggestions && tabSuggestions.length > 0 && (
          <div className="tab-suggestions" role="listbox" aria-label="Tab completion suggestions">
            <div className="tab-suggestions-label">Suggestions (Tab to complete):</div>
            <ul className="tab-suggestions-list">
              {tabSuggestions.map((s, i) => (
                <li key={i} className="tab-suggestions-item">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
