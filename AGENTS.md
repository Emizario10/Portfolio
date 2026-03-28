# AGENTS.md - System Architect Directives

**Project Identity:** "Lasso Cyber-Security Operations Center (CSOC) Portfolio"
**Architecture:** Next.js 14+ (App Router) | Tailwind CSS 4 | Framer Motion | i18n
**Vision:** A high-end engineering showcase blending a "Premium Luxus" GUI with a "Hardcore Kali-Linux" TTY.

---

## 🏗️ Technical Core Hierarchy

### 1. File Structure & Source of Truth
- **app/page.tsx**: The Central Processing Unit. Manages state for `viewMode`, `language`, and `unlockedSections`.
- **app/data/translations.ts**: The exclusive source of truth. **STRICT RULE:** Never hardcode strings in components. If it's not in the translation file, it doesn't exist.
- **app/data/ascii.ts**: High-density visual assets. Houses all ASCII arrays to prevent memory heap errors.
- **app/globals.css**: The physics engine. Defines the grid background, CRT scanlines, and ASCII rendering rules.

### 2. State Machine Logic
- **GUI Mode (classic)**: Visual excellence. Triggers `setUnlockedSections(ALL_SECTIONS)` immediately.
- **TTY Mode (terminal)**: Interactive security simulation. Sections start locked. Only explicit commands (`skills`, `projects`, etc.) can push to the `unlockedSections` array.
- **CTF State**: Managed via `ctfClicks` and hidden commands (`tucan`, `leo`). Triggering the Matrix is a one-way system override.

---

## 🛡️ Critical Engineering Rules (FOR ALL AGENTS)

### Rule #1: The "No Mutilation" Protocol
You are **STRICTLY PROHIBITED** from using `// ...` or any placeholders when providing code for `page.tsx`. Every response must contain the **entire, executable file content**. Failure to do so breaks the system architecture.

### Rule #2: ASCII Integrity Pattern
The class `.ascii-art` (or `.ascii-container`) is sacred.
- MUST use `line-height: 0.72` to `0.8` to prevent vertical "ribboning".
- MUST use `letter-spacing: -1px` to ensure block character density.
- MUST use strict monospace stack: `Fira Code`, `Cascadia Code`, `monospace`.

### Rule #3: TTY Interactive Complexity
Never simplify the `TerminalView`.
- Support **History Navigation** (`ArrowUp/ArrowDown`) using `newPointer`.
- Support **Autocomplete** (`Tab`) based on `translations.ts` keys.
- Commands like `stats` must remain **asynchronous**, fetching real data from GitHub API with `try/catch` error handling.
- `MonitorDashboard` (NOC mode) is a persistent state until `ESC` or `Ctrl+C` interrupt.

### Rule #4: Network Simulation & Data Integrity
- **Believable Simulation:** `ping` and `trace` must use `async/await` and `sleep()` for latency.
- **Logic:** `trace` must show logical hops (Gateway -> ISP -> Backbone -> Destination) with random variation (±2ms).
- **Resume Integrity:** When updating `translations.ts`, you **MUST** verify all nodes: Sartorius, Hospital OP, net@vision, and the "Luvi" project. Dates and roles must match the source exactly.

---

## 🎨 Visual Identity Standard
- **Colors:** Cyan (#00f3ff) for prompts, Purple (#bc13fe) for AI badges, Green (#00ff41) for root/success.
- **Backgrounds:** #0a0b10 base with `grid-bg` overlay.
- **Typography:** 'Inter' for UI, 'Fira Code' for Terminal.