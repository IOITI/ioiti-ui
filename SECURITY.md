# Security

## Reporting a flaw

A flaw of ioiti-ui that puts an application made with it at risk (a component that draws as HTML what it is given,
the theme script or the Vite plugin doing more than they say, a dependency's advisory that reaches an application)
is reported privately: **Report a vulnerability**, under the repository's Security tab
(https://github.com/IOITI/ioiti-ui/security/advisories/new). Never in an issue or a pull request, which anyone reads.

Say what is at risk, in which version (its tag), and how to see it happen. A report is answered within a week. The
fix is a new version, whose CHANGELOG says under Security what it mends once an application can install it.

## The versions mended

The latest. An application moves to it, its CHANGELOG's Upgrading saying how; before 1.0, no older line is kept.

## What the package holds to

- **Nothing from another origin, no inline script, no font as a `data:` URI**: a strict Content-Security-Policy holds
  (the README says which), and `check:package` builds the template with the package to check it on every change.
- **What an application gives a component is drawn as text**: React escapes it, and no component writes HTML from
  it (`scripts/check-source.mjs` refuses raw HTML but the two fixed style sheets of ActivityHeatmap and the 404).
- **What an application installs with it is audited**: CI checks the package's dependencies against npm's
  advisories.
