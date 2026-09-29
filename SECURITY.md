# Security policy

## Supported versions

Only the latest release on `main` receives security fixes. The site is static, so there is nothing to patch on a server: a fix is a new deployment.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Use GitHub's private reporting instead: open the repository's **Security** tab and choose **Report a vulnerability**. If that is not available, contact the maintainer through the email listed on their GitHub profile.

Include:

- what you found and where (URL, file or dependency),
- steps to reproduce or a proof of concept,
- the impact you expect.

You can expect an acknowledgement within a few days and a status update once the report has been assessed. Reports are handled on a best-effort basis by a single maintainer.

## Scope

In scope: the published site, the source in this repository, the build and deployment workflows, and the dependencies that ship to visitors.

Out of scope: findings that need a compromised browser or device, missing security headers that GitHub Pages does not let a project set (the site ships a `Content-Security-Policy` meta tag instead), and vulnerabilities in development-only tooling that cannot reach the published site (report those upstream).

## How the project reduces risk

- Content is rendered as plain text; the code never injects HTML from data.
- `npm audit --omit=dev` runs in CI and fails on moderate or higher advisories in production dependencies.
- CodeQL analyses the code on every push and weekly.
- Dependabot proposes dependency updates weekly.
- GitHub Actions run with read-only permissions unless a job needs more.
