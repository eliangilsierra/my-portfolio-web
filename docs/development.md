# Development guide

## Prerequisites

- Node.js 20 or newer (`.nvmrc` pins the version used in CI)
- npm (the only supported package manager; commit `package-lock.json`)

```bash
npm ci
npm run dev
```

## Everyday commands

| Task                         | Command                |
| ---------------------------- | ---------------------- |
| Start the dev server         | `npm run dev`          |
| Run all checks CI runs       | `npm run format:check && npm run lint && npm run typecheck && npm test && npm run build` |
| Format everything            | `npm run format`       |
| Watch tests                  | `npm run test:watch`   |
| Preview the production build | `npm run build && npm run preview` |

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
3. If you add gallery images, add one entry per image to `galleryAlts` in **each** locale.
4. Run `npm test`. Schema errors name the exact path, for example `projects.3.translations.es.content`.

Allowed `type` values live in `PROJECT_TYPES` in `src/content/schema.ts`. Slugs must be lowercase kebab-case and unique.

### A new pill

Add an entry to `src/content/data/pills.json` with `slug`, an ISO `date` (`YYYY-MM-DD`), `tags` and both translations. Ordering is by date, newest first.

### Content blocks

| Block     | Fields                                          |
| --------- | ----------------------------------------------- |
| `h2`, `h3`, `p` | `text`                                    |
| `ul`      | `items` (non-empty array of strings)            |
| `callout` | `text`, `variant`: `info`, `warning` or `success` |
| `code`    | `text`, optional `language`                     |

Text is rendered as plain text. Do not put HTML in it.

## Adding a language

1. Add the code to `LOCALES` in `src/i18n/locale.ts`, plus its `INTL_LOCALE` and `LOCALE_NAMES` entries.
2. Create `src/i18n/dictionaries/<code>.ts` typed as `Dictionary` and register it in `dictionaries/index.ts`.
3. Add the language to the `localized(...)` helper in `src/content/schema.ts` and translate every JSON entity.

The compiler and the schema will point at anything you missed.

## Adding a UI string

Add the key to `src/i18n/dictionaries/en.ts`, then to `es.ts`. Use it through `const { t } = useI18n()`. Interpolated strings are functions, for example `t.footer.copyright(year, name)`.

## Connecting a real contact provider

1. Implement `ContactService` (`send(message): Promise<void>`) in `src/features/contact/`, for example calling a form service or a serverless endpoint.
2. Export it as the default `contactService` in `contact-service.ts`.
3. If it needs a public key or URL, add a `VITE_…` variable, declare it in `src/vite-env.d.ts`, document it in `.env.example` and the README, and remove the demo notice from the dictionaries.

Never put private API keys in a `VITE_` variable: they are bundled into public JavaScript.

## Testing conventions

- Use `renderApp({ route, locale })` for flows and `renderWithProviders(<Component />)` for isolated components (`src/test/render.tsx`).
- Query by role and accessible name; avoid test IDs.
- Inject fakes through props (for example `ContactPage`'s `service`) instead of module mocking.
- `IntersectionObserver` and `matchMedia` are stubbed in `src/test/setup.ts` because jsdom lacks them.

## Troubleshooting

| Symptom                                              | Cause and fix                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| App is blank after editing JSON                      | A schema error was thrown at load. Check the browser console or run `npm test`.                |
| Assets 404 after `npm run preview` with a base path  | `vite preview` also reads `VITE_BASE_PATH`; pass the same value you built with.               |
| Base path becomes `C:/Program Files/Git/…` on Windows | Git Bash rewrites leading slashes. Prefix the command with `MSYS_NO_PATHCONV=1`.               |
| `npm install` fails with a Vitest peer error         | Vitest 5 requires Vite 6+. The project pins Vitest 3 (see ADR 7).                              |

## Releasing

1. Update `CHANGELOG.md` and the version in `package.json`.
2. Merge to `main`; the deploy workflow publishes the site.
3. Tag the release: `git tag v<version> && git push --tags`.
