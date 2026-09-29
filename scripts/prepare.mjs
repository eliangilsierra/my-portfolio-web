// Installs the git hooks (see lefthook.yml) for local clones.
// Skipped in CI and in environments without a .git directory (for example a tarball install).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (process.env.CI || !existsSync('.git')) {
  process.exit(0);
}

try {
  execFileSync('npx', ['--no-install', 'lefthook', 'install'], { stdio: 'inherit', shell: true });
} catch {
  console.warn('prepare: could not install git hooks; run "npx lefthook install" manually.');
}
