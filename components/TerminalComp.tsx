"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/public/css/TerminalComp.css";

import About from "./TerminalComp/About";
import Projects from "./TerminalComp/Projects";
import Skills from "./TerminalComp/Skills";
import Contact from "./TerminalComp/Contact";

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
        <span className="text-cyan-400 font-mono text-sm">
          🤖 AI Assistant:
        </span>
      </div>
      <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {currentIndex < text.length && (
          <span className="animate-pulse text-cyan-400">|</span>
        )}
      </div>
    </div>
  );
};

// ============ NEW: Loading Indicator ============
const AILoading: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm">
      <span>🤖 AI thinking</span>
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

const Help: React.FC = () => {
  const [displayedItems, setDisplayedItems] = useState<HelpItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const helpItems: HelpItem[] = [
    { type: "title", text: "Available commands:" },
    {
      type: "command",
      command: "help",
      description: "Display this help message.",
    },
    {
      type: "command",
      command: "welcome",
      description: "Display the welcome message.",
    },
    { type: "command", command: "about", description: "Learn more about me." },
    {
      type: "command",
      command: "projects",
      description: "View my recent projects.",
    },
    {
      type: "command",
      command: "skills",
      description: "See my technical skills.",
    },
    {
      type: "command",
      command: "contact",
      description: "Get my contact information.",
    },
    {
      type: "command",
      command: "ai <question>",
      description: "Chat with AI assistant (10 requests/day).",
    },
    {
      type: "command",
      command: "clear",
      description: "Clear the terminal screen.",
    },
    { type: "command", command: "refresh", description: "Reload the page." },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < helpItems.length) {
        setDisplayedItems((prev) => [...prev, helpItems[currentStep]]);
        setCurrentStep(currentStep + 1);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="help-command" role="region" aria-label="Help menu">
      {displayedItems.map((item, i) =>
        item.type === "title" ? (
          <p key={i}>{item.text}</p>
        ) : (
          <ul key={i}>
            <li>
              <span className="command-name">{item.command}</span> –{" "}
              {item.description}
            </li>
          </ul>
        )
      )}
      {currentStep < helpItems.length && (
        <span className="cursor" aria-hidden="true">
          |
        </span>
      )}
    </div>
  );
};

const Welcome: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(0);

  const welcomeLines: string[] = [
    "Hi, I'm Anup Pradhan (Mors), a Full-Stack Developer.",
    "Welcome to my interactive portfolio terminal!",
    "Type 'help' or 'ls' to see available commands.",
    "✨ NEW: Try 'ai <your question>' to chat with AI assistant!",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < welcomeLines.length) {
        setDisplayedLines((prev) => [...prev, welcomeLines[currentLine]]);
        setCurrentLine(currentLine + 1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [currentLine]);

  return (
    <div role="region" aria-label="Welcome message">
      {displayedLines.map((line, i) => (
        <OutputLine key={i}>{line}</OutputLine>
      ))}
      {currentLine < welcomeLines.length && (
        <span className="cursor" aria-hidden="true">
          |
        </span>
      )}
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

  const user = "mors";
  const host = "ruki";

  // ============ NEW: AI Command Handler ============
  const handleAICommand = async (question: string): Promise<void> => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      const newHist = [...history];
      newHist.push({
        type: "output",
        content: "❌ Please provide a question. Usage: ai <your question>",
      });
      setHistory(newHist);
      return;
    }

    // Check rate limit
    const remaining = getRemainingRequests();
    if (remaining <= 0) {
      const newHist = [...history];
      newHist.push({
        type: "output",
        content:
          "⚠️ Daily AI request limit reached (10/day). Try again tomorrow!",
      });
      setHistory(newHist);
      return;
    }

    // Show loading
    setIsAILoading(true);
    const loadingHist = [...history];
    loadingHist.push({
      type: "output",
      content: <AILoading key={Date.now()} />,
    });
    setHistory(loadingHist);

    try {
      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedQuestion }),
      });

      const data = await response.json();

      // Remove loading indicator
      setIsAILoading(false);
      const newHist = [...history];

      if (data.success) {
        // Increment usage
        incrementAIUsage();
        const newRemaining = getRemainingRequests();

        newHist.push({
          type: "output",
          content: <AIResponse key={Date.now()} text={data.response} />,
        });
        newHist.push({
          type: "output",
          content: `\n💡 Remaining AI requests today: ${newRemaining}/10`,
        });
      } else {
        newHist.push({
          type: "output",
          content: `❌ AI Error: ${data.error}`,
        });
      }

      setHistory(newHist);
    } catch (error) {
      setIsAILoading(false);
      const newHist = [...history];
      newHist.push({
        type: "output",
        content: "❌ Failed to connect to AI. Please try again.",
      });
      setHistory(newHist);
    }
  };

  const processCommand = (cmd: string, isAuto: boolean = false): void => {
    const newHist: HistoryLine[] = [
      ...history,
      { type: "prompt", command: cmd },
    ];

    if (isFirstUserCommand && !isAuto && onFirstCommand) {
      onFirstCommand();
      setIsFirstUserCommand(false);
    }

    const trimmedCmd = cmd.trim().toLowerCase();

    // ============ NEW: Check for AI command ============
    if (trimmedCmd.startsWith("ai ")) {
      const question = cmd.substring(3); // Remove 'ai ' prefix
      setHistory(newHist);
      handleAICommand(question);
      return;
    }

    switch (trimmedCmd) {
      case "help":
      case "ls":
        newHist.push({ type: "output", content: <Help key={Date.now()} /> });
        break;
      case "welcome":
      case "cd welcome":
        newHist.push({ type: "output", content: <Welcome key={Date.now()} /> });
        break;
      case "about":
      case "cd about":
        newHist.push({ type: "output", content: <About /> });
        break;
      case "projects":
      case "cd projects":
        newHist.push({ type: "output", content: <Projects /> });
        break;
      case "skills":
      case "cd skills":
        newHist.push({ type: "output", content: <Skills /> });
        break;
      case "contact":
      case "cd contact":
        newHist.push({ type: "output", content: <Contact /> });
        break;
      case "clear":
      case "cd clear":
        setHistory([]);
        return;
      case "refresh":
      case "cd refresh":
        window.location.reload();
        return;
      default:
        newHist.push({
          type: "output",
          content: `Command not found: ${cmd}. Type 'help' or 'ls' for a list of commands.`,
        });
        break;
    }
    setHistory(newHist);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isAILoading) return; // Prevent new commands while AI is loading
    processCommand(input);
    setInput("");
  };

  const handleNav = (cmd: string): void => processCommand(cmd);

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

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      inputRef.current?.focus();
    }
    processCommand("welcome", true);
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
            "welcome",
            "help",
            "about",
            "projects",
            "skills",
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
          <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="terminal-input"
            onFocus={focusInput}
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal command input"
            disabled={isAILoading}
          />
        </form>
      </main>
    </div>
  );
}
