# Portfolio Presentation Template

An interactive, single-page template for presenting design case studies. One
continuous scroll — hero, bio strip, chapter index, closing — where clicking a
chapter card FLIP-zooms into a full-screen chapter containing a narrative and
working interactive mini-prototypes of the designs being discussed.

Built as a static site. No framework.

## Stack

- **Vite** — build and dev server
- **GSAP** (ScrollTrigger + Flip) — chapter zoom and scroll-driven motion
- **Lenis** — smooth scrolling
- Vanilla JS and CSS otherwise

## Run

```bash
npm install
npm run dev
```

`npm run build` outputs to `dist/`. `npm run preview` serves the build.

## Structure

```
src/
  data/chapters.js   all chapter content — copy, imagery, demo wiring
  demos/             the interactive mini-prototypes
  styles/            tokens.css holds the design tokens
  main.js            entry
  motion.js          GSAP timelines and the FLIP chapter transition
  render.js          templating
  grid.js            pointer-reactive background grid
  fit-text.js        headline fitting
public/stills/       screenshots used inside chapters
```

All content lives in `src/data/chapters.js`, so adapting this to a different
set of case studies means editing one file.
