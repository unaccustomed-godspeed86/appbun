# Contributing

## Setup

```bash
bun install
bun run check
bun run test
bun run build
```

## What to work on

Useful contribution areas:

- icon extraction quality
- generated shell polish
- Windows and Linux packaging
- generated app ergonomics
- docs, examples, and onboarding

## Before opening a PR

- keep changes focused
- run `bun run check`
- run `bun run test`
- update docs if behavior changes
- prefer improving generated output over adding flags unless the behavior truly needs to vary

## Design bar

`appbun` should feel closer to a productized generator than a thin script.

That means:

- generated apps should look intentional
- defaults should be clean enough to ship
- packaging flows should reduce manual work
- README and examples should help new contributors move fast
