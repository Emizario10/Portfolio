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
