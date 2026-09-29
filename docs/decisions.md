# Architecture decision records

Each record states the context, the decision and its consequences. Status values: **Accepted**, **Superseded** (with a pointer to what replaced it) and **Rejected** (evaluated and deliberately not adopted). Records are not rewritten when a decision changes: a new record supersedes the old one.

| #   | Decision                                                          | Status                    |
| --- | ----------------------------------------------------------------- | ------------------------- |
| 1   | Content as validated JSON with per-entity translations            | Accepted (amended by 13)  |
| 2   | A small custom i18n layer instead of a library                    | Accepted (amended by 10)  |
| 3   | Feature-oriented structure with a repository port for content     | Accepted (amended by 14)  |
| 4   | GitHub Pages with `BrowserRouter` and a `404.html` fallback       | Superseded by 9           |
| 5   | Contact form behind a `ContactService` port, mocked for now       | Accepted (amended by 15)  |
| 6   | `next-themes` for theming                                         | Superseded by 11          |
| 7   | Pin Vitest 3 while the project is on Vite 5                       | Superseded by 16          |
| 8   | Trimmed design-system footprint                                   | Accepted                  |
| 9   | React Router framework mode with static prerendering              | Accepted                  |
| 10  | The language lives in the URL                                     | Accepted                  |
| 11  | A small in-house theme with an inline head script                 | Accepted                  |
| 12  | CSS scroll-driven animations instead of a motion library          | Accepted                  |
| 13  | Content is validated at build time, not at runtime                | Accepted                  |
| 14  | Clean-architecture layers enforced by lint                        | Accepted                  |
| 15  | Contact form on React 19 form actions                             | Accepted                  |
| 16  | Node 24 baseline, TypeScript 6, latest majors across the stack    | Accepted                  |
| 17  | Content-Security-Policy generated per page from script hashes     | Accepted                  |
| 18  | Self-hosted fonts                                                 | Accepted                  |
| 19  | Do not adopt the React Compiler (yet)                             | Rejected                  |
| 20  | Lighthouse CI runs through `npx`, not as a dependency             | Accepted                  |

## ADR 1: Content as validated JSON with per-entity translations

**Status:** Accepted, amended by ADR 13

**Context.** The original prototype cast JSON files with `as Project[]`, so a typo surfaced as a broken page. Supporting two languages by duplicating files would let the ES and EN versions drift apart.

**Decision.** Keep content in JSON, one file per collection. Each entity stores shared fields once and its text under `translations.<locale>`. Zod schemas validate the data and the TypeScript types are kept in step with them.

**Consequences.**

- (+) A missing translation, duplicate slug, malformed date/URL or missing alt text fails fast with a precise path.
- (+) Shared data such as tech, year and URLs cannot diverge between languages.
- (+) No CMS or backend is needed.
- (−) Editing one project touches one large JSON object; long content is verbose. Acceptable at this scale.
- (−) Adding a language requires touching the schema helper (documented in the development guide).

## ADR 2: A small custom i18n layer instead of an i18n library

**Status:** Accepted, amended by ADR 10

**Context.** The site has two languages and a few hundred UI strings. Libraries such as i18next add runtime weight, string-key lookups that are not type-checked by default, and configuration.

**Decision.** Implement the provider and typed dictionaries by hand. English defines the dictionary shape; other languages are typed against it. Interpolation uses plain functions.

**Consequences.**

- (+) Missing keys are compile errors; no runtime dependency.
- (+) Trivial to test and understand.
- (−) No pluralization or ICU message formats. If those are needed, migrate to a library behind the same `useI18n` hook.

## ADR 3: Feature-oriented structure with a repository port for content

**Status:** Accepted, amended by ADR 14

**Context.** The prototype used a flat `pages/` folder that imported a data module directly, mixing UI strings with search logic.

**Decision.** Organize by feature (`features/projects`, `features/pills`, ...) with shared UI in `components/`. Pages read content through repository interfaces exposed by a React context.

**Consequences.**

- (+) Features are self-contained and easy to delete or extend.
- (+) Content can move to a CMS or API by implementing the interfaces; tests inject fixtures.
- (−) A little more indirection than importing JSON directly, justified by testability and the language projection.

## ADR 4: GitHub Pages with `BrowserRouter` and a `404.html` fallback

**Status:** Superseded by ADR 9

**Context.** Hosting must be free and simple. Pages has no server-side rewrites, so client-side routes 404 on refresh. `HashRouter` avoids this but produces `#/` URLs that are worse for sharing and SEO.

**Decision.** Use `BrowserRouter` with a base path, and copy `index.html` to `404.html` so Pages serves the app for unknown paths.

**Consequences.** Clean URLs and working deep links, but every deep link answered with HTTP 404 and no per-page HTML for crawlers or social previews. ADR 9 keeps the hosting and removes both drawbacks.

## ADR 5: Contact form behind a `ContactService` port, mocked for now

**Status:** Accepted, amended by ADR 15

**Context.** A static site cannot deliver email by itself. The prototype pretended to send messages and reported success, which misleads visitors.

**Decision.** Define a `ContactService` interface and ship a mock implementation. The form is fully functional (validation, states, errors) but shows an explicit demo notice and offers a `mailto:` fallback.

**Consequences.**

- (+) Honest UX today; connecting a provider later is one new implementation and does not touch the page.
- (+) Failure paths are tested through an injected service.
- (−) Messages are not delivered until a provider is configured.

## ADR 6: `next-themes` for theming

**Status:** Superseded by ADR 11

**Context.** The prototype re-implemented theme persistence by hand and applied the class after first paint (a flash of the wrong theme).

**Decision.** Use `next-themes` with the `class` strategy.

**Consequences.** No flash and less custom code, at the cost of a dependency whose script is rendered inside the React tree. Prerendering and a strict Content-Security-Policy need that script in `<head>` and hashable, which ADR 11 provides.

## ADR 7: Pin Vitest 3 while the project is on Vite 5

**Status:** Superseded by ADR 16

**Context.** Vitest 5 requires Vite 6 or newer as a peer dependency.

**Decision.** Use Vitest 3, which supports Vite 5, instead of forcing peer resolution.

**Consequences.** Clean installs; upgrade Vite and Vitest together later. That upgrade happened in ADR 16.

## ADR 8: Trimmed design-system footprint

**Status:** Accepted

**Context.** The scaffold shipped 49 shadcn/ui components and their dependencies, but the app used seven. Unused code still needs auditing and slows installs.

**Decision.** Keep only the primitives in use (`alert`, `badge`, `button`, `card`, `input`, `label`, `textarea`), written for React 19 (plain function components, `ref` as a prop, `data-slot`). Add others with the shadcn CLI when needed (`components.json` is kept for that).

**Consequences.**

- (+) Roughly 40 fewer runtime dependencies and a smaller audit surface.
- (−) Adding a component means running the CLI and its dependency install.

## ADR 9: React Router framework mode with static prerendering

**Status:** Accepted

**Context.** A single-page app on GitHub Pages serves a nearly empty document for every URL: crawlers and social scrapers see no content or metadata, deep links answer 404 while the app renders, and visitors see nothing until JavaScript runs.

**Decision.** Use React Router 8 in framework mode with `ssr: false` and an explicit `prerender` list. The build renders every page in every language to static HTML; the browser hydrates it. Per-route metadata comes from `meta` exports. A postbuild step turns the framework's SPA fallback into `404.html` and normalizes the output layout for a base path.

**Consequences.**

- (+) Real HTML, titles, descriptions, canonical URLs, `hreflang` and Open Graph tags for every page; content readable without JavaScript.
- (+) Hosting is unchanged: still static files on GitHub Pages.
- (+) Unknown addresses get a real 404 status from the host while still rendering a useful page.
- (−) About 35 kB gzip more JavaScript than the plain SPA it replaced (measured: 99 kB to 156 kB for the first load), in exchange for the items above.
- (−) A dependency on a young major of the framework and its Vite plugin; mitigated by the build verification and the browser tests.
- (→) The prerender list is derived from the content, so a new project or pill needs no manual step.

## ADR 10: The language lives in the URL

**Status:** Accepted

**Context.** With the language kept in state (and `localStorage`), every language shares one URL: search engines index one language, links cannot point at a translation, and prerendering cannot produce both.

**Decision.** Every page lives under `/:lang/…`. The URL is the single source of truth: it selects the dictionary and the content, and the switcher is an ordinary link to the same page in the other language. The site root is a chooser that redirects in the browser using the saved preference, then the browser language, then the default. Addresses without a supported language render a page that speaks all of them.

**Consequences.**

- (+) One indexable URL per language and page, with `hreflang` alternates and a sitemap; shareable and crawlable links; the switch works without JavaScript.
- (+) No language state to synchronize; the provider became a pure function of a prop.
- (−) The site root cannot redirect on the server (there is none), so it briefly shows the chooser before the client redirects.

## ADR 11: A small in-house theme with an inline head script

**Status:** Accepted

**Context.** Avoiding a light flash requires applying the theme before first paint, from a script in `<head>`. Prerendered HTML and a strict Content-Security-Policy need that script to be a single, stable, hashable string.

**Decision.** `theme/theme.ts` exposes pure functions and builds the inline script from them; `useTheme` reads the DOM as its source of truth through `useSyncExternalStore`, follows the system until the visitor chooses, and stores the choice.

**Consequences.**

- (+) One fewer dependency, no script rendered inside the React tree, and the script is covered by unit tests and by an e2e test that blocks all bundles and still expects the dark class.
- (−) About 100 lines to maintain instead of a library.

## ADR 12: CSS scroll-driven animations instead of a motion library

**Status:** Accepted

**Context.** The only animation was a fade-and-rise on load and on scroll, plus a menu. A JavaScript animation library was about a quarter of the bundle, and starting elements at `opacity: 0` from JavaScript leaves prerendered content invisible until hydration.

**Decision.** Implement the entrance as CSS keyframes: `.reveal` plays on load; `.reveal-in-view` uses `animation-timeline: view()` where supported and does nothing elsewhere. Reduced motion disables both. The mobile menu uses the same class.

**Consequences.**

- (+) No JavaScript for motion, visible in prerendered HTML, respects `prefers-reduced-motion`.
- (+) Removing the library cut the main bundle by about 40% when it was done (169 kB to 102 kB gzip).
- (−) No exit animations and no orchestration; acceptable for this design.

## ADR 13: Content is validated at build time, not at runtime

**Status:** Accepted

**Context.** Validating JSON with Zod when the module loaded put the whole schema library in the main bundle to check static data that cannot change after the build.

**Decision.** A Vite plugin (`scripts/vite-plugin-validate-content.ts`) runs the schema when the build or dev server starts and on every data change in dev. The runtime reads the data through a single documented cast. The test suite validates the same data.

**Consequences.**

- (+) The schema library stays out of the initial bundle; invalid content still cannot ship.
- (−) The cast is only as safe as the build step; that is why the plugin and the tests exist.

## ADR 14: Clean-architecture layers enforced by lint

**Status:** Accepted

**Context.** The documented direction of dependencies was a convention. An early version of the code had a cycle between `i18n` and `content`, cross-feature imports of internals, and a `lib` module that imported from `i18n`.

**Decision.** Introduce a framework-free `domain` layer and a `services` layer for ports; split the wide content repository into three small interfaces; give each feature a public API (`index.ts`); and encode the allowed imports per folder in ESLint (`no-restricted-imports`).

**Consequences.**

- (+) Violations fail lint locally and in CI; the architecture document describes what the tooling enforces.
- (+) Small interfaces mean components depend only on what they use.
- (−) A few more files and barrels. Tests and test helpers are exempt.

## ADR 15: Contact form on React 19 form actions

**Status:** Accepted

**Context.** The form used react-hook-form with a resolver. React 19 provides form actions, `useActionState` and `useFormStatus`, which cover the same needs with less code and work as a plain HTML form.

**Decision.** The submit logic is a pure async function (`createContactAction`: validate, deliver, describe the outcome) that is unit-tested without rendering. `ContactForm` uses `useActionState`, uncontrolled inputs that keep the visitor's text through `defaultValue`, and moves focus to the first invalid field. The service is provided through context.

**Consequences.**

- (+) Two fewer runtime dependencies and a testable core.
- (−) Client-side validation messages arrive after submit rather than while typing.

## ADR 16: Node 24 baseline, TypeScript 6, latest majors across the stack

**Status:** Accepted

**Context.** Node 20 reached end of life and the latest Vitest and React Router require Node 22 or newer. The newest TypeScript (7, native) is not yet supported by `typescript-eslint`, which is required for type-aware linting.

**Decision.** Target Node 24 LTS (`engines`: 22.22 or newer), TypeScript 6.0, and the current majors of Vite (8), Vitest (5), ESLint (10), React (19), React Router (8), Tailwind (4) and Zod (4). `eslint-plugin-jsx-a11y` does not yet declare ESLint 10 support, so an npm `override` provides the peer; a probe rule confirmed it runs. Revisit TypeScript 7 when `typescript-eslint` supports it.

**Consequences.**

- (+) `npm audit` reports no vulnerabilities; the toolchain is current.
- (−) One `overrides` entry to watch, and the newest majors carry more risk than mature ones; the e2e and build checks are the safety net.

## ADR 17: Content-Security-Policy generated per page from script hashes

**Status:** Accepted

**Context.** GitHub Pages cannot send headers, and a prerendered page contains several inline scripts (theme, hydration data) whose contents differ per page, so a static policy would need `unsafe-inline`.

**Decision.** The postbuild step computes a SHA-256 hash for each inline script in each page and writes a `<meta http-equiv="Content-Security-Policy">` that allows exactly those. Everything else is `'self'`. `scripts/verify-build.mjs` recomputes the hashes and fails the build on any mismatch, `unsafe-inline` or `unsafe-eval`.

**Consequences.**

- (+) A strict script policy without a server, checked on every build and in a real browser.
- (−) `frame-ancestors` and similar directives cannot be set from a meta tag; a host that allows headers could add them.

## ADR 18: Self-hosted fonts

**Status:** Accepted

**Context.** Loading fonts from a third-party service adds a request to another origin (a privacy concern and a Content-Security-Policy exception) and a render-blocking dependency.

**Decision.** Use the variable-font packages from Fontsource, bundle them, preload the two Latin files used above the fold, and never inline fonts as `data:` URIs.

**Consequences.**

- (+) No third-party requests (asserted by the e2e suite) and a strict `font-src 'self'`.
- (−) About 15 font files in the build output (only the needed subsets are downloaded by browsers).

## ADR 19: Do not adopt the React Compiler (yet)

**Status:** Rejected

**Context.** The React Compiler memoizes automatically at build time and is available through Babel with Vite 8.

**Decision.** It was tried and measured. It added about 9 kB gzip (roughly 6%) to the first-load JavaScript of a mostly static site whose re-render cost is irrelevant, so it was removed.

**Consequences.** Nothing to maintain, and the size budget stays lower. Revisit if the app gains interactive, state-heavy screens.

## ADR 20: Lighthouse CI runs through `npx`, not as a dependency

**Status:** Accepted

**Context.** Installing `@lhci/cli` added ten advisories (seven high) to `npm audit` through its old transitive dependencies, although none of it ships to visitors.

**Decision.** CI runs a pinned version through `npx --yes @lhci/cli@<version>`, keeping the project's own audit at zero and the tool's version explicit. Reports are kept as run artifacts instead of being uploaded to a public store.

**Consequences.** The project's dependency audit stays meaningful; the tool is downloaded on each CI run.
