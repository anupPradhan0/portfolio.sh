/**
 * Virtual filesystem and builtin command helpers for the portfolio terminal.
 * In-memory only; maps to portfolio sections and flavor content.
 */

export const HOME_DIR = [
  "about",
  "blog",
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
      "About Anup Pradhan — Software Engineer. Backend focus: RESTful APIs, MERN/TypeScript, JWT. Exploring AI/ML. Based in Bhubaneswar, India. Type 'cd about' to open the full section.",
  projects:
    "Recent projects: PipesHub, Yuviz, Dograh (open source), AutoPulse, WhatsApp Campaign Management, RukiAI, and more. Type 'cd projects' to browse with links and descriptions.",
  skills:
    "Tech: Frontend — React, Next.js, Remix, TanStack Query. Backend — Node.js, Express, FastAPI. DBs — MongoDB, RabbitMQ, Redis, PostgreSQL. Tools — Git, Docker, Kubernetes, Postman, Linux/CLI. Deployment — AWS S3, Azure, GCP, Vercel, Render, Dokploy. AI/ML — Pandas, PyTorch, TensorFlow. Type 'cd skills' to see all.",
  experience:
      "Open Source (SDE, Sep 2026–Present — PipesHub, Yuviz, Dograh), Crunchy Media Pvt Ltd (SDE-1), Prominds Digital. Type 'cd experience' for full timeline.",
  contact:
    "Get in touch: email, LinkedIn, GitHub. Type 'cd contact' for links and copy-paste.",
  blog:
    "Developer blog — MDX posts on backend, system design, WebRTC/SIP, and experiments. Type 'blog' or 'cd blog' to open /blog.",
  welcome:
    "Hi, I'm Anup Pradhan. Welcome to my portfolio terminal. Type 'help' or 'ls' for commands.",
  README:
    "Portfolio terminal — Anup Pradhan. Commands: help, ls, cd <section>, pwd, cat <file>, whoami, hostname, date, echo, clear, blog, ai <question>. Sections: about, blog, projects, skills, experience, contact.",
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
  cd: "cd [dir] — Change directory. cd with no args goes home. Sections: about, blog, projects, skills, experience, contact, welcome.",
  pwd: "pwd — Print working directory.",
  cat: "cat <file> — Print file contents. Files: about, blog, projects, skills, experience, contact, welcome, README.",
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
  blog: "blog [keyword] — Open /blog or search posts (e.g. blog Malware). Typing a post name also suggests matches.",
  exit: "exit — Close tab (flavor).",
  ai: "ai <question> — Chat with portfolio AI assistant (rate limited).",
  neofetch: "neofetch — Display system info and ASCII logo.",
  fortune: "fortune — Print a random quote.",
  cowsay: "cowsay [message] — Cow says your message.",
  banner: "banner <text> — Print text in large ASCII (short text).",
  yes: "yes [string] — Repeat string (limited output).",
  uptime: "uptime — Show how long the system has been running.",
  free: "free [ -h ] — Display amount of free and used memory.",
  df: "df [ -h ] — Report file system disk space usage.",
  ps: "ps [ aux ] — Report a snapshot of current processes.",
  top: "top — Display running processes (static snapshot).",
  env: "env — Print the environment variables.",
  printenv: "printenv — Print all environment variables.",
  groups: "groups — Print the groups the current user belongs to.",
  who: "who — Show who is logged on.",
  w: "w — Show who is logged on and what they are doing.",
  users: "users — Print the user names of users currently logged in.",
  last: "last — Show a listing of last logged in users.",
  tree: "tree — List contents of directories in a tree-like format.",
  head: "head <file> — Output the first part of a file.",
  tail: "tail <file> — Output the last part of a file.",
  grep: "grep <pattern> <file> — Print lines matching a pattern.",
  wc: "wc <file> — Print newline, word and byte counts for a file.",
  which: "which <command> — Locate a command in PATH.",
  whatis: "whatis <command> — Display one-line manual page descriptions.",
  arch: "arch — Print machine hardware architecture.",
  lsb_release: "lsb_release [ -a ] — Print distribution-specific information.",
  sudo: "sudo <command> — Execute a command as another user.",
  touch: "touch <file> — Change file timestamps / create empty file.",
  mkdir: "mkdir <dir> — Make directories.",
  rm: "rm <file> — Remove files or directories.",
  rmdir: "rmdir <dir> — Remove empty directories.",
  mv: "mv <src> <dst> — Move (rename) files.",
  cp: "cp <src> <dst> — Copy files and directories.",
  vim: "vim <file> — Vi IMproved, a programmer's text editor.",
  vi: "vi <file> — A screen-oriented text editor.",
  nano: "nano <file> — Nano's ANOther editor, a small text editor.",
  emacs: "emacs <file> — The extensible, customizable text editor.",
  apt: "apt <command> — Package manager for Debian-based systems.",
  "apt-get": "apt-get <command> — APT package handling utility.",
  pacman: "pacman <command> — Package manager for Arch Linux.",
  yum: "yum <command> — Package manager for RPM-based systems.",
  halt: "halt — Halt the machine.",
  git: "git [ status | log ] — The stupid content tracker.",
  node: "node [ -v ] — Run the Node.js runtime.",
  npm: "npm [ -v ] — The Node package manager.",
  python: "python [ --version ] — The Python interpreter.",
  python3: "python3 [ --version ] — The Python 3 interpreter.",
  sl: "sl — Steam Locomotive. For when you mistype 'ls'.",
  reboot: "reboot — Reboot the machine.",
  shutdown: "shutdown — Power off the machine.",
  poweroff: "poweroff — Power off the machine.",
};

// Version strings reported by the faux toolchain commands.
export const TOOL_VERSIONS = {
  node: "v22.11.0",
  npm: "10.9.0",
  python: "Python 3.12.7",
} as const;

/** uptime(1): current time + a fixed-but-plausible uptime and load average. */
export function getUptime(): string {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return ` ${time} up 42 days,  3:14,  1 user,  load average: 0.08, 0.03, 0.01`;
}

/** free(1): memory usage. Human-readable (-h) or in kibibytes. */
export function getFreeOutput(human: boolean): string {
  if (human) {
    return [
      "              total        used        free      shared  buff/cache   available",
      "Mem:           15Gi       4.2Gi       8.1Gi       512Mi       3.1Gi        10Gi",
      "Swap:         2.0Gi          0B       2.0Gi",
    ].join("\n");
  }
  return [
    "              total        used        free      shared  buff/cache   available",
    "Mem:        16384000     4404019     8493465      524288     3486516    10567680",
    "Swap:        2097152           0     2097152",
  ].join("\n");
}

/** df(1): disk usage of the (virtual) portfolio file system. */
export function getDfOutput(human: boolean): string {
  if (human) {
    return [
      "Filesystem      Size  Used Avail Use% Mounted on",
      "/dev/portfolio   50G   18G   29G  39% /",
      "tmpfs           2.0G     0  2.0G   0% /dev/shm",
      "/dev/skills      10G  6.5G  3.0G  68% /home/anup/skills",
    ].join("\n");
  }
  return [
    "Filesystem     1K-blocks      Used Available Use% Mounted on",
    "/dev/portfolio  52428800  18874368  30408704  39% /",
    "tmpfs            2097152         0   2097152   0% /dev/shm",
    "/dev/skills     10485760   6815744   3145728  68% /home/anup/skills",
  ].join("\n");
}

/** ps(1): a fixed snapshot of "running" processes. `aux` gives the wide form. */
export function getPsOutput(aux: boolean): string {
  if (aux) {
    return [
      "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
      "anup         1  0.0  0.1  16823  9921 ?        Ss   00:00   0:01 /sbin/init",
      "anup       420  0.3  2.1 998244 84992 ?        Sl   00:00   0:42 next-server",
      "anup       777  0.1  1.0 512000 40000 ?        S    00:00   0:07 portfolio-terminal",
      "anup      1337  0.0  0.5 128000 20000 pts/0    R+   14:23   0:00 ps aux",
    ].join("\n");
  }
  return [
    "    PID TTY          TIME CMD",
    "    420 pts/0    00:00:42 next-server",
    "    777 pts/0    00:00:07 portfolio-terminal",
    "   1337 pts/0    00:00:00 ps",
  ].join("\n");
}

/** env(1): a small set of plausible environment variables. */
export function getEnvOutput(user: string): string {
  return [
    `USER=${user}`,
    `LOGNAME=${user}`,
    `HOME=/home/${user}`,
    "SHELL=/bin/bash",
    "TERM=xterm-256color",
    `PWD=/home/${user}`,
    "LANG=en_IN.UTF-8",
    "EDITOR=vim",
    "PATH=/usr/local/bin:/usr/bin:/bin",
    "PORTFOLIO=Anup Pradhan — Software Engineer",
  ].join("\n");
}

/** who/w/users: a single active session. */
export function getWhoOutput(user: string): string {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${user}     pts/0        ${time} (:0)`;
}

/** last(1): a short, fabricated login history. */
export function getLastOutput(user: string): string {
  return [
    `${user}     pts/0        192.168.1.42     Mon 09:14    still logged in`,
    `${user}     pts/0        192.168.1.42     Sun 21:03 - 23:40  (02:37)`,
    "reboot   system boot  6.x-portfolio    Sun 20:58",
    "",
    "wtmp begins Sun 20:58",
  ].join("\n");
}

/** tree(1): a flat tree of the virtual home directory. */
export function getTreeOutput(entries: readonly string[]): string {
  const lines = [".", ...entries.map((e, i) =>
    (i === entries.length - 1 ? "└── " : "├── ") + e
  )];
  lines.push("", `0 directories, ${entries.length} files`);
  return lines.join("\n");
}

/** grep(1) over a virtual file's contents (or the directory listing). */
export function grepFile(
  pattern: string,
  fileKey: string | undefined,
  files: Record<string, string>,
  entries: readonly string[]
): string {
  const haystack = fileKey && files[fileKey] !== undefined
    ? files[fileKey].split(/(?<=[.!?])\s+/)
    : [...entries];
  const needle = pattern.toLowerCase();
  const matches = haystack.filter((line) =>
    line.toLowerCase().includes(needle)
  );
  return matches.join("\n");
}

/** lsb_release -a style distribution info. */
export function getLsbRelease(): string {
  return [
    "Distributor ID: PortfolioOS",
    "Description:    Anup Pradhan Portfolio Terminal",
    "Release:        2026.05",
    "Codename:       greenscreen",
  ].join("\n");
}

/** git status, portfolio edition. */
export function getGitStatus(sub: string): string {
  if (sub === "log") {
    return [
      "commit a11ce7b (HEAD -> main, origin/main)",
      "Author: Anup Pradhan <anuppradhan929@gmail.com>",
      "Date:   Mon May 26 2026",
      "",
      "    feat: ship interactive portfolio terminal",
    ].join("\n");
  }
  return [
    "On branch main",
    "Your branch is up to date with 'origin/main'.",
    "",
    "nothing to commit, working tree clean ✨",
  ].join("\n");
}

const SL_TRAIN = `      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__`;

/** sl(1): the classic "you typed ls wrong" steam locomotive. */
export function getSlTrain(): string {
  return SL_TRAIN;
}

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
