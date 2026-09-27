# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## This repository is studeja.lv

The files above come from **Lumos for Astro**, the framework this site was
scaffolded from, and are kept close to upstream so `/lumos-upgrade-version` can
merge future releases. The project itself is **studeja.lv**, the site for
STUDEJA, a Latgale-based music and events collective. Site-specific rules live
here rather than in `AGENTS.md`, `README.md` or `LUMOS.md`.

- All copy is Latvian (`<html lang="lv">`, `SITE_LOCALE` `lv-LV`), with some
  Latgalian. The client-approved copy and brand brief are in
  `reference materials/STUDEJA-majaslapas-satura-uzmetums.md`. The company's real
  details (registration no., contacts, address, and which block goes on which
  page) are in `STUDEJA-vispariga-un-juridiska-informacija.md`. Take copy from
  these instead of inventing it.
- Logo originals are in `assets/logos/`. The site uses
  `src/assets/logo/*.svg`, rewritten to `currentColor`.

## Commands

```sh
npm run dev       # or `astro dev --background`, see above
npm run check     # astro check: type-checks every .astro file
npm run build     # static build to dist/
npm run format    # prettier (with prettier-plugin-astro)
node .claude/skills/lumos-build/component-index.mjs [Name|--names]  # component props/slots from source
```

There are no tests. CI (`.github/workflows/ci.yml`) runs `npm run check` and
`npm run build` on Node 22, so both must pass. Deploys are an assets-only
Cloudflare Worker serving `dist/` (`wrangler.jsonc`). Its `name` and route are
still the framework's placeholders.

## Architecture

- **Pages.** `src/pages/index.astro` is the live homepage (v2): full-screen
  sections from `src/components/Content/Section*V2.astro`. Earlier designs live
  in `src/pages/legacy/`. Every non-public route goes in `NOINDEX_ROUTES` in
  `src/consts.ts`. That list drives both the sitemap filter
  (`astro.config.mjs` → `isNoindexRoute` in `src/utils/seo.ts`) and the robots
  meta tag, so the two always agree.
- **Layout.** `BaseLayout.astro` takes a `nav` prop (`"v1"` → `Nav`,
  `"v2"` → `NavV2`) and always mounts `ScrollReveal` (fade-up on scroll) and
  `Atmosphere` (the single rAF pointer loop that publishes `--pointer-nx` /
  `--pointer-ny` on the root, plus grain via `[data-grain]`).
- **Search.** `SEARCH_INDEX` in `src/consts.ts` is the whole search corpus.
  Entries link to section anchors (`/#koncertprogrammas`, `/#buj`, …), so a
  section keeps its `id` for as long as an entry points at it.
- **Styles.** `src/styles/global.css` declares
  `@layer base, patterns, components, utilities`. Brand tokens are in
  `base.css`: `--sand-300` `#E1DCD6`, `--ink-900` `#141617`, `--green-600`
  `#1C5755`, with every other step mixed from these. `--field-green`
  `#123d3b` is the v2 page surface. Component CSS goes in the component's own
  `<style is:global>` under `@layer components`.
- **Fonts** load through Astro's `fonts` config. Capriola (`--font-display`)
  ships only weight 400, so heading weight is drawn with `--display-stroke`
  and font synthesis stays off. Instrument Sans (`--font-body`) has real
  weights.

## Design rules the user set

- The site is dark-first. It deliberately overrides the brief's light palette
  split and its light-button-on-dark rule.
- `Button.astro` has exactly two kinds, `main` and `link`. Do not add a third.
  To override a button's padding, set `--_pad-inline`, not `padding`.
- `#1C5755` never sets type on the dark ground (2.4:1). Readable green uses
  `--green-400`. Measure every new colour pairing's contrast instead of
  estimating it.
- Motion is restrained: adding an attention-grabbing effect means removing
  one. Motion honours `prefers-reduced-motion`, and the site has no visible
  pause or motion toggle.
