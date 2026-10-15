# TakeNote Modernization Plan (2025 / 2026)

This document outlines the step-by-step roadmap to bring **TakeNote** up to modern web standards, upgrading to **React 19**, **Vite 8**, **Zustand**, **CodeMirror 6**, and modern UI primitives.

---

## Progress Overview

- [x] **Vite 8 & Build Modernization:** Migrated from Webpack 5 to Vite 8 (Rolldown engine; build time: ~500ms).
- [x] **Cleanup:** Stripped legacy Docker, Kubernetes, Travis CI, Cypress/Jest, and Express server files.
- [x] **Local-First Foundation:** Converted data persistence to direct browser `localStorage`.
- [x] **Vercel Readiness:** Configured `vercel.json` for seamless SPA deployments.
- [x] **Phase 1: React 19 Core & Deprecations (Completed)**
- [x] **Phase 2: Modern Layout, Vanilla CSS & CodeMirror 6 Editor (Completed)**
- [x] **Phase 3: State Management Overhaul (Redux → Zustand) (Completed)**
- [x] **Phase 4: Routing & Polish (Completed)**
- [x] **Phase 5: Feature-Based Architecture & Directory Modernization (Completed)**
- [ ] **Phase 6: Optional Enhancements (Deferred / On-demand)**

---

## Phase 1: React 19 Core & Critical Deprecations (Completed)

### 1.1 React 19 & Root Migration

- **Status:** ✅ Completed
- **Target Packages:** `react@^19.0.0`, `react-dom@^19.0.0`, `@types/react@^19.0.0`, `@types/react-dom@^19.0.0`.
- **Action in `src/index.tsx`:** Replace legacy `render(...)` with modern `createRoot(...)`:

  ```tsx
  import { createRoot } from 'react-dom/client'

  const container = document.getElementById('root')!
  const root = createRoot(container)
  root.render(<App />)
  ```

### 1.2 Drag & Drop Replacement

- **Status:** ✅ Completed
- **Current:** `react-beautiful-dnd` (Deprecated by Atlassian in 2022).
- **Target:** **`@hello-pangea/dnd`** (v18).
- **Rationale:** Exact 1:1 drop-in replacement with active React 19 support and no breaking API changes.

### 1.3 Icon Library Upgrade

- **Status:** ✅ Completed
- **Current:** `react-feather` (Unmaintained since 2020).
- **Target:** **`@boxicons/react`**.
- **Rationale:** Official React component package for Boxicons (https://boxicons.com), providing modern SVG icons with full React compatibility and rich icon variations (regular, solid, logos).

### 1.4 Native Browser APIs

- **Status:** ✅ Completed
- **Replace `uuid`:** Use native `crypto.randomUUID()` (0 bytes added to bundle).
- **Replace `clipboard-polyfill`:** Use native `navigator.clipboard.writeText()`.
- **Remove `react-helmet-async`:** React 19 natively supports `<title>` and `<meta>` tags inside components.

---

## Phase 2: Modern Layout, Vanilla CSS & Editor Overhaul (Completed)

### 2.1 Resizable Panels

- **Status:** ✅ Completed
- **Current:** `react-split-pane` (Abandoned in 2019).
- **Target:** **`react-resizable-panels`** (by Brian Vaughn, React core team).
- **Benefits:**
  - Native React 19 support.
  - Mobile touch support and smooth animations.
  - Built-in `autoSaveId` to automatically persist pane sizes in `localStorage`.

### 2.2 Editor: CodeMirror 6 Upgrade

- **Status:** ✅ Completed
- **Current:** CodeMirror 5 (`codemirror`, `react-codemirror2`).
- **Target:** **CodeMirror 6** via **`@uiw/react-codemirror`**.
- **Benefits:**
  - Rewritten from scratch in TypeScript.
  - Modular (only bundles the extensions and syntax rules you use).
  - High performance on long markdown files and mobile devices.

### 2.3 Markdown Rendering

- **Status:** ✅ Completed
- **Current:** `react-markdown` v4 (2019).
- **Target:** **`react-markdown` v10 + `remark-gfm`**.
- **Benefits:** Modern Micromark parser, GitHub Flavored Markdown (tables, task lists, strikethrough), and full type safety.

### 2.4 Styling Modernization: SCSS $\rightarrow$ Vanilla CSS

- **Status:** ✅ Completed
- **Current:** SASS/SCSS (`sass@^1.83.0`, 19 partials, compile-time `$variables`, deprecated `@import`).
- **Target:** **Native Vanilla CSS** (CSS Custom Properties `--var` + Native CSS Nesting).
- **Benefits:**
  - Eliminates the heavy `sass` compiler dependency.
  - Shaves ~3.8 seconds off build time (plain CSS is processed instantly with zero build overhead).
  - Replaces 6.3KB duplicated `_dark.scss` with clean, runtime CSS custom properties on `:root` and `.dark`.
  - Future-proof and native (no preprocessor quirks or deprecated `@import` syntax).

---

## Phase 3: State Management Overhaul (Redux → Zustand) (Completed)

### 3.1 Eliminate Redux & Redux-Saga Boilerplate

- **Status:** ✅ Completed
- **Previous:** `@reduxjs/toolkit`, `react-redux`, `redux`, `redux-saga`, `@types/react-redux` (~15KB+ gzipped, 18 packages removed).
- **Target:** **`zustand`** (v5, ~1.2KB).
- **Architecture:**
  - `useNotesStore`: Handles note items, active note, active folder/category, selection, multi-select, search, and direct local-first storage.
  - `useCategoriesStore`: Handles custom category management, editing state, and drag reordering.
  - `useSettingsStore`: Handles theme, text direction, CodeMirror options, modal state, and sorting strategies.
  - `useAuthStore`: Handles user authentication state for the local-first environment.
- **Benefits:**
  - Completely eliminated action creators, reducers, sagas, generator functions, and slice boilerplate.
  - Removed Redux `<Provider>` from `index.tsx`, mounting `<App />` directly.
  - Direct, readable store hooks:
    ```tsx
    const { notes, activeNoteId, updateNote } = useNotesStore()
    ```
  - Direct synchronous rehydration from browser `localStorage` on boot with zero loading flash.
  - Build time reduced to **< 850ms** with zero linting issues.

---

## Phase 4: Single-Screen Architecture & Zero-Routing (Completed)

### 4.1 Landing Page & Router Elimination

- **Status:** ✅ **Completed**
- **Previous:** `react-router-dom` v5.3 (2019, ~45KB), `LandingPage.tsx`, `react-device-detect`, and external `history` package.
- **Result:** **Zero Router (0 KB Overhead)**
- **Benefits:**
  - TakeNote is a single-screen, local-first markdown note-taking app. There are no secondary pages.
  - Direct load on `localhost:3000/` straight into `<TakeNoteApp />`.
  - Removed `react-router-dom`, `@types/react-router`, `@types/react-router-dom`, `react-device-detect`, and `history` (13 packages uninstalled).
  - Completely eliminated unnecessary routing layer, reducing bundle size and speeding up hydration.

---

## Phase 5: Feature-Based Architecture & Directory Modernization (Completed)

### 5.1 Flatten `src/client` & Prune Legacy Artifacts
- **Status:** ✅ Completed
- Stripped redundant `src/client/` nesting into root `src/`.
- Deleted `public/template.html` (legacy Webpack template).
- Deleted `seed.js` (legacy Express database seeder).
- Removed unused `path-browserify` polyfill from `package.json` and `vite.config.ts`.
- Deleted `src/resources/assets/` (1.7 MB of dead graphics from old landing page).
- Consolidated `LabelText.ts` and `TestID.ts` into `src/constants/` and deleted `src/resources/`.

### 5.2 Eliminate Containers & Contexts in Favor of Features
- **Status:** ✅ Completed
- Abolished the legacy Redux "Smart Containers vs. Dumb Components" split.
- Organized all domain logic into `src/features/`:
  - `src/features/sidebar/`: AppSidebar, CategoryList, CategoryOption, and subcomponents.
  - `src/features/notes/`: NoteList, ContextMenu, ContextMenuOptions, and search components.
  - `src/features/editor/`: NoteEditor, NoteMenuBar, EmptyEditor, PreviewEditor, NoteLink.
  - `src/features/settings/`: SettingsModal, KeyboardShortcuts, and configuration components.
  - `src/components/ui/`: Reusable primitives (`Select`, `Switch`, `Tabs`).
- Combined `TakeNoteApp.tsx` and `App.tsx` into a single, clean `src/App.tsx`.
- Absorbed ephemeral `addingTempCategory` state into `useCategoriesStore`, eliminating `TempStateContext.tsx` and the `src/contexts/` directory entirely.

---

## Phase 6: Optional Enhancements (Deferred / On-demand)

### 5.1 Markdown Formatting Toolbar & Inline Styling

- **Status:** Optional (evaluate after core modernization phases).
- **Concept:** Formatting toolbar similar to GitHub Issue comment editor or StackOverflow markdown input.
- **Component:** `<EditorToolbar />` with intuitive formatting action buttons powered by `@boxicons/react`:
  - `<BxBold />`, `<BxItalic />`, `<BxStrikethrough />`, `<BxHeading />`, `<BxCode />`, `<BxCodeBlock />`, `<BxListUl />`, `<BxListOl />`, `<BxCheckboxChecked />`, `<BxQuoteLeft />`, `<BxLink />`, `<BxTable />`.
- **Behavior:** Uses CodeMirror 6 transactions (`view.dispatch()`) to wrap or insert markdown syntax around the current selection.
- **Inline Styling:** Custom CodeMirror 6 CSS theme for visually enhanced editing (larger headings, bold font weight, styled code block background directly inside the editor).
- **Benefits:** Retains 100% clean Markdown storage (`notes.text`) with minimal `localStorage` footprint, intuitive for non-technical users while preserving keyboard speed for developers.

---

## Dependency Impact Summary

| Metric                | Current State              | After Modernization                              |
| :-------------------- | :------------------------- | :----------------------------------------------- |
| **React Version**     | 18.3.1                     | **19.3.0**                                       |
| **Bundler**           | Vite 8 (Rolldown)          | **Vite 8 (Rolldown)**                            |
| **State Library**     | Redux + Saga (15KB+)       | **Zustand (1.2KB)**                              |
| **Routing**           | react-router-dom v5 (45KB) | **None / Zero Router (0 KB)**                    |
| **Editor**            | CodeMirror 5 (Legacy)      | **CodeMirror 6 (Modular)**                       |
| **Styling**           | SCSS (`sass` compiler)     | **Vanilla CSS (CSS Variables + Native Nesting)** |
| **Icons**             | react-feather (Frozen)     | **@boxicons/react (Boxicons)**                   |
| **Panels**            | react-split-pane (2019)    | **react-resizable-panels**                       |
| **Production Bundle** | ~1.46 MB                   | **< 600 KB**                                     |
