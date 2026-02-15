# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Build & Development Commands

```powershell
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a Next.js 16 portfolio website using the App Router with a cyberpunk/terminal aesthetic.

### Core Structure

- **`app/page.tsx`**: Main entry point containing all primary components:
  - `Home`: Root component managing language, view mode, and section unlocking state
  - `Terminal`: Interactive CLI emulator with command processing
  - `StatusBar`: Top navigation bar showing system status and view mode toggle
  - `LanguageSelector`: Floating language switcher (es/en/de)
  - `MatrixRain`: Canvas-based falling characters animation

- **`app/data/translations.ts`**: Centralized i18n data store defining:
  - `Language` type: `'es' | 'en' | 'de'`
  - `Translation` interface with all content structures
  - All portfolio content (projects, experience, education, etc.)

- **`app/data/ascii.ts`**: Dedicated file for storing large ASCII art constants, preventing `Heap out of memory` errors in `page.tsx`.

- **`app/components/`**: Reusable UI components

### Key Patterns

**View Modes**: The site has two modes (`ViewMode = 'terminal' | 'classic'`):
- Terminal mode: Sections unlock via terminal commands
- Classic mode: All sections visible immediately

**Section Unlocking**: Sections (`SectionId = 'tech' | 'projects' | 'experience' | 'education'`) are progressively revealed through terminal commands in terminal mode.

**Terminal Commands**: Each language has its own command translations in `translations[lang].terminal.commands`. Commands map to actions like unlocking sections, downloading CV, or triggering effects.

### Styling

- Tailwind CSS 4 with custom CSS variables in `app/globals.css`
- CRT/scanline effects applied via CSS pseudo-elements
- Color scheme: cyan (`#00f3ff`) accent, purple (`#bc13fe`) secondary, dark background (`#0a0b10`)
- Framer Motion for animations

## Critical Coding Rules

### Strict Coding Rule: Prohibición absoluta de usar `// ...` o placeholders en `page.tsx`.
*   When modifying `page.tsx`, always provide the *complete* code for any changes. Avoid using `// ...` or any form of placeholder comments that omit code. This ensures clarity, prevents errors, and maintains the integrity of the main page file.

### ASCII Layout Pattern: Explicación del uso de la clase `.ascii-art` con `line-height: 0.8` para evitar que los logos se vean estirados.
*   The `.ascii-art` CSS class, defined in `app/globals.css`, is crucial for the correct rendering of ASCII art logos. It uses `line-height: 0.8 !important;`, `letter-spacing: -0.5px;`, and a specific `font-family` (`ui-monospace`, `'Cascadia Code'`, `'Source Code Pro'`, `Menlo`, `Monaco`, `Consolas`, `monospace`) to ensure that the character-based art appears compact and unstretched, preserving its intended visual integrity. This class must be applied to any element displaying ASCII art.

### Command Logic: Cómo funciona el sistema de comandos bilingües y el modo dual (Classic/Terminal).
*   **Bilingual Command System**: The terminal supports multiple languages (Spanish, English, German) for commands. The `translations.ts` file centralizes all command keywords and their corresponding responses for each language. This allows users to interact with the terminal using commands in their selected language.
*   **Dual Mode (Classic/Terminal)**:
    *   **Terminal Mode**: This is the default, interactive mode where users explore the portfolio by issuing commands. Sections (`tech`, `projects`, `experience`, `education`) are initially hidden and are progressively "unlocked" through specific terminal commands (e.g., `skills`, `projects`).
    *   **Classic Mode**: Users can switch to this mode (via a UI button or a specific command) to immediately reveal all portfolio sections, bypassing the interactive command-line experience. This provides an alternative, more traditional navigation.

### Data Structure: Dónde están guardados los archivos de datos (`translations.ts` y `ascii.ts`) para no saturar el archivo principal.
*   **`app/data/translations.ts`**: This file serves as the primary data store for all translatable content and structured data for the portfolio, including project details, experience entries, education history, and all terminal command definitions across different languages. This centralization prevents `page.tsx` from becoming cluttered with static content and facilitates easy internationalization and content updates.
*   **`app/data/ascii.ts`**: This newly created file is specifically dedicated to housing large ASCII art constant arrays (`TOUCAN_ASCII`, `LION_ASCII`, `J_ASCII`). By isolating these potentially large data structures, we prevent `page.tsx` from being saturated with heavy data, mitigating potential `Heap out of memory` errors and improving the main file's readability and maintainability.

## Adding New Content

When adding new projects, experience, or education entries, update the corresponding arrays in all three language objects in `app/data/translations.ts`. Follow the existing `ProjectData`, `ExperienceData`, or `EducationData` interfaces.

## Adding Terminal Commands

1.  Add the command keyword to `commands` object in each language in `translations.ts`
2.  Add handling logic in the `processCommand` function in `app/page.tsx`
3.  Update the help command output in `processCommand`
