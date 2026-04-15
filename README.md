# PHYS Extra Credit Study Guide

Static Vite + TypeScript study website for University Physics 1 final prep.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

`vite.config.ts` is configured with `base: './'` and multi-page inputs for:
`index.html`, `study-guide.html`, `formula-sheet.html`, `practice.html`,
`simulators.html`, `flashcards.html`, `tools.html`, and `resources.html`.

The repo also includes `.github/workflows/deploy.yml` to build and publish the site from the `main` branch.
