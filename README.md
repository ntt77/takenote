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
- **Markdown Preview** - preview rendered HTML powered by modern `react-markdown` and `remark-gfm` (tables, task checklists, strikethrough).
- **Linked Notes** - link notes seamlessly with `{{uuid}}` syntax.
- **Local-First & Private** - notes are persisted directly in browser `localStorage`. No tracking, no external database, and no server required.
- **Export & Backup** - download individual notes or batch export all notes as a zip archive.
- **Keyboard Shortcuts** - full keyboard navigation for creating notes, organizing categories, toggling settings, and formatting.
- **Drag and Drop** - organize categories and notes with smooth `@hello-pangea/dnd` drag-and-drop.
- **Modern Themes** - curated light and dark modes with runtime CSS custom properties.
- **Fast Resizable Panels** - powered by `react-resizable-panels` with persistent layout widths.

## Cloudflare Deployment & Environment Variables

TakeNote runs on **Cloudflare Workers (with Static Assets)** and a **Cloudflare D1** SQLite database.

| Type                | Name                 | Required | Description                                                                                                             |
| :------------------ | :------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------- |
| D1 Database Binding | `DB`                 | Yes      | Connects the edge backend functions to your Cloudflare D1 database. Must be named exactly `DB`.                         |
| `APP_PASSWORD`      | String (SHA-256 Hex) | No       | **SHA-256 hash** (64 hex characters) of your unlock password. If omitted, the app will run publicly without a password. |

- **How to generate your `APP_PASSWORD` hash:** Hash your desired password using any SHA-256 tool:
  - Online: [emn178.github.io/online-tools/sha256/](https://emn178.github.io/online-tools/sha256.html)
  - Terminal: `echo -n "your_password" | sha256sum`
- In local development, if `APP_PASSWORD` is not set in `.env`, the dev server defaults to test password **`123456`**.
- To test with your own custom password locally, create a `.env` file at the root:
  ```env
  APP_PASSWORD=8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
  ```

## Credits & Acknowledgements

- **Original Author**: [Tania Rascia](https://www.taniarascia.com) — creator of the original [TakeNote](https://github.com/taniarascia/takenote).
- **Fork Maintainer**: [ntt77](https://github.com/ntt77).
- **Logo Design**: [David Bock](https://dkbock.com/).
- Thanks to all contributors of the original TakeNote project.

---

## License

This project is open source and available under the [MIT License](LICENSE).
