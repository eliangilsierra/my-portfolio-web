# Contributing

Thanks for your interest in improving my-portfolio-web. This guide keeps contributions fast to review and safe to merge. By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting set up

```bash
git clone https://github.com/eliangilsierra/my-portfolio-web.git
cd my-portfolio-web
npm ci
npm run dev
```

Node.js 22.22 or newer is required (24 LTS is recommended, see `.nvmrc`). `npm ci` installs the git hooks: on commit, staged files are formatted and linted, the project is type-checked and the commit message is checked. See [docs/development.md](docs/development.md) for the day-to-day workflow.

## Workflow

1. Open an issue first for anything larger than a small fix, so the approach can be agreed.
2. Create a branch from `main` named `<type>/<short-description>`, for example `feat/pill-tags-filter` or `fix/mailto-encoding`.
3. Make focused changes. Keep unrelated refactors out of the same pull request.
4. Run the checks locally (below) before pushing.
5. Open a pull request using the template. CI must pass.

## Before you push

```bash
npm run verify
```

It runs the format check, lint, type-check, dead-code check, tests with coverage floors, the production build, the build verification and the bundle budget. CI runs the same and adds the end-to-end suite (`npm run e2e`), Lighthouse, `npm audit` and CodeQL. If your change touches behaviour that depends on a real browser (layout, colour, scripts, headers), run `npm run e2e` too.

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/) and enforces it in the commit hook and in CI. Use the imperative mood and keep the header under 100 characters.

```text
<type>(<optional scope>): <subject>
```

| Type       | Use for                                                 | Appears in the changelog |
| ---------- | ------------------------------------------------------- | ------------------------ |
| `feat`     | A user-visible feature                                  | Added                    |
| `fix`      | A bug fix                                               | Fixed                    |
| `perf`     | A performance improvement                               | Performance              |
| `refactor` | Code change that neither fixes a bug nor adds a feature | Changed                  |
| `docs`     | Documentation only                                      | Documentation            |
| `test`     | Adding or changing tests                                | hidden                   |
| `build`    | Build system or dependencies                            | hidden                   |
| `ci`       | CI configuration                                        | hidden                   |
| `chore`    | Maintenance that does not fit elsewhere                 | hidden                   |

A `!` after the type (`feat!:`) or a `BREAKING CHANGE:` footer marks a breaking change. Commits should be atomic: one logical change, with its tests, that leaves the project working. [release-please](https://github.com/googleapis/release-please) reads these messages to write the changelog and choose the next version.

## Code standards

- **TypeScript is strict** and linting is type-aware. Avoid `any` and non-null assertions; prefer discriminated unions and exhaustive checks over casts.
- **Respect the layers.** ESLint enforces which folder may import which ([architecture](docs/architecture.md#layers)). A feature is imported only through its `index.ts`.
- **No user-facing strings in components.** Add them to both `src/i18n/dictionaries/en.ts` and `es.ts`; a missing key is a compile error.
- **Links stay inside the current language.** Build URLs with `useRoutes()` (or `localizedPath`), never with hard-coded paths.
- **No magic numbers.** Put tunable values in `src/config/constants.ts`.
- **Content changes go through the schema** in `src/content/schema.ts`. If you add a field, update the schema, the domain type, the repository mapping and the tests.
- **Accessibility is a requirement**: semantic elements, labelled controls, `aria-hidden` on decorative icons, visible focus, no skipped heading levels. ESLint runs `jsx-a11y`, and axe checks every page in jsdom and in a real browser (including contrast).
- **Tests accompany behaviour.** New logic gets a unit test; new user flows get an integration test using Testing Library queries by role; anything that depends on a real browser gets a Playwright test. Coverage floors are enforced.
- **Keep dependencies few.** Prefer the platform (CSS, React 19 features) to a library. New runtime dependencies need a reason in the pull request. `npm run knip` must stay clean.
- Formatting is enforced by Prettier (`npm run format`), including Tailwind class order. Do not hand-format.

## Labels

The following labels are recommended for issues and pull requests:

| Label              | Meaning                                  |
| ------------------ | ---------------------------------------- |
| `bug`              | Something is broken                      |
| `enhancement`      | New feature or improvement               |
| `content`          | Change to sample content or translations |
| `i18n`             | Language or localization work            |
| `a11y`             | Accessibility                            |
| `docs`             | Documentation                            |
| `dependencies`     | Dependency updates (Dependabot)          |
| `good first issue` | Small and well-scoped                    |
| `help wanted`      | Extra attention is welcome               |
| `wontfix`          | Out of scope                             |

## Reporting security issues

Do not open a public issue for vulnerabilities. Follow the [Security Policy](SECURITY.md).
