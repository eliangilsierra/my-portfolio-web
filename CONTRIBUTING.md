# Contributing

Thanks for your interest in improving my-portfolio-web. This guide keeps contributions fast to review and safe to merge.

## Getting set up

```bash
git clone https://github.com/eliangilsierra/my-portfolio-web.git
cd my-portfolio-web
npm ci
npm run dev
```

Node.js 20 or newer is required. See [docs/development.md](docs/development.md) for the day-to-day workflow.

## Workflow

1. Open an issue first for anything larger than a small fix, so the approach can be agreed.
2. Create a branch from `main` named `<type>/<short-description>`, for example `feat/pill-tags-filter` or `fix/mailto-encoding`.
3. Make focused changes. Keep unrelated refactors out of the same pull request.
4. Run the full check locally (below) before pushing.
5. Open a pull request using the template. CI must pass.

## Before you push

```bash
npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
```

This is exactly what CI runs.

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use the imperative mood and keep the subject under about 72 characters.

```text
<type>(<optional scope>): <subject>
```

| Type       | Use for                                             |
| ---------- | --------------------------------------------------- |
| `feat`     | A user-visible feature                              |
| `fix`      | A bug fix                                           |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs`     | Documentation only                                  |
| `test`     | Adding or changing tests                            |
| `build`    | Build system or dependencies                        |
| `ci`       | CI configuration                                    |
| `chore`    | Maintenance that does not fit elsewhere             |

Commits should be atomic: one logical change, with its tests, that leaves the project working.

## Code standards

- **TypeScript is strict.** Avoid `any`; prefer discriminated unions and exhaustive checks over casts.
- **No user-facing strings in components.** Add them to both `src/i18n/dictionaries/en.ts` and `es.ts`. A missing key is a compile error.
- **No magic numbers.** Put tunable values in `src/config/constants.ts`.
- **Routes come from `src/config/routes.ts`.** Do not hard-code paths.
- **Content changes go through the schema** in `src/content/schema.ts`. If you add a field, update the schema, the types, the repository mapping and the tests.
- **Accessibility is a requirement**: semantic elements, labelled controls, `aria-hidden` on decorative icons, visible focus. ESLint runs `jsx-a11y`.
- **Tests accompany behavior.** New logic gets a unit test; new user flows get an integration test using Testing Library queries by role.
- Formatting is enforced by Prettier (`npm run format`). Do not hand-format.

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

Do not open a public issue for vulnerabilities. Contact the maintainer privately through the email listed on their GitHub profile.
