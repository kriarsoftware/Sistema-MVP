# Security review

Date: 2026-10-20

This review focused on dependency security and the directly related project
configuration. The findings below are based on the dependency manifests and
files present at the time of review. No lockfile or installed dependency tree
was available to audit.

## Findings

### 1. Critical — Next.js version affected by a Windows-hosted RCE advisory

- **Location:** [`apps/web/package.json`](./apps/web/package.json), dependency
  `next` (line 13)
- **Observed version:** `16.2.4`
- **Advisory:** [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36)
- **Confidence:** 8/10

The advisory describes remote code execution for applications using the App
or Pages Router without Cache Components when the server runs on a Windows
filesystem. This project uses the App Router and does not configure Cache
Components. The web package's default `start` script binds to loopback, so
remote reachability depends on deployment or a reverse proxy exposing it.

**Recommendation:** Upgrade Next.js to a patched release (at least `16.3.3`
according to the reviewed advisory information) before hosting on Windows or
exposing the service.

### 2. Medium — No dependency lockfile

- **Location:** [`README.md`](./README.md), line 83
- **Confidence:** 10/10

The project has no `pnpm-lock.yaml` or other package lockfile. Although direct
dependency versions are specified in the package manifests, the transitive
dependency graph is not pinned. Clean installs may therefore resolve
differently, and the exact dependency tree could not be audited.

**Recommendation:** Generate and commit the pnpm lockfile, audit the resolved
dependency tree, and use frozen-lockfile installs for builds and deployments.
