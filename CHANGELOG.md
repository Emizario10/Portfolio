# Changelog
## 2026-03-31
### Added
- New CTF (Capture The Flag) mechanic with animated dots in the terminal header.
- The dots are only visible when `ctfActive` is true.
- The `handleCTFClick` function was added to handle the clicks on the dots.
- The GSAP animation for the dots was added to `Terminal.tsx`.

### Changed
- The `handleGreenButtonClick` was updated to activate the CTF.
- The terminal header was replaced with a new design.
- The CSS for the new header and dots was added to `globals.css`.

### Cleanup
- Unused CSS for the old terminal header, controls, and window title was removed from `globals.css`.
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
## 2026-03-30 - FASE 3 (Skills GSAP)
### Added
- New `app/data/skills.ts` with typed skill metrics and ES/EN/DE localized labels.
- Added `getLocalizedSkills(language)` helper for clean skills data consumption.

### Changed
- Refactored `app/components/SkillsChart.tsx` from Framer Motion to GSAP:
  - Progressive bar loading when section enters viewport.
  - Level-based glow variants (`elite`, `advanced`, `solid`, `base`).
  - Row microinteractions on hover (lift + subtle glow).
  - Improved accessibility with progressbar semantics (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`).
- Updated `app/page.tsx` to use the new GSAP SkillsChart in the Tech section.
- Added dedicated skills chart styles in `app/globals.css` including sheen animation and cleaner spacing/typography.

### Cleanup
- Removed the previous SkillsChart implementation pattern that generated lint warning noise and replaced it with a modular, typed, GSAP-first version.
## 2026-03-30 - FASE 4 (Arquitectura modular de `app/page.tsx`)
### Added
- New `app/components/layout/LanguageSelector.tsx` extracted from page-level inline layout UI.
- New `app/components/layout/StatusBar.tsx` extracted from page-level system header UI.
- New `app/components/visual/MatrixRain.tsx` extracted from page-level visual effect logic.
- New `app/components/terminal/Terminal.tsx` extracted with terminal state machine, history rendering, monitor mode and threat map mode intact.
- New section modules:
  - `app/components/sections/BoardCard.tsx`
  - `app/components/sections/ExperienceSection.tsx`
  - `app/components/sections/EducationSection.tsx`

### Changed
- Refactored `app/page.tsx` to compose extracted modules for layout, terminal, visuals and section rendering.
- Preserved existing command flow, unlock behavior, ThreatMap mode, monitor mode, matrix trigger and GSAP microinteractions.
