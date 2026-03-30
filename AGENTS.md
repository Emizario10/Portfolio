# AGENTS.md — System Architect Directives
# Lasso Cyber-Security Operations Center (CSOC) Portfolio

============================================================
1. PROJECT IDENTITY
============================================================

Codename: Lasso CSOC Portfolio
Concept: Fusion of a premium GUI with a hardcore Kali-Linux TTY.
Stack: Next.js 14+, Tailwind CSS 4, GSAP, Framer Motion (optional), i18n (ES/EN/DE), Canvas.

Goal: Represent a mid-senior frontend/cybersecurity engineer with mastery in animations, modular architecture, realistic simulations, and premium hacker aesthetics.

============================================================
2. ARCHITECTURAL CORE
============================================================

2.1 Source of Truth

File: app/page.tsx
Purpose: Central orchestrator. Manages viewMode, language, unlockedSections, terminal, GUI.

File: app/data/translations.ts
Purpose: Exclusive source of all text. No component may contain hardcoded strings.

File: app/data/ascii.ts
Purpose: High-density ASCII assets. Prevents memory saturation.

File: app/globals.css
Purpose: Global visual engine: grid, CRT, scanlines, ASCII density.

============================================================
3. STATE MACHINE SPECIFICATION
============================================================

3.1 GUI Mode (Classic)
- Activated via visual selector.
- Unlocks all sections immediately.
- Prioritizes visual navigation.

3.2 TTY Mode (Terminal)
- Sections start locked.
- Only valid commands unlock sections (skills, projects, experience, education, monitor, threatmap).
- Supports:
  - History navigation (ArrowUp / ArrowDown)
  - Autocomplete (Tab)
  - Async commands (stats, ping, trace)
  - Interruptions (ESC, Ctrl+C)

3.3 CTF State
- Controlled via ctfClicks and hidden commands (tucan, leo).
- Matrix mode is an irreversible override until state reset.

============================================================
4. ENGINEERING RULES (STRICT)
============================================================

Rule 1: No Mutilation Protocol
- When modifying app/page.tsx, agents must output the entire file.
- No placeholders, no omissions, no ellipses.

Rule 2: ASCII Integrity
- Classes .ascii-art and .ascii-container must follow:
  - line-height: 0.72–0.80
  - letter-spacing: -1px
  - font-family: "Fira Code", "Cascadia Code", monospace

Rule 3: Terminal Complexity Preservation
Terminal must retain:
- History navigation
- Autocomplete from translations.ts
- Async commands with real latency simulation
- Persistent MonitorDashboard
- ThreatMap as isolated mode
- MatrixRain as CTF override

Rule 4: Network Simulation Logic
Commands ping and trace must:
- Use async/await
- Include realistic latency with sleep()
- Generate logical hops: Gateway → ISP → Backbone → Destination
- Include ±2ms jitter
- Handle errors gracefully

Rule 5: Resume Integrity
When modifying translations.ts, agents must verify:
- Sartorius
- Hospital OP
- net@vision
- Luvi
- All dates, roles, and descriptions must match exactly.

============================================================
5. VISUAL IDENTITY STANDARD
============================================================

5.1 Color System
- Cyan (#00f3ff): prompts, technical highlights
- Purple (#bc13fe): AI badges, premium elements
- Green (#00ff41): root, success, hacking feedback
- Background: #0a0b10 with grid-bg overlay

5.2 Typography
- UI: Inter
- Terminal: Fira Code

5.3 Motion and Effects
- GSAP as primary animation engine
- Microinteractions: glow, lift, pulse
- Global effects: CRT, scanlines, flicker, ambient glow

============================================================
6. COMPONENT AND MODULE RULES
============================================================

6.1 Components
All components must be:
- Modular
- Fully typed
- Free of hardcoded strings
- GSAP-cleaned (ctx.revert)
- Accessible (ARIA minimum)

6.2 Animations
- Use gsap.context()
- Cleanup required
- Avoid animating non-transform properties
- Prefer presets from /lib/animations/presets.ts

============================================================
7. SECURITY SIMULATION STANDARDS
============================================================

- ThreatMap must remain performant
- MonitorDashboard must persist until interrupted
- Commands must simulate realistic network behavior
- No command may block the UI thread

============================================================
8. DEPLOYMENT RULES
============================================================

- npm run lint must pass without errors
- npm run build must compile without critical warnings
- CHANGELOG.md must be updated per phase

============================================================
9. AGENT WORKFLOW
============================================================

1. Analyze current state
2. Propose file-by-file plan
3. Wait for confirmation
4. Implement
5. Document
6. Validate
7. Deliver

============================================================
10. FINAL DIRECTIVE
============================================================

The portfolio must represent a mid-senior frontend/cybersecurity engineer with mastery in animations, modular architecture, realistic simulations, and premium hacker aesthetics.
