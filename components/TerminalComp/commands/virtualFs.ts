/**
 * Virtual filesystem and builtin command helpers for the portfolio terminal.
 * In-memory only; maps to portfolio sections and flavor content.
 */

export const HOME_DIR = [
  "about",
  "projects",
  "skills",
  "experience",
  "contact",
  "welcome",
  "README",
] as const;

export type HomeDirEntry = (typeof HOME_DIR)[number];

export const FILE_CONTENTS: Record<string, string> = {
  about:
    "About Anup Pradhan — Software Developer. Backend focus: RESTful APIs, MERN/TypeScript, JWT. Exploring AI/ML. Based in Bhubaneswar, India. Type 'cd about' to open the full section.",
  projects:
    "Recent projects: WhatsApp Campaign Management, RukiAI, Digit Recognizer, AI Madness, and more. Type 'cd projects' to browse with links and descriptions.",
  skills:
    "Tech: JavaScript, TypeScript, Python, React, Next.js, Node.js, MongoDB, Git, Docker, AI/ML basics. Type 'cd skills' to see categories.",
  experience:
    "CHATI (Software Developer Intern), Prominds Digital (Part-time). Type 'cd experience' for full timeline.",
  contact:
    "Get in touch: email, LinkedIn, GitHub. Type 'cd contact' for links and copy-paste.",
  welcome:
    "Hi, I'm Anup Pradhan. Welcome to my portfolio terminal. Type 'help' or 'ls' for commands.",
  README:
    "Portfolio terminal — Anup Pradhan. Commands: help, ls, cd <section>, pwd, cat <file>, whoami, hostname, date, echo, clear, ai <question>. Sections: about, projects, skills, experience, contact.",
};

/** Format ls -l style: permissions, fake size, date, name */
export function formatLsLong(entries: readonly string[]): string {
  const now = new Date();
  const mon = now.toLocaleString("en-US", { month: "short" });
  const day = now.getDate();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return entries
    .map((name) => `drwxr-xr-x  2 anup anup 4096 ${mon} ${day} ${time} ${name}`)
    .join("\n");
}

/** Current month calendar (7-column text) */
export function getCalOutput(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const daysInMonth = last.getDate();
  const startDay = first.getDay(); // 0 = Sunday

  const header = `${monthName} ${year}`.padStart(20).padEnd(28);
  const weekHeader = "Su Mo Tu We Th Fr Sa";

  const lines: string[] = [header, weekHeader];
  const row: number[] = new Array(42).fill(0);
  for (let d = 1; d <= daysInMonth; d++) {
    const i = startDay + d - 1;
    row[i] = d;
  }

  for (let r = 0; r < 6; r++) {
    const week = row.slice(r * 7, (r + 1) * 7);
    const weekStr = week
      .map((d) => (d === 0 ? "  " : String(d).padStart(2)))
      .join(" ");
    if (weekStr.trim()) lines.push(weekStr);
  }
  return lines.join("\n");
}

/** Simple printf: %s, %d, \n */
export function printfFormat(format: string, args: string[]): string {
  let out = "";
  let argIdx = 0;
  for (let i = 0; i < format.length; i++) {
    if (format[i] === "\\" && format[i + 1] === "n") {
      out += "\n";
      i++;
      continue;
    }
    if (format[i] === "%" && format[i + 1]) {
      const spec = format[i + 1];
      i++;
      if (spec === "s" && args[argIdx] !== undefined) {
        out += args[argIdx];
        argIdx++;
      } else if (spec === "d" && args[argIdx] !== undefined) {
        const n = parseInt(args[argIdx], 10);
        out += Number.isNaN(n) ? "0" : String(n);
        argIdx++;
      } else {
        out += "%" + spec;
      }
      continue;
    }
    out += format[i];
  }
  return out;
}

export const MAN_PAGES: Record<string, string> = {
  help: "help — Display list of available commands and short descriptions.",
  ls: "ls [ -l | -a | -la ] — List directory contents. -l long format, -a include hidden.",
  cd: "cd [dir] — Change directory. cd with no args goes home. Sections: about, projects, skills, experience, contact, welcome.",
  pwd: "pwd — Print working directory.",
  cat: "cat <file> — Print file contents. Files: about, projects, skills, experience, contact, welcome, README.",
  whoami: "whoami — Print current username.",
  hostname: "hostname — Print system hostname.",
  id: "id — Print user and group IDs.",
  uname: "uname [ -a ] — Print system info. -a for all.",
  date: "date — Print current date and time.",
  echo: "echo [text] — Print arguments.",
  printf: "printf format [args] — Print formatted string. Supports %s, %d, \\n.",
  cal: "cal — Display current month calendar.",
  history: "history — List recent commands.",
  man: "man <command> — Show manual for command.",
  clear: "clear — Clear terminal screen.",
  refresh: "refresh — Reload the page.",
  exit: "exit — Close tab (flavor).",
  ai: "ai <question> — Chat with portfolio AI assistant (rate limited).",
  neofetch: "neofetch — Display system info and ASCII logo.",
  fortune: "fortune — Print a random quote.",
  cowsay: "cowsay [message] — Cow says your message.",
  banner: "banner <text> — Print text in large ASCII (short text).",
  yes: "yes [string] — Repeat string (limited output).",
};

const FORTUNES = [
  "The only way to do great work is to love what you do.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Talk is cheap. Show me the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "The best error message is the one that never shows up.",
];

export function getFortune(): string {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}

const COW = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;

export function getCowsay(message: string, maxLen: number = 40): string {
  const lines = message.slice(0, 200).split("\n").slice(0, 5);
  const max = Math.min(maxLen, Math.max(20, ...lines.map((l) => l.length)));
  const wrap = (s: string) => {
    const out: string[] = [];
    for (let i = 0; i < s.length; i += max) {
      out.push(s.slice(i, i + max));
    }
    return out;
  };
  const all: string[] = [];
  for (const line of lines) {
    all.push(...wrap(line));
  }
  const width = Math.min(max + 2, 42);
  const top = " " + "_".repeat(width);
  const bottom = " " + "-".repeat(width);
  const body = all
    .map((l) => {
      const pad = width - l.length - 2;
      return "| " + l + " ".repeat(pad >= 0 ? pad : 0) + " |";
    })
    .join("\n");
  return top + "\n" + body + "\n" + bottom + COW;
}

/** Simple 2-line ASCII banner (each char ~5 wide, limit length) */
export function getBanner(text: string, maxChars: number = 10): string {
  const t = text.slice(0, maxChars).toUpperCase().replace(/[^A-Z0-9 ]/g, "");
  if (!t) return "#\n#";
  const a: string[] = [];
  const b: string[] = [];
  for (const c of t) {
    if (c === " ") {
      a.push("   ");
      b.push("   ");
    } else {
      a.push(` ${c}  `);
      b.push(` ${c}  `);
    }
  }
  return a.join("") + "\n" + b.join("");
}

/** Data for neofetch-style output (rendered by Neofetch component for alignment). */
export function getNeofetchData(user: string, host: string) {
  return {
    user: `${user}@${host}`,
    host,
    os: "Portfolio Terminal",
    kernel: "TypeScript (Next.js)",
    uptime: "Always on",
    shell: "/bin/bash",
    theme: "Green on dark",
  };
}
