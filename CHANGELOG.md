# Changelog

All notable changes to this project will be documented in this file.

## v0.9.0 10/15/2026

Modernization overhaul: Vite, Zustand, and CodeMirror 6.

- **Framework & Bundler:** Upgraded to React 19 and migrated from Webpack to Vite for sub-second builds.
- **State Management:** Replaced Redux and Redux-Saga with lightweight Zustand stores.
- **Editor:** Upgraded to CodeMirror 6 with a new Markdown formatting toolbar and inline styling.
- **Styling & Layout:** Migrated from Sass to native Vanilla CSS and modern resizable panels.
- **Local-First Architecture:** Converted to a pure client-side application with direct browser storage and zero server requirements.
- **Dependency Refresh:** Replaced deprecated libraries with modern alternatives.

## v0.7.2 10/27/2020

Refactoring.

- Add SonarQube via SonarCloud (https://sonarcloud.io/dashboard?id=taniarascia_takenote)
- Fix bugs and code smells
- Fix #422 /app redirect
- Add demo environment variable
- Add compression
- Remove prettier and associated massive Webpack bundle

## v0.7.1 10/25/2020

Add GitHub integration.

### Changed

- Add code for integrating GitHub sync (https://github.com/taniarascia/takenote/pull/389)
- Create demo mode for takenote.dev deployment
- Add tests for selectors
- Hide note list in Scratchpad view
- Localized dates
- Various bug fixes
- Additional settings

## v0.6.1 10/19/2020

Add top menu bar.

### Changed

- Add top menu bar for preview, sync, settings, and other note options
- Update settings UI
- Add sync test back
- Organize end-to-end tests

## v0.6.0 10/16/2020

Upgrade to webpack 5.

### Changed

- Updated all packages, notable webpack 4 to webpack 5
- Updated webpack config to reflect breaking changes
- Manually brought in polyfills for Node packages that are no longer polyfilled by webpack
- Moved settings to bottom of app sidebar
- Removed sync button
- Removed unnecessary patches

## v0.5.0 02/22/2020

GitHub authentication.

### Added

- Log in/log out functionality implemented using GitHub OAuth

### Changed

- Refactored large files into smaller components
- Added folder structure and technologies to README
- Modify deployment scripts and Dockerfile to allow local development with GitHub authentication
- Prompt to confirm exit added when notes have not yet been synced

## v0.4.0 02/03/2020

Initial release.

### Added

- Created `CHANGELOG.md`
- Added Node/TypeScript backend for REST API calls
- Created CI/CD pipeline with `deploy.sh`, `.travis.yml` and `Dockerfile`

### Changed

- Migrated website from Netlify to DigitalOcean
- Added instructions for new local development to README
- Removed Netlify badge from README
- Removed Create React App and replaced with custom Webpack setup

### Removed

- Removed Service Worker due to the application no longer being fully client side
