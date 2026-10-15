<p align="center">
  <img src="./assets/logo.png" alt="TakeNote Logo">
</p>

<p align="center">
  <a href="https://github.com/ntt77/takenote"><img src="https://img.shields.io/badge/Fork-ntt77%2Ftakenote-blue.svg" alt="Fork"></a>
  <a href="https://github.com/taniarascia/takenote"><img src="https://img.shields.io/badge/Upstream-taniarascia%2Ftakenote-lightgrey.svg" alt="Upstream"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/React-19.3-61dafb.svg" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-8.3-646cff.svg" alt="Vite 8">
  <img src="https://img.shields.io/badge/State-Zustand-orange.svg" alt="Zustand">
</p>

<p align="center"><strong>A modern, local-first web notes application for developers.</strong></p>

> [!NOTE]
> This repository is a **modernized fork** of [TakeNote](https://github.com/taniarascia/takenote) originally created by [Tania Rascia](https://www.taniarascia.com). It has been upgraded to **React 19**, **Vite 8**, **Zustand**, **CodeMirror 6**, and native **Vanilla CSS**.

---

![Screenshot](./assets/takenote-light.png)

## Features

- **Plain text & Markdown** - write and edit notes in a clean, distraction-free environment.
- **CodeMirror 6 Editor** - modular, TypeScript-native editor with multi-cursor support, syntax highlighting, and smooth scrolling.
- **Markdown Formatting Toolbar** - intuitive toolbar with quick actions for Bold, Italic, Strikethrough, Headings (H1/H2/H3 cycling), Quotes, Code, Code Blocks, Bullet/Numbered/Task Lists, Links, and Tables.
- **Inline Editor Styling** - proportional headings, bold weights, and styled code blocks directly inside the editor.
- **Markdown Preview** - preview rendered HTML powered by modern `react-markdown` and `remark-gfm` (tables, task checklists, strikethrough).
- **Linked Notes** - link notes seamlessly with `{{uuid}}` syntax.
- **Local-First & Private** - notes are persisted directly in browser `localStorage`. No tracking, no external database, and no server required.
- **Export & Backup** - download individual notes or batch export all notes as a zip archive.
- **Keyboard Shortcuts** - full keyboard navigation for creating notes, organizing categories, toggling settings, and formatting.
- **Drag and Drop** - organize categories and notes with smooth `@hello-pangea/dnd` drag-and-drop.
- **Modern Themes** - curated light and dark modes with runtime CSS custom properties.
- **Fast Resizable Panels** - powered by `react-resizable-panels` with persistent layout widths.

## Credits & Acknowledgements

- **Original Author**: [Tania Rascia](https://www.taniarascia.com) — creator of the original [TakeNote](https://github.com/taniarascia/takenote).
- **Fork Maintainer**: [ntt77](https://github.com/ntt77).
- **Logo Design**: [David Bock](https://dkbock.com/).
- Thanks to all contributors of the original TakeNote project.

---

## License

This project is open source and available under the [MIT License](LICENSE).
