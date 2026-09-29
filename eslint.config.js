import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Architectural boundaries (see docs/architecture.md).
 *
 *   domain  <-  lib, config  <-  services, i18n  <-  content  <-  components  <-  features  <-  app
 *
 * A layer may only import from layers to its left. Features expose a public API through their
 * `index.ts`; other code must not reach into a feature's internals.
 */
const restrict = (...patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

const LAYERS = {
  app: '@/app/**',
  features: '@/features/**',
  components: '@/components/**',
  content: '@/content/**',
  i18n: '@/i18n/**',
  lib: '@/lib/**',
  config: '@/config/**',
  services: '@/services/**',
  theme: '@/theme/**',
};

const forbid = (layers, message) => ({
  group: layers.map((layer) => LAYERS[layer]),
  message,
});

const featureInternals = {
  group: ['@/features/*/*'],
  message: 'Import a feature through its public API (`@/features/<name>`), not its internals.',
};

export default defineConfig(
  globalIgnores([
    'dist',
    'build',
    'coverage',
    '.react-router',
    'playwright-report',
    'test-results',
    '.lighthouseci',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      // Type-aware rules catch whole classes of bugs (floating promises, unsafe any, needless checks).
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      // A labelled group may be focusable: scrollable code blocks need keyboard access.
      'jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['tabpanel', 'group'], tags: [] }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Numbers in template literals are safe and read better than String(n).
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Arrow shorthand for event handlers and callbacks (`onClick={() => setOpen(true)}`) is idiomatic.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    },
  },

  // --- layer boundaries (tests and test helpers may import from anywhere) ---
  {
    files: ['src/domain/**'],
    rules: restrict({
      group: ['@/**'],
      message: 'The domain layer must not depend on other layers.',
    }),
  },
  {
    files: ['src/lib/**', 'src/config/**'],
    rules: restrict(
      forbid(
        ['app', 'features', 'components', 'content', 'services', 'theme', 'i18n'],
        'lib and config sit directly above the domain and below every other layer.',
      ),
    ),
  },
  {
    files: ['src/i18n/**'],
    rules: restrict(
      forbid(
        ['app', 'features', 'components', 'content', 'services', 'theme'],
        'i18n must not depend on the UI, content, service or theme layers.',
      ),
    ),
  },
  {
    files: ['src/services/**'],
    rules: restrict(
      forbid(
        ['app', 'features', 'components', 'content', 'i18n', 'theme'],
        'Services are infrastructure: they may only depend on the domain, lib and config layers.',
      ),
    ),
  },
  {
    files: ['src/content/**'],
    rules: restrict(
      forbid(
        ['app', 'features', 'components', 'services', 'theme'],
        'content must not depend on the UI, service or theme layers.',
      ),
    ),
  },
  {
    files: ['src/theme/**'],
    rules: restrict(
      forbid(
        ['app', 'features', 'components', 'content', 'i18n', 'services'],
        'The theme layer may only depend on the domain, lib and config layers.',
      ),
    ),
  },
  {
    files: ['src/components/**'],
    rules: restrict(
      forbid(
        ['app', 'features'],
        'Shared components must not depend on features or the app shell.',
      ),
    ),
  },
  {
    files: ['src/features/**'],
    rules: restrict(
      forbid(['app'], 'Features must not depend on the app shell.'),
      featureInternals,
    ),
  },
  {
    files: ['src/app/**'],
    rules: {
      ...restrict(featureInternals),
      // Route modules export `meta`, `links`, `clientLoader` and friends next to their component;
      // the React Router plugin handles hot reloading for them.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'no-restricted-imports': 'off',
      // Tests index into fixtures they have just asserted on, and pass mock methods to expect().
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  {
    // Plain JavaScript files are not part of a TypeScript project, so they get no type-aware rules.
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
  },
  {
    files: ['**/*.config.{js,ts}', 'scripts/**'],
    languageOptions: { globals: globals.node },
  },
  prettier,
);
