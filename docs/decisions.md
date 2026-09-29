# Architecture decision records

Each record states the context, the decision and its consequences. Status values: **Accepted**, **Superseded**.

## ADR 1: Content as validated JSON with per-entity translations

**Status:** Accepted

**Context.** The prototype cast JSON files with `as Project[]`, so a typo surfaced as a broken page. Supporting two languages by duplicating files would let the ES and EN versions drift apart.

**Decision.** Keep content in JSON, one file per collection. Each entity stores shared fields once and its text under `translations.<locale>`. Zod schemas validate the data at load time, and TypeScript types are derived from those schemas.

**Consequences.**

- (+) A missing translation, duplicate slug, malformed date/URL or missing alt text fails fast with a precise path.
- (+) Shared data such as tech, year and URLs cannot diverge between languages.
- (+) No CMS or backend is needed.
- (−) Editing one project touches one large JSON object; long content is verbose. Acceptable at this scale.
- (−) Adding a language requires touching the schema helper (documented in the development guide).

## ADR 2: A small custom i18n layer instead of an i18n library

**Status:** Accepted

**Context.** The site has two languages and a few hundred UI strings. Libraries such as i18next add runtime weight, string-key lookups that are not type-checked by default, and configuration.

**Decision.** Implement locale detection, a provider and typed dictionaries in about 100 lines. English defines the dictionary shape; other locales are typed against it. Interpolation uses plain functions.

**Consequences.**

- (+) Missing keys are compile errors; no runtime dependency.
- (+) Trivial to test and understand.
- (−) No pluralization or ICU message formats. If those are needed, migrate to a library behind the same `useI18n` hook.

## ADR 3: Feature-oriented structure with a repository port for content

**Status:** Accepted

**Context.** The prototype used a flat `pages/` folder that imported a data module directly, mixing UI strings with search logic.

**Decision.** Organize by feature (`features/projects`, `features/pills`, ...) with shared UI in `components/`. Pages read content through a `ContentRepository` interface exposed by a React context.

**Consequences.**

- (+) Features are self-contained and easy to delete or extend.
- (+) Content can move to a CMS or API by implementing one interface; tests inject fixtures.
- (−) A little more indirection than importing JSON directly, justified by testability and the locale projection.

## ADR 4: GitHub Pages with `BrowserRouter` and a `404.html` fallback

**Status:** Accepted

**Context.** Hosting must be free and simple. Pages has no server-side rewrites, so client-side routes 404 on refresh. `HashRouter` avoids this but produces `#/` URLs that are worse for sharing and SEO.

**Decision.** Use `BrowserRouter` with `basename` derived from Vite's `BASE_URL`. The build copies `index.html` to `404.html`, which Pages serves for unknown paths. The deploy workflow sets `VITE_BASE_PATH` from the repository name.

**Consequences.**

- (+) Clean URLs and working deep links, no extra services.
- (−) Deep links respond with HTTP 404 (the page still renders). Crawlers may treat them less favorably.
- (→) If SEO matters, pre-render routes at build time or move to a host with rewrite rules.

## ADR 5: Contact form behind a `ContactService` port, mocked for now

**Status:** Accepted

**Context.** A static site cannot deliver email by itself. The prototype pretended to send messages and reported success, which misleads visitors.

**Decision.** Define a `ContactService` interface and ship a mock implementation. The form is fully functional (validation, states, errors) but shows an explicit demo notice and offers a `mailto:` fallback.

**Consequences.**

- (+) Honest UX today; connecting a provider later is one new implementation and does not touch the page.
- (+) Failure paths are tested through an injected service.
- (−) Messages are not delivered until a provider is configured.

## ADR 6: `next-themes` for theming

**Status:** Accepted

**Context.** The prototype re-implemented theme persistence by hand, applied the class after first paint (a flash of the wrong theme) and ignored theme changes elsewhere.

**Decision.** Use `next-themes` with the `class` strategy and the system preference as default. It injects a pre-paint script and handles persistence.

**Consequences.**

- (+) No flash on load; less custom code.
- (−) One small dependency.

## ADR 7: Pin Vitest 3 while the project is on Vite 5

**Status:** Accepted

**Context.** The current Vitest major requires Vite 6 or newer as a peer dependency, while the project is on Vite 5.

**Decision.** Use Vitest 3, which supports Vite 5, instead of forcing peer resolution.

**Consequences.**

- (+) Clean installs with no `--legacy-peer-deps`.
- (→) Upgrade Vite and Vitest together later (listed in the roadmap).

## ADR 8: Trimmed design-system footprint

**Status:** Accepted

**Context.** The scaffold shipped 49 shadcn/ui components and their dependencies, but the app used seven. Unused code still needs auditing and slows installs.

**Decision.** Keep only the primitives in use (`alert`, `badge`, `button`, `card`, `input`, `label`, `textarea`). Add others with the shadcn CLI when needed (`components.json` is kept for that). ESLint relaxes two rules only inside `components/ui`, where the generated code intentionally deviates.

**Consequences.**

- (+) Roughly 40 fewer runtime dependencies and a smaller audit surface.
- (−) Adding a component means running the CLI and its dependency install.
