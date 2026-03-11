"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/public/css/TerminalComp.css";

import About from "./TerminalComp/About";
import Projects from "./TerminalComp/Projects";
import Skills from "./TerminalComp/Skills";
import Contact from "./TerminalComp/Contact";
import Experience from "./TerminalComp/Experience";
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
}

// ============ NEW: AI Rate Limiting Helper ============
const AI_RATE_LIMIT = {
  maxRequests: 10,
  maxOutputTokens: 1000,
  timeWindow: 24 * 60 * 60 * 1000,
};

const getAIUsage = (): { count: number; timestamp: number } => {
  if (typeof window === "undefined") return { count: 0, timestamp: Date.now() };

  const stored = localStorage.getItem("ai_usage");
  if (!stored) return { count: 0, timestamp: Date.now() };

  return JSON.parse(stored);
};

const incrementAIUsage = (): boolean => {
  const usage = getAIUsage();
  const now = Date.now();

  // Reset if 24 hours have passed
  if (now - usage.timestamp > AI_RATE_LIMIT.timeWindow) {
    localStorage.setItem(
      "ai_usage",
      JSON.stringify({ count: 1, timestamp: now })
    );
    return true;
  }

  // Check if limit reached
  if (usage.count >= AI_RATE_LIMIT.maxRequests) {
    return false;
  }

  // Increment count
  localStorage.setItem(
    "ai_usage",
    JSON.stringify({ count: usage.count + 1, timestamp: usage.timestamp })
  );
  return true;
};

const getRemainingRequests = (): number => {
  const usage = getAIUsage();
  const now = Date.now();

  if (now - usage.timestamp > AI_RATE_LIMIT.timeWindow) {
    return AI_RATE_LIMIT.maxRequests;
  }

  return Math.max(0, AI_RATE_LIMIT.maxRequests - usage.count);
};

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

// ============ NEW: AI Response Component with Typewriter ============
const AIResponse: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20); // Fast typewriter speed

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="ai-response">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-green-400 font-mono text-sm">AI Assistant:</span>
      </div>
      <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {currentIndex < text.length && (
          <span className="animate-pulse text-green-400">|</span>
        )}
      </div>
    </div>
  );
};

// ============ NEW: Loading Indicator ============
const AILoading: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
      <span>AI thinking</span>
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

const Prompt: React.FC<PromptProps & { cwd?: string }> = ({ user, host, cwd = "~" }) => (
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
);

const OutputLine: React.FC<OutputLineProps> = ({ children }) => (
  <div className="output-line">{children}</div>
);

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
  { type: "command", command: "cat <file>", description: "Print file contents (e.g. cat README)." },
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
  { type: "command", command: "ai <question>", description: "Chat with AI assistant (10 requests/day)." },
  { type: "command", command: "clear", description: "Clear the terminal screen." },
  { type: "command", command: "refresh", description: "Reload the page." },
  { type: "command", command: "exit", description: "Close this tab/window." },
];

const WELCOME_LINES: string[] = [
  "Hi, I'm Anup Pradhan, a Software Developer.",
  "Welcome to my interactive portfolio terminal!",
  "Type 'help' or 'ls' for commands. Use 'cd <name>' to open sections (e.g. cd about, cd projects).",
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
  "refresh",
  "exit",
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
  "refresh",
  "exit",
  "ai",
  "neofetch",
  "fortune",
  "cowsay",
  "banner",
  "yes",
];

const CD_SECTIONS = ["welcome", "about", "projects", "skills", "experience", "contact"];

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
  input: string
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

export default function Terminal({ onFirstCommand }: TerminalProps) {
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState<string>("");
  const [cwd, setCwd] = useState<string>("~");
  const [tabSuggestions, setTabSuggestions] = useState<string[] | null>(null);
  const [isFirstUserCommand, setIsFirstUserCommand] = useState<boolean>(true);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const savedInputRef = useRef<string>("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = "anup";
  const host = "ruki";

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

    const remaining = getRemainingRequests();
    if (remaining <= 0) {
      setHistory([
        ...historyWithPrompt,
        {
          type: "output",
          content: "Daily AI request limit reached (10/day). Try again tomorrow!",
        },
      ]);
      return;
    }

    setIsAILoading(true);
    setHistory([
      ...historyWithPrompt,
      { type: "output", content: <AILoading /> },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedQuestion }),
      });

      const data = await response.json();
      setIsAILoading(false);

      setHistory((prev) => {
        const withoutLoading = prev.slice(0, -1);
        if (data.success) {
          incrementAIUsage();
          const newRemaining = getRemainingRequests();
          return [
            ...withoutLoading,
            { type: "output", content: <AIResponse text={data.response} /> },
            {
              type: "output",
              content: `\n Remaining AI requests today: ${newRemaining}/10`,
            },
          ];
        }
        return [
          ...withoutLoading,
          { type: "output", content: `AI Error: ${data.error}` },
        ];
      });
    } catch {
      setIsAILoading(false);
      setHistory((prev) => [
        ...prev.slice(0, -1),
        {
          type: "output",
          content: "Failed to connect to AI. Please try again.",
        },
      ]);
    }
  };

  const processCommand = async (
    cmd: string,
    isAuto: boolean = false
  ): Promise<void> => {
    const newHist: HistoryLine[] = [
      ...history,
      { type: "prompt", command: cmd },
    ];

    if (isFirstUserCommand && !isAuto && onFirstCommand) {
      onFirstCommand();
      setIsFirstUserCommand(false);
    }

    const trimmedCmd = cmd.trim();

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

    // pwd
    if (commandName === "pwd") {
      newHist.push({ type: "output", content: cwd === "~" ? PWD_DISPLAY : cwd });
      setHistory(newHist);
      return;
    }

    // ls [ -l | -a | -la ]
    if (commandName === "ls") {
      const long = args.includes("-l") || args.includes("-la");
      const list = [...HOME_DIR];
      const out = long ? formatLsLong(list) : list.join("  ");
      newHist.push({ type: "output", content: <pre className="pre-output">{out}</pre> });
      setHistory(newHist);
      return;
    }

    // cat <file>
    if (commandName === "cat") {
      const name = args[0];
      if (!name) {
        newHist.push({ type: "output", content: "cat: missing operand" });
        setHistory(newHist);
        return;
      }
      const key = HOME_DIR.find((e) => e.toLowerCase() === name.toLowerCase());
      if (key && FILE_CONTENTS[key]) {
        newHist.push({ type: "output", content: FILE_CONTENTS[key] });
      } else {
        newHist.push({
          type: "output",
          content: (
            <span className="terminal-stderr">
              cat: {name}: No such file or directory
            </span>
          ),
        });
      }
      setHistory(newHist);
      return;
    }

    // cd [dir]
    if (commandName === "cd") {
      if (args.length === 0) {
        setCwd("~");
        newHist.push({ type: "output", content: "" });
        setHistory(newHist);
        return;
      }
      const dir = args[0].toLowerCase();
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

    // hostname, id, uname, cal, history, printf, man
    if (commandName === "hostname") {
      newHist.push({ type: "output", content: host });
      setHistory(newHist);
      return;
    }
    if (commandName === "id") {
      newHist.push({
        type: "output",
        content: `uid=1000(${user}) gid=1000(${user}) groups=1000(${user})`,
      });
      setHistory(newHist);
      return;
    }
    if (commandName === "uname") {
      const all = args.includes("-a");
      newHist.push({
        type: "output",
        content: all
          ? `Linux ${host} 6.x portfolio-terminal #1 Next.js`
          : "Linux",
      });
      setHistory(newHist);
      return;
    }
    if (commandName === "cal") {
      newHist.push({ type: "output", content: <pre className="pre-output">{getCalOutput()}</pre> });
      setHistory(newHist);
      return;
    }
    if (commandName === "history") {
      const list = commandHistory
        .map((c, i) => `  ${i + 1}  ${c}`)
        .join("\n");
      newHist.push({ type: "output", content: <pre className="pre-output">{list || " (empty)"}</pre> });
      setHistory(newHist);
      return;
    }
    if (commandName === "printf") {
      const format = args[0] ?? "";
      const out = printfFormat(format, args.slice(1));
      newHist.push({ type: "output", content: out });
      setHistory(newHist);
      return;
    }
    if (commandName === "man") {
      const topic = args[0]?.toLowerCase();
      const page = topic ? MAN_PAGES[topic] : null;
      if (page) {
        newHist.push({ type: "output", content: page });
      } else {
        newHist.push({
          type: "output",
          content: (
            <span className="terminal-stderr">
              No manual entry for {topic ?? ""}
            </span>
          ),
        });
      }
      setHistory(newHist);
      return;
    }

    // neofetch, fortune, cowsay, banner, yes
    if (commandName === "neofetch") {
      newHist.push({ type: "output", content: <Neofetch user={user} host={host} /> });
      setHistory(newHist);
      return;
    }
    if (commandName === "fortune") {
      newHist.push({ type: "output", content: getFortune() });
      setHistory(newHist);
      return;
    }
    if (commandName === "cowsay") {
      const msg = args.length ? args.join(" ") : "moo";
      newHist.push({ type: "output", content: <pre className="pre-output">{getCowsay(msg)}</pre> });
      setHistory(newHist);
      return;
    }
    if (commandName === "banner") {
      const text = args.length ? args.join(" ") : " ";
      newHist.push({ type: "output", content: <pre className="pre-output">{getBanner(text)}</pre> });
      setHistory(newHist);
      return;
    }
    if (commandName === "yes") {
      const word = args.length ? args.join(" ") : "y";
      const repeated = Array(8)
        .fill(word)
        .join("\n");
      newHist.push({ type: "output", content: repeated });
      setHistory(newHist);
      return;
    }

    // help, whoami, date, clear, refresh, exit
    if (commandName === "help") {
      newHist.push({ type: "output", content: <Help /> });
      setHistory(newHist);
      return;
    }
    if (commandName === "whoami") {
      newHist.push({ type: "output", content: user });
      setHistory(newHist);
      return;
    }
    if (commandName === "date") {
      newHist.push({ type: "output", content: new Date().toString() });
      setHistory(newHist);
      return;
    }
    if (commandName === "clear") {
      setHistory([]);
      return;
    }
    if (commandName === "refresh") {
      window.location.reload();
      return;
    }
    if (commandName === "exit") {
      newHist.push({ type: "output", content: "Close this tab to exit." });
      setHistory(newHist);
      return;
    }

    // command not found
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
    // Nav sections use cd <name> like a real terminal
    const cdSections = ["about", "projects", "skills", "experience", "contact"];
    const commandToRun = cdSections.includes(cmd) ? `cd ${cmd}` : cmd;
    await processCommand(commandToRun);
  };

  const focusInput = (): void => {
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
      const { matches, setLine, isPartial } = getTabCompletion(input);
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
    // Defer to avoid synchronous setState in effect
    setTimeout(() => {
      processCommand("cd welcome", true);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [history]);

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
            "refresh",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleNav(cmd)}
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
