"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/public/css/TerminalComp.css";

import About from "./TerminalComp/About";
import Projects from "./TerminalComp/Projects";
import Skills from "./TerminalComp/Skills";
import Contact from "./TerminalComp/Contact";
import Experience from "./TerminalComp/Experience";

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

const Prompt: React.FC<PromptProps> = ({ user, host }) => (
  <span
    className="terminal-prompt"
    aria-label={`Command prompt for ${user} at ${host}`}
  >
    <span className="prompt-user">
      {user}@{host}
    </span>
    <span className="prompt-separator">:</span>
    <span className="prompt-directory">~</span>
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
  { type: "command", command: "ls", description: "List available commands (same as help)." },
  { type: "command", command: "cd <name>", description: "Open a section (e.g. cd about, cd projects)." },
  { type: "command", command: "cd welcome", description: "Display the welcome message." },
  { type: "command", command: "cd about", description: "Learn more about me." },
  { type: "command", command: "cd projects", description: "View my recent projects." },
  { type: "command", command: "cd skills", description: "See my technical skills." },
  { type: "command", command: "cd experience", description: "View my professional experience." },
  { type: "command", command: "cd contact", description: "Get my contact information." },
  { type: "command", command: "ai <question>", description: "Chat with AI assistant (10 requests/day)." },
  { type: "command", command: "clear", description: "Clear the terminal screen." },
  { type: "command", command: "refresh", description: "Reload the page." },
];

const WELCOME_LINES: string[] = [
  "Hi, I'm Anup Pradhan, a Software Developer.",
  "Welcome to my interactive portfolio terminal!",
  "Type 'help' or 'ls' for commands. Use 'cd <name>' to open sections (e.g. cd about, cd projects).",
  "✨ NEW: Try 'ai <your question>' to chat with AI assistant!",
];

// Tab completion: commands that can be completed when user presses Tab
const TAB_COMPLETIONS: string[] = [
  "cd welcome",
  "cd about",
  "cd projects",
  "cd skills",
  "cd experience",
  "cd contact",
  "help",
  "ls",
  "clear",
  "refresh",
];

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

export default function Terminal({ onFirstCommand }: TerminalProps) {
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState<string>("");
  const [isFirstUserCommand, setIsFirstUserCommand] = useState<boolean>(true);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
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

    switch (trimmedCmd.toLowerCase()) {
      case "help":
      case "ls":
        newHist.push({ type: "output", content: <Help /> });
        break;
      case "cd welcome":
        newHist.push({ type: "output", content: <Welcome /> });
        break;
      case "cd about":
        newHist.push({ type: "output", content: <About /> });
        break;
      case "cd projects":
        newHist.push({ type: "output", content: <Projects /> });
        break;
      case "cd skills":
        newHist.push({ type: "output", content: <Skills /> });
        break;
      case "cd experience":
        newHist.push({ type: "output", content: <Experience /> });
        break;
      case "cd contact":
        newHist.push({ type: "output", content: <Contact /> });
        break;
      case "clear":
        setHistory([]);
        return;
      case "refresh":
        window.location.reload();
        return;
      default:
        newHist.push({
          type: "output",
          content: `Command not found: ${cmd}. Type 'help' or 'ls' for commands. Use 'cd <name>' to open sections (e.g. cd about, cd projects).`,
        });
        break;
    }
    setHistory(newHist);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isAILoading) return;
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
    if (e.key !== "Tab") return;
    e.preventDefault();
    const raw = input.trim();
    const matches = TAB_COMPLETIONS.filter((cmd) => cmd.startsWith(raw));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      const prefix = getCommonPrefix(matches);
      if (prefix.length > raw.length) {
        setInput(prefix);
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
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
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
                <Prompt user={user} host={host} />
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
          <Prompt user={user} host={host} />
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
              onChange={(e) => setInput(e.target.value)}
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
      </main>
    </div>
  );
}
