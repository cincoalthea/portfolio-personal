/* =========================================================
   CONFIG — edit these to personalize your site
========================================================= */
const GITHUB_USERNAME = "cincoalthea";
const REPOS_TO_SHOW = 3;

const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const PAGE_LOAD_TIME = Date.now();

/* =========================================================
   HIDDEN CONSOLE MESSAGE — a small wink for anyone (recruiter,
   fellow dev) who opens dev tools out of curiosity.
========================================================= */
console.log(
  "%cHey, nice — you opened the console. 👋",
  "font-family: monospace; font-size: 14px; color: #f0b75e; font-weight: bold;"
);
console.log(
  "%cThis whole site is hand-built with HTML, CSS & vanilla JS — no frameworks. Feel free to poke around the source.",
  "font-family: monospace; font-size: 12px; color: #9aa3b2;"
);

/* =========================================================
   THEME TOGGLE (dark mode) — persists via localStorage
========================================================= */
(function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (stored) {
    root.setAttribute("data-theme", stored);
  } else if (systemPrefersDark) {
    root.setAttribute("data-theme", "dark");
  }

  const toggleBtn = document.getElementById("themeToggle");
  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      // localStorage can fail in some sandboxed/private-browsing contexts —
      // the toggle still works for the current visit, it just won't persist.
      console.warn("Couldn't save theme preference:", err);
    }
  });
})();

/* =========================================================
   TYPEWRITER — cycles the hero role through a few phrases
========================================================= */
(function initTypewriter() {
  const el = document.getElementById("roleText");
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phrases = [
    "Aspiring Web Developer",
    "React & Next.js Enthusiast",
    "Full-Stack Tinkerer",
    "PHP & MySQL Backend Builder",
    "Always Learning Something New",
  ];

  if (reduceMotion) {
    el.textContent = phrases[0];
    return;
  }

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_AFTER_DELETE = 300;

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  el.textContent = phrases[0];

  function tick() {
    const current = phrases[phraseIndex];
    const deleting = tick.deleting;

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        tick.deleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        tick.deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick.deleting = true;
  setTimeout(tick, PAUSE_AFTER_TYPE);
})();

/* =========================================================
   MOBILE MENU
========================================================= */
(function initMobileMenu() {
  const menuBtn = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
})();

/* =========================================================
   COMMAND PALETTE — ⌘K / Ctrl+K quick nav & actions
========================================================= */
(function initCommandPalette() {
  const toggleBtn = document.getElementById("paletteToggle");
  const overlay = document.getElementById("paletteOverlay");
  const input = document.getElementById("paletteInput");
  const list = document.getElementById("paletteList");
  if (!overlay || !input || !list) return;

  let activeIndex = 0;
  let filtered = [];
  let lastFocused = null;

  function getCommands() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    return [
      { group: "Go to", label: "Home", keywords: "home top hero", run: () => scrollToId("home") },
      { group: "Go to", label: "Terminal", keywords: "terminal shell console cli", run: () => scrollToId("terminal") },
      { group: "Go to", label: "Projects", keywords: "projects work portfolio", run: () => scrollToId("projects") },
      { group: "Go to", label: "GitHub activity", keywords: "github repos", run: () => scrollToId("github") },
      { group: "Go to", label: "Contact", keywords: "contact email message form", run: () => scrollToId("contact") },
      {
        group: "Action",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        keywords: "theme dark light mode toggle",
        run: () => document.getElementById("themeToggle").click(),
      },
      {
        group: "Action",
        label: "Open GitHub profile",
        keywords: "github profile open external",
        run: () => window.open(GITHUB_PROFILE_URL, "_blank", "noopener"),
      },
      {
        group: "Action",
        label: "Copy email address",
        keywords: "email contact copy clipboard",
        run: () => copyEmail(),
      },
      {
        group: "Action",
        label: "Download CV",
        keywords: "resume cv download pdf curriculum vitae",
        run: () => {
          const link = document.createElement("a");
          link.href = "assets/CINCO-Curriculum-Vitae.pdf";
          link.download = "";
          link.click();
        },
      },
      {
        group: "Action",
        label: "Focus terminal input",
        keywords: "terminal type command shell",
        run: () => {
          scrollToId("terminal");
          setTimeout(() => document.getElementById("terminalInput")?.focus(), 250);
        },
      },
    ];
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function copyEmail() {
    const email = "cincoaltheamariel@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
  }

  function matches(cmd, query) {
    if (!query) return true;
    const haystack = `${cmd.label} ${cmd.keywords}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function render() {
    const query = input.value.trim();
    filtered = getCommands().filter((cmd) => matches(cmd, query));
    activeIndex = 0;
    list.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("li");
      empty.className = "command-palette-empty";
      empty.textContent = `No commands match "${query}".`;
      list.appendChild(empty);
      return;
    }

    filtered.forEach((cmd, i) => {
      const item = document.createElement("li");
      item.className = "command-palette-item" + (i === activeIndex ? " active" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(i === activeIndex));
      item.innerHTML = `
        <span class="command-palette-item-label">
          <span class="command-palette-item-group">${cmd.group}</span>
          <span>${cmd.label}</span>
        </span>`;
      item.addEventListener("mouseenter", () => setActive(i));
      item.addEventListener("click", () => runActive());
      list.appendChild(item);
    });
  }

  function setActive(i) {
    activeIndex = i;
    [...list.children].forEach((el, idx) => {
      el.classList.toggle("active", idx === activeIndex);
      el.setAttribute("aria-selected", String(idx === activeIndex));
    });
  }

  function runActive() {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    close();
    cmd.run();
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    input.value = "";
    render();
    input.focus();
  }

  function close() {
    overlay.hidden = true;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function isOpen() {
    return !overlay.hidden;
  }

  toggleBtn?.addEventListener("click", () => (isOpen() ? close() : open()));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  input.addEventListener("input", render);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length) setActive((activeIndex + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length) setActive((activeIndex - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    }
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && key === "k") {
      e.preventDefault();
      isOpen() ? close() : open();
    } else if (key === "escape" && isOpen()) {
      close();
    }
  });

  // Exposed so the terminal's `palette` command can trigger the same UI.
  window.openCommandPalette = open;
})();

/* =========================================================
   SCROLL REVEAL — fades sections in as they enter view
========================================================= */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
})();

/* =========================================================
   INTERACTIVE TERMINAL — a real, tiny shell for visitors to try
========================================================= */
(function initTerminal() {
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  const body = document.getElementById("terminalBody");
  if (!input || !output || !body) return;

  const commandHistory = [];
  let historyIndex = 0;

  // Clicking anywhere in the terminal (that isn't a text selection) focuses the input,
  // like a real terminal window.
  body.addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection || selection.toString() === "") input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const raw = input.value;
      if (raw.trim() === "") return;

      printEcho(raw);
      commandHistory.push(raw);
      historyIndex = commandHistory.length;

      renderResult(runCommand(raw));
      input.value = "";
      output.scrollTop = output.scrollHeight;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = commandHistory[historyIndex] || "";
      moveCursorToEnd();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input.value = commandHistory[historyIndex] || "";
      moveCursorToEnd();
    }
  });

  function moveCursorToEnd() {
    const len = input.value.length;
    requestAnimationFrame(() => input.setSelectionRange(len, len));
  }

  function printEcho(text) {
    const p = document.createElement("p");
    p.className = "term-echo";
    p.textContent = text;
    output.appendChild(p);
  }

  function printLine(text, className) {
    const p = document.createElement("p");
    if (className) p.className = className;
    p.textContent = text;
    output.appendChild(p);
  }

  function renderResult(result) {
    if (!result) return;
    if (result.type === "clear") {
      output.innerHTML = "";
      return;
    }
    if (result.type === "html") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = result.html;
      output.appendChild(wrapper);
      return;
    }
    if (result.type === "error") {
      printLine(result.text, "term-error");
      return;
    }
    if (result.text) printLine(result.text);
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function listProjectTitles() {
    const titles = Array.from(document.querySelectorAll(".project-card h3")).map((h) => h.textContent);
    if (titles.length === 0) return "<p>No projects found.</p>";
    return `<p>${titles.join("<br>")}</p>`;
  }

  function helpHtml() {
    const rows = [
      ["help", "show this list"],
      ["whoami", "a quick intro"],
      ["skills", "list the tech I work with"],
      ["neofetch", "system info, portfolio-style"],
      ["social", "list ways to reach me"],
      ["ls", "list sections of this site"],
      ["ls projects", "list project titles"],
      ["cd &lt;section&gt;", "jump to home, terminal, projects, github, or contact"],
      ["github", "open my GitHub profile"],
      ["cv", "download my CV"],
      ["theme &lt;light|dark&gt;", "switch the site theme"],
      ["palette", "open the ⌘K command palette"],
      ["joke", "hear a (questionable) programming joke"],
      ["history", "show commands you've run this session"],
      ["date", "show the current date and time"],
      ["echo &lt;text&gt;", "repeat text back"],
      ["clear", "clear the terminal"],
    ];
    return `<p>${rows.map(([cmd, desc]) => `<span class="term-cmd">${cmd}</span> — ${desc}`).join("<br>")}</p>`;
  }

  function skillsHtml() {
    const tags = Array.from(document.querySelectorAll(".tag")).map((t) => t.textContent.trim());
    const unique = [...new Set(tags)];
    if (unique.length === 0) return "<p>No skills tagged yet.</p>";
    return `<p>${unique.map((t) => `<span class="term-cmd">${t}</span>`).join(" ")}</p>`;
  }

  function neofetchHtml() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const uptimeMs = Date.now() - PAGE_LOAD_TIME;
    const uptimeSec = Math.floor(uptimeMs / 1000);
    const mins = Math.floor(uptimeSec / 60);
    const secs = uptimeSec % 60;
    const art = [
      "  ┌───────────┐",
      "  │ &lt;/&gt;      │",
      "  │           │",
      "  └───────────┘",
    ];
    const info = [
      "visitor@portfolio",
      "─────────────────",
      "OS: PortfolioOS (static site)",
      "Shell: vanilla-js v1.0",
      "Stack: HTML, CSS, JavaScript",
      `Theme: ${theme}`,
      `Uptime: ${mins}m ${secs}s`,
    ];
    const lineCount = Math.max(art.length, info.length);
    const rows = Array.from({ length: lineCount }, (_, i) => {
      const artLine = art[i] || "".padEnd(17);
      return `${artLine}    ${info[i] || ""}`;
    }).join("<br>");
    return `<p>${rows}</p>`;
  }

  function socialHtml() {
    const links = Array.from(document.querySelectorAll(".social-links a")).map((a) => {
      const label = a.getAttribute("aria-label") || a.href;
      return `<span class="term-cmd">${label}</span>: <a href="${a.href}" target="_blank" rel="noopener">${a.href}</a>`;
    });
    return `<p class="term-link">${links.join("<br>")}</p>`;
  }

  const JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "There are 10 types of people: those who understand binary, and those who don't.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "!false — it's funny because it's true.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "I'd tell you a UDP joke, but you might not get it.",
  ];

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function historyHtml() {
    if (commandHistory.length === 0) return "<p>No commands run yet this session.</p>";
    return `<p>${commandHistory.map((c, i) => `${i + 1}  ${escapeHtml(c)}`).join("<br>")}</p>`;
  }

  function runCommand(raw) {
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();

    if (lower === "sudo make me a sandwich") {
      return { type: "text", text: "🥪 Nice try — I don't have root access to your kitchen." };
    }
    if (lower === "exit" || lower === "quit") {
      return { type: "text", text: "There's no escape from a static website. 👋" };
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        return { type: "html", html: helpHtml() };

      case "whoami":
      case "about":
        return {
          type: "text",
          text:
            "Hi, I'm Althea Mariel Cinco — an aspiring web developer who likes turning ideas into clean, working interfaces. Currently looking for an internship to grow my skills. Try 'skills' or 'neofetch' for more.",
        };

      case "skills":
        return { type: "html", html: skillsHtml() };

      case "neofetch":
      case "banner":
        return { type: "html", html: neofetchHtml() };

      case "social":
        return { type: "html", html: socialHtml() };

      case "joke":
        return { type: "text", text: JOKES[Math.floor(Math.random() * JOKES.length)] };

      case "history":
        return { type: "html", html: historyHtml() };

      case "palette":
        if (typeof window.openCommandPalette === "function") {
          window.openCommandPalette();
          return { type: "text", text: "Opening command palette…" };
        }
        return { type: "error", text: "Command palette isn't available." };

      case "ls":
        if (args[0] === "projects") return { type: "html", html: listProjectTitles() };
        return { type: "text", text: "home  terminal  projects  github  contact" };

      case "cd": {
        const valid = ["home", "terminal", "projects", "github", "contact"];
        const target = (args[0] || "").toLowerCase();
        if (valid.includes(target)) {
          scrollToSection(target);
          return { type: "text", text: `Navigating to #${target}…` };
        }
        return {
          type: "error",
          text: `cd: no such section '${args[0] || ""}'. Try: ${valid.join(", ")}`,
        };
      }

      case "github":
        window.open(GITHUB_PROFILE_URL, "_blank", "noopener");
        return { type: "text", text: "Opening GitHub profile in a new tab…" };

      case "cv":
      case "resume": {
        const link = document.createElement("a");
        link.href = "assets/CINCO-Curriculum-Vitae.pdf";
        link.download = "";
        link.click();
        return { type: "text", text: "Downloading CV…" };
      }

      case "contact":
      case "email":
        scrollToSection("contact");
        return { type: "text", text: "Scrolling to the contact form…" };

      case "theme": {
        const val = (args[0] || "").toLowerCase();
        if (val === "dark" || val === "light") {
          document.documentElement.setAttribute("data-theme", val);
          try {
            localStorage.setItem("theme", val);
          } catch (err) {
            // ignore if storage is unavailable
          }
          return { type: "text", text: `Theme set to ${val}.` };
        }
        document.getElementById("themeToggle").click();
        return { type: "text", text: "Theme toggled." };
      }

      case "date":
        return { type: "text", text: new Date().toString() };

      case "echo":
        return { type: "text", text: args.join(" ") };

      case "clear":
        return { type: "clear" };

      default:
        return {
          type: "error",
          text: `command not found: ${cmd} — type 'help' to see available commands.`,
        };
    }
  }
})();

/* =========================================================
   CONTACT FORM — no backend required, just a success message
========================================================= */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in every field before sending.";
      status.className = "form-status error";
      return;
    }

    status.textContent = `Thanks, ${name}! Your message has been received. I'll get back to you soon.`;
    status.className = "form-status success";
    form.reset();
  });
})();

/* =========================================================
   GITHUB API — bonus: fetch and render your public repos
========================================================= */
(function loadGithubRepos() {
  const container = document.getElementById("githubRepos");

  fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPOS_TO_SHOW}`)
    .then((res) => {
      if (!res.ok) throw new Error("GitHub API request failed");
      return res.json();
    })
    .then((repos) => {
      if (!Array.isArray(repos) || repos.length === 0) {
        container.innerHTML = `<p class="github-status">No public repositories found yet.</p>`;
        return;
      }
      container.innerHTML = repos
        .map(
          (repo) => `
          <article class="repo-card">
            <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
            <p>${repo.description ? escapeHtml(repo.description) : "No description provided."}</p>
            <div class="repo-meta">
              <span>★ ${repo.stargazers_count}</span>
              <span>${repo.language || "—"}</span>
            </div>
          </article>`
        )
        .join("");
    })
    .catch(() => {
      container.innerHTML = `<p class="github-status">Couldn't load repositories right now — check back later.</p>`;
    });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();

/* =========================================================
   FOOTER YEAR
========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();
