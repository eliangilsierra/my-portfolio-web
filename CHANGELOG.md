# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-09-28

Initial public release. The project is a ground-up restructuring of a generated prototype into a maintainable, tested and documented application.

### Added

- Bilingual (ES/EN) UI with typed dictionaries, browser-language detection and persisted preference.
- Content layer: one JSON file per entity with per-locale translations, validated by Zod at load time and exposed through a `ContentRepository` interface.
- Feature modules for home, projects, pills, about, contact and not-found pages.
- Accent-insensitive search and type filters for projects; search for pills.
- Project cover images and galleries with localized alt texts.
- Contact form with localized validation, running in demo mode behind a `ContactService` abstraction.
- Light, dark and system themes without a flash of the wrong theme.
- Accessibility: skip link, landmarks, `aria-current` navigation, labelled controls, reduced-motion support.
- Route-level code splitting and a top-level error boundary.
- Vitest and Testing Library suite (47 tests).
- GitHub Actions for CI and GitHub Pages deployment, with a `404.html` fallback for deep links.
- ESLint (with `jsx-a11y`), Prettier, EditorConfig and strict TypeScript settings.
- Documentation: README, contributing guide, architecture overview and decision records.
- Issue and pull request templates, and Dependabot configuration.

### Changed

- Project slugs are now English and stable across locales (for example `sivia-visual-inspection`).
- Navigation uses router links everywhere, so it no longer triggers full page reloads.
- The 404 page is localized, themed and shown for unknown project and pill slugs instead of redirecting.
- The contact `mailto:` link is built once from a plain address and no longer duplicates the `body` parameter.

### Removed

- Unused UI components, hooks, images and roughly 40 unused runtime dependencies.
- The `lovable-tagger` plugin and the duplicate lockfile (`bun.lockb`); npm is the single package manager.
- The unregistered `@tailwindcss/typography` classes and unused Tailwind animations and sidebar tokens.

[Unreleased]: https://github.com/eliangilsierra/my-portfolio-web/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/eliangilsierra/my-portfolio-web/releases/tag/v0.1.0
