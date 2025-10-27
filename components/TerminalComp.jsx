
import React, { useState, useEffect, useRef } from "react";
import "@/public/css/TerminalComp.css";

import About from "./TerminalComp/About";
import Projects from "./TerminalComp/Projects";
import Skills from "./TerminalComp/Skills";
import Contact from "./TerminalComp/Contact";

const Prompt = ({ user, host }) => (
  <span>
    <span className="prompt-user">
      {user}@{host}
    </span>
    <span className="prompt-separator">:</span>
    <span className="prompt-directory">~</span>
    <span className="prompt-symbol">$ </span>
  </span>
);

const OutputLine = ({ children }) => (
  <div className="output-line">{children}</div>
);

const Help = () => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const helpItems = [
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
    <div className="help-command">
      {displayedItems.map((item, i) =>
        item.type === "title" ? (
          <p key={i}>{item.text}</p>
        ) : (
          <ul key={i}>
            <li>
              <span>{item.command}</span> – {item.description}
            </li>
          </ul>
        )
      )}
      {currentStep < helpItems.length && <span className="cursor">|</span>}
    </div>
  );
};

const Welcome = () => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);

  const welcomeLines = [
    "Hi, I'm Anup Pradhan (Mors), a Full-Stack Developer.",
    "Welcome to my interactive portfolio terminal!",
    "Type 'help' or 'ls' to see available commands.",
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
    <>
      {displayedLines.map((line, i) => (
        <OutputLine key={i}>{line}</OutputLine>
      ))}
      {currentLine < welcomeLines.length && <span className="cursor">|</span>}
    </>
  );
};

export default function Terminal({ onFirstCommand }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isFirstUserCommand, setIsFirstUserCommand] = useState(true);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const user = "mors";
  const host = "ruki";

  const processCommand = (cmd, isAuto = false) => {
    const newHist = [...history, { type: "prompt", command: cmd }];
    if (isFirstUserCommand && !isAuto && onFirstCommand) {
      onFirstCommand();
      setIsFirstUserCommand(false);
    }
    switch (cmd.trim().toLowerCase()) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    processCommand(input);
    setInput("");
  };

  const handleNav = (cmd) => processCommand(cmd);

  const focusInput = () => {
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
    <div className="terminal-container" onClick={focusInput}>
      <header className="terminal-header">
        <div className="window-dots">
          <div className="dot dot-red"></div>
          <div className="dot dot-yellow"></div>
          <div className="dot dot-green"></div>
        </div>
        <nav className="terminal-nav">
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
            >
              {cmd}
            </button>
          ))}
        </nav>
      </header>
      <main ref={terminalRef} className="terminal-body">
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
          <Prompt user={user} host={host} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="terminal-input"
            onFocus={focusInput}
          />
        </form>
      </main>
    </div>
  );
}
