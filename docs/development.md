# Development guide

## Prerequisites

- Node.js 22.22 or newer; 24 LTS is what `.nvmrc` and CI use (Vitest 5 and React Router 8 need 22.12 and 22.22 respectively). `.npmrc` sets `engine-strict`, so an unsupported version fails at install time.
- npm (the only supported package manager; commit `package-lock.json`).

```bash
npm ci
npm run dev
```

`npm ci` runs `prepare`, which installs the git hooks (`lefthook.yml`): on commit, lint-staged formats and lints the staged files and the project is type-checked; the commit message must follow Conventional Commits. Hooks are skipped in CI.

## Everyday commands

| Task                              | Command                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------ |
| Start the dev server              | `npm run dev` (http://localhost:8080)                                          |
| Run everything CI runs (fast part) | `npm run verify`                                                               |
| Unit and integration tests        | `npm test` or `npm run test:watch`                                             |
| Tests with coverage floors        | `npm run test:coverage`                                                        |
| Real-browser tests                | `npm run e2e` (builds first; extra arguments go to Playwright)                 |
| Preview the production build      | `npm run build && npm run preview`                                             |
| Find dead code                    | `npm run knip`                                                                 |
| Format                            | `npm run format`                                                               |

`npm run verify` is: format check, lint, type-check, knip, tests with coverage, build, `verify-build` and the bundle budget. CI additionally runs the e2e suite, Lighthouse, `npm audit` and commit-message checks.

### Running the e2e suite

`npm run e2e` builds the site under `/my-portfolio-web/` (the base path a GitHub Pages project site uses), serves it with `scripts/preview.mjs` (which behaves like Pages: base path, gzip, directory redirects, `404.html` with a 404 status) and drives it with Playwright. Locally it uses the Chrome you already have installed; CI installs Playwright's Chromium. Useful variations:

```bash
npm run e2e -- --project=desktop
npm run e2e -- -g "contact form"
npx playwright show-report
```

### Lighthouse

CI runs Lighthouse CI (pinned, through `npx`) with the thresholds in `lighthouserc.json`. To reproduce locally, build with the same base path and run it against the preview:

```bash
VITE_BASE_PATH=/my-portfolio-web/ VITE_SITE_URL=https://example.github.io/my-portfolio-web npm run build
npx --yes @lhci/cli@0.15.1 autorun
```

On Windows the tool can fail to delete its temporary Chrome profile after a run (`EPERM`); the reports are still produced.

## Adding content

### A new project

1. Add an entry to `src/content/data/projects.json`:

   ```json
   {
     "slug": "my-new-project",
     "type": "fullstack",
     "tech": ["TypeScript", "Node.js"],
     "year": 2026,
     "featured": false,
     "coverImage": "images/projects/my-new-project-cover.svg",
     "repoUrl": "https://github.com/your-username/my-new-project",
     "demoUrl": null,
     "gallery": [],
     "translations": {
       "es": { "title": "…", "excerpt": "…", "highlights": [], "content": [{ "type": "p", "text": "…" }] },
       "en": { "title": "…", "excerpt": "…", "highlights": [], "content": [{ "type": "p", "text": "…" }] }
     }
   }
   ```

2. Put images under `public/images/projects/`. Paths are relative to `public/` with no leading slash.
3. If you add gallery images, add one entry per image to `galleryAlts` in **each** language.
4. Run `npm run dev` or `npm run build`. Schema errors name the exact path, for example `projects[3].translations.es.content`.

Allowed `type` values live in `PROJECT_TYPES` in `src/domain/project.ts`. Slugs must be lowercase kebab-case and unique. The new page is prerendered automatically: `scripts/prerender-paths.ts` builds the list from the content.

### A new pill

Add an entry to `src/content/data/pills.json` with `slug`, an ISO `date` (`YYYY-MM-DD`), `tags` and both translations. Ordering is by date, newest first. Sections inside a pill should start at `h2`: the page title is the `h1`, and the accessibility checks reject skipped heading levels.

### Content blocks

| Block            | Fields                                             |
| ---------------- | -------------------------------------------------- |
| `h2`, `h3`, `p`  | `text`                                             |
| `ul`             | `items` (non-empty array of strings)               |
| `callout`        | `text`, `variant`: `info`, `warning` or `success`  |
| `code`           | `text`, optional `language`                        |

Text is rendered as plain text. Do not put HTML in it.

## Adding a language

1. Add the code to `LOCALES` in `src/domain/locale.ts`, plus its `INTL_LOCALE` and `LOCALE_NAMES` entries.
2. Create `src/i18n/dictionaries/<code>.ts` typed as `Dictionary` and register it in `dictionaries/index.ts`.
3. Add the language to the `localized(...)` helper in `src/content/schema.ts` and translate every JSON entity.

The compiler, the schema and the route tests will point at anything you missed. Prerendering, the sitemap and the `hreflang` alternates pick the new language up on their own.

## Adding a UI string

Add the key to `src/i18n/dictionaries/en.ts`, then to `es.ts`. Use it through `const { t } = useI18n()`. Interpolated strings are functions, for example `t.footer.copyright(year, name)`. Build links with `useRoutes()` so they stay inside the current language.

## Adding a page

1. Create the page in its feature folder and export it from that feature's `index.ts`.
2. Add a route module in `src/app/routes/` that exports the page as default and a `meta` function (copy an existing one and use `pageMeta`).
3. Register it in `src/app/routes.ts`, add its path to `PATHS` in `src/config/routes.ts` and to `getPrerenderPaths` in `scripts/prerender-paths.ts`.
4. `src/app/routes.test.ts` fails if a prerendered path has no route.

## Connecting a real contact provider

1. Implement `ContactService` (`send(message): Promise<void>`) in `src/services/contact/`, for example calling a form service or a serverless endpoint.
2. Pass it as the default in `src/app/RootProviders.tsx`.
3. If it needs a public key or URL, add a `VITE_…` variable, declare it in `src/vite-env.d.ts`, document it in `.env.example` and the README, add the provider's origin to `connect-src` in `scripts/postbuild.mjs`, and remove the demo notice from the dictionaries.

Never put private API keys in a `VITE_` variable: they are bundled into public JavaScript.

## Testing conventions

- `renderApp({ route })` renders the real route table at an address such as `/en/projects`; `renderWithProviders(<Component />, { locale })` renders one element with the language, content and root providers (`src/test/render.tsx`).
- Query by role and accessible name; avoid test IDs.
- Inject fakes through providers or props (`contactService`) instead of module mocking.
- `expectNoA11yViolations()` runs axe in jsdom. Colour contrast cannot be computed there, so it is covered by the Playwright suite.
- Add a Playwright test when the behaviour depends on a real browser: contrast, CSP, layout, scripts not running, HTTP status.

## Architecture rules

Layers are enforced by ESLint (see [architecture.md](architecture.md#layers)). If lint says an import is restricted, the fix is almost always to move the code down a layer or to depend on an interface, not to add an exception.

## Troubleshooting

| Symptom                                                   | Cause and fix                                                                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Build or dev server fails with `Invalid content`          | A schema error in `src/content/data`. The message lists each path.                                                                  |
| `verify-build` reports an inline script not covered by CSP | A new inline script was added. Hashes are computed by `scripts/postbuild.mjs`; run the build again and check the script is intended. |
| Assets 404 in the preview                                 | The preview reads `VITE_BASE_PATH` too; use the same value you built with.                                                         |
| Base path becomes `C:/Program Files/Git/…` on Windows     | Git Bash rewrites leading slashes. Prefix the command with `MSYS_NO_PATHCONV=1` (PowerShell is not affected).                       |
| `EPERM` while installing on Windows                       | An antivirus or indexer is holding a native binary. Retry `npm install`; do not run the build while an install is in progress.      |
| `npm install` says the Node version is unsupported        | `engine-strict` is on. Use Node 22.22+ (24 recommended).                                                                           |
| Local Lighthouse fails at cleanup with `EPERM`            | Known Windows issue with Chrome's temporary profile; the report is already written.                                                |

## Releasing

Releases are automated by release-please from Conventional Commits:

1. Merge changes to `main` with `feat:`, `fix:` and similar commit types.
2. release-please opens (and keeps updating) a release pull request that bumps the version and edits `CHANGELOG.md`.
3. Merge that pull request to create the tag and the GitHub release. The deploy workflow publishes the site on every push to `main`.

The repository setting **Allow GitHub Actions to create and approve pull requests** must be enabled.
