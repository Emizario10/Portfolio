# Changelog
## 2026-03-30
### Added
- New `app/components/ThreatMap.tsx` module with terminal/hacker visual language.
- New `app/data/threatmap-data.ts` data layer for:
  - Global source nodes and Göttingen defense node
  - Fake threat generation (IP, country, protocol, severity, timestamp)
  - Severity color mapping and coordinate projection helpers
- New terminal command: `threatmap`.

### Changed
- Updated `app/page.tsx` to integrate Threat Map as a terminal mode, aligned with existing `monitor` behavior.
- Updated terminal command help/autocomplete to include `threatmap`.
- Updated language command schema in `app/data/translations.ts` with `commands.threatmap`.
- Added dedicated Threat Map styles in `app/globals.css`:
  - Neon telemetry cards
  - Severity state styling
  - Scanline effect and responsive layout adjustments

### GSAP integration
- Added GSAP-driven attack path animation between source nodes and defense node.
- Added GSAP pulse/scanline effects for subtle terminal-like motion.
- Added lifecycle-safe animation setup and cleanup patterns for React usage.

### UX / A11y
- Added keyboard exit support (`Esc` / `Ctrl+C`) for Threat Map mode.
- Added semantic region labeling and live telemetry updates for recent events.
## 2026-03-30 - FASE 1 (Proyectos)
### Added
- New `app/data/projects.ts` as the source of truth for real portfolio projects (`Portfolio`, `luxus-vibe`) with typed metadata:
  - `repoUrl`, `demoUrl`, `tech[]`, `date`, and localized content map (`es/en/de`)
- New `app/components/Projects.tsx` with professional terminal-style project cards.

### Changed
- Replaced inline projects rendering in `app/page.tsx` with reusable `Projects` component.
- Hardened terminal command handling so `projects` works as an alias in all languages (`es/en/de`) while preserving localized commands.
- Extended command autocomplete to include `projects` globally.
- Added dedicated project card styles and interaction states in `app/globals.css`.

### GSAP (Projects)
- Added GSAP staggered card entrance animation (`fade-in + slide-up`).
- Added GSAP hover lift/glow interactions for project cards.
- Added subtle GSAP pulse glow on AI badge elements.
## 2026-03-30 - FASE 2 (Visual polish + microinteractions GSAP)
### Changed
- Refined global visual consistency in `app/globals.css`:
  - Added ambient cyber glow layer for cleaner depth perception.
  - Added `section-shell-title` styling for consistent section headers.
  - Added improved focus-visible states for interactive controls and links.
- Improved terminal/hero visual coherence:
  - Added `hero-role-line` emphasis styling.
  - Added `hacker-surface` root visual layer.

### GSAP (UI microinteractions)
- Added scoped Home-level GSAP interactions in `app/page.tsx`:
  - Hover lift + glow for controls and key action links.
  - Press feedback (scale down/up) for buttons/interactive controls.
  - Subtle animated glow pulse for section titles and hero role line.
  - Gentle terminal shell breathing glow for a premium hacker feel.

### Accessibility
- Added explicit language switch `aria-label` values.
- Preserved keyboard focus clarity with neon focus-visible outlines.
