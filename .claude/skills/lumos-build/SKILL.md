---
name: lumos-build
description: Build or change a page, section, component or style in a Lumos for Astro site. Use when adding a page or a section, picking a component or a variant, choosing between a prop and a utility class, writing CSS, reaching for a token, theme or breakpoint, or working out why a style is not winning.
---

# Building with Lumos for Astro

Lumos is a component and styling framework for Astro: design tokens, four
cascade layers, a set of utility and pattern classes, and a component library
that is already accessible. It is copied into the project rather than
installed, so everything here is a file you can open.

This is how the system works and how to work inside it. [LUMOS.md](../../../LUMOS.md)
is the other half: the checklists a new style or component has to pass before
it is accepted. Read this to build; read that before you call it done.

Full documentation: <https://lumosframework.com/docs/>. It is versioned — check
`version` in `package.json` and use the picker in the site header if the
project is behind.

## Look before you write

The library is the first answer to almost every question, and it is larger than
it looks. Before writing markup, print it:

```bash
node .claude/skills/lumos-build/component-index.mjs          # every component, its props and slots
node .claude/skills/lumos-build/component-index.mjs Grid     # one component, with its tooltips
node .claude/skills/lumos-build/component-index.mjs --names  # just the import lines
```

It reads `src/components`, so it cannot go stale the way a table in a document
does. Everything else worth knowing is in four files:

| Looking for | Open |
| --- | --- |
| Tokens, themes, the reset | `src/styles/base.css` |
| Multi-property classes components share | `src/styles/patterns.css` |
| Every single-property class | `src/styles/utilities.css` |
| Cascade order | `src/styles/global.css` |

`BaseHead` takes `SeoProps` from `src/types.ts`; site name, description, URL,
locale and the noindex routes are in `src/consts.ts`.

## The shape of a page

Nearly every page is the same components nested in the same order. Building one
is choosing variants, not constructing scaffolding.

```
BaseLayout         the document, head, nav, main, footer
  Section          a full-width band: its background, its vertical rhythm
    container      centred, capped, gap between children  (automatic)
      ContentWrapper   how that content is arranged
      Grid             or a grid of repeated things
```

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Section from "@/components/Wrapper/Section.astro";
import ContentWrapper from "@/components/Wrapper/ContentWrapper.astro";
import Grid from "@/components/Wrapper/Grid.astro";
import Heading from "@/components/Typography/Heading.astro";
import Paragraph from "@/components/Typography/Paragraph.astro";
import Img from "@/components/Media/Img.astro";
import Card from "@/components/Item/Card.astro";
import photo from "@/assets/graphics/photo.jpg";
---

<BaseLayout title="Home" theme="dark">
  <!-- Hero -->
  <Section paddingTop="large">
    <Heading tag="h1" variant="display">A headline</Heading>
    <Paragraph variant="large" maxWidth={38}>A sentence under it.</Paragraph>
  </Section>

  <!-- Introduction -->
  <Section theme="light">
    <ContentWrapper variant="columns">
      <Heading tag="h2">Two columns</Heading>
      <Paragraph>Text on the left, a visual on the right.</Paragraph>
      <Img slot="column2" src={photo} alt="" />
    </ContentWrapper>
  </Section>

  <!-- Features -->
  <Section>
    <Grid xsmall={1} medium={3}>
      <Card heading="One" text="…" />
      <Card heading="Two" text="…" />
      <Card heading="Three" text="…" />
    </Grid>
  </Section>
</BaseLayout>
```

`@/` means `src/`. Components sit in folders by what they do — `Wrapper`,
`Typography`, `Media`, `Item`, `Form`, `Interactive`, `Global`, `Utility` — so
the import path carries the folder. A comment naming the section is the only
comment a page gets.

**Never add a container.** `Section` renders one, centred and capped. Style it
through `containerClass` and `containerAttrs` if it needs anything.

**Three kinds of space are already handled.** Reaching for a margin usually
means one of them is set wrong:

- Between sections — `paddingTop` and `paddingBottom` on `Section`, as
  `none`, `even`, `small`, `medium`, `large` or `navoverlap`, never numbers.
- Between a section's children — the container's `gap` prop.
- Between a heading and the paragraph under it — the text style's own margins,
  part of the type scale.

## Themes are classes, not a setting

`theme-light`, `theme-dark`, `theme-brand` and `theme-invert` each redeclare the
same tokens, so they apply to a subtree and nest freely: a dark section in a
light page, a brand card inside it, a light panel inside that. Nothing inside
asks what page it is on — a `Button` reads `--button-background` and gets
whatever the nearest theme says.

`BaseLayout`, `Section` and `Card` take a `theme` prop; anywhere else use the
class. `theme-invert` has no colors of its own and flips whatever it lands in —
reach for it when a panel must contrast with a surface you do not control.

A fifth theme has to declare every token the other four do, or components inside
it fall back to the parent's colors.

## Tokens: if you are typing a number, stop

Every color, size and space is a named value in `base.css`, and almost anything
you are about to type already has a name. Change the values there; keep the
names, since the names are what every component reads.

Most tokens are fluid: they interpolate between a minimum and a maximum as the
viewport goes from `--viewport-min` (320) to `--viewport-max` (1440), so nothing
jumps at a breakpoint. Edit the `--space-4-min` / `--space-4-max` pair, never the
`clamp()` built from it.

The families: swatches (raw colors, referenced by themes, never used directly),
`--space-1` … `--space-8` plus `--site-margin` and `--site-gutter`, the text
styles `--display` and `--h1` … `--h6` and `--text-large` / `--text-main` /
`--text-small`, the layout widths, and the border, focus and radius values.

A text style is a set, not a size: `--h2` ships with its own line height,
letter spacing, weight, margins and leading-trim beside it, which is why
`.text-style-h2` makes a heading look right with no adjustment.

A name starting with `--_` is private to the block that set it. It is not part
of the contract and can be renamed in any release, so nothing outside that
block should read one. Use the same prefix for your own component's internals.

## Prop, utility, or a component of your own

- **A prop, if one exists.** Props are decisions the component has already
  made. They are named for intent, checked as you type, and consistent across
  every instance.
- **A utility, for a one-off.** When this instance needs something the
  component has no opinion about.
- **Your own component, when it repeats.** The third time the same handful of
  utilities appear together, that combination is a thing. Name it.

| You want | Do this | Not this |
| --- | --- | --- |
| A dark section | `<Section theme="dark">` | `class="theme-dark"` |
| Less space above a section | `<Section paddingTop="small">` | `class="padding-top-4"`, which breaks the rhythm |
| No margin on one heading | `class="margin-top-0"` | a variant nobody else will use |
| A card that fills its row | `class="flex-grow"` | a wrapper div |
| The same panel on six pages | your own `<FeaturePanel>` | copying the markup |

The test: does the change belong to *this instance* or to *this kind of thing*?
Instance means utility. Kind means a prop, or a component.

## Four layers, in a fixed order

`base` → `patterns` → `components` → `utilities`. A later layer beats an earlier
one whatever the selectors say, so a one-class utility wins over a component's
twelve-selector rule without `!important`. The order is declared on the first
line of `global.css`, before anything is imported, so it holds wherever a
component's styles end up in the output.

Read it as a ladder: `base` sets the ground rules, `patterns` name the shapes
that repeat, `components` style themselves and may override any pattern they
use, `utilities` are the last word for one instance. Something that does not fit
usually belongs one rung up — a pattern repeated in four components wants to be
a pattern; four utilities always used together want to be a prop.

**When a style will not win, check it is inside a layer.** A rule written
outside every layer beats every layered rule regardless of specificity. That is
occasionally useful and usually the bug.

## Writing CSS when nothing covers it

Component styles go in the component's own file, inside both wrappers:

```astro
<style is:global>
  @layer components {
    .hero_grid {
      display: grid;
      gap: var(--space-6);
    }
  }
</style>
```

`@layer components` puts it on the ladder rather than on top of it. `is:global`
keeps Astro from stamping a `data-astro-cid-…` attribute onto every element and
every selector — `block_element` naming is already doing the job that scoping
would do. A page carries no CSS at all.

Class naming, `_wrap` roots, `rem` over `px`, where media queries go: the new
style checklist in [LUMOS.md](../../../LUMOS.md) has the rest, and every box has
to be ticked.

Breakpoints are the ones `Grid` declares — 30rem, 48rem, 64rem, with `xsmall`
as the base below 30rem. Read them from `Grid.astro` rather than from memory,
and if you need another, have a reason. Column counts inherit upwards, so
declare a count only where the design actually changes. The `autofit` and
`autofill` variants take no counts at all: they fit as many columns as the
space allows, from `minColumnWidth`, which means a grid moved into a narrow
column adapts without anyone editing a breakpoint. Prefer them when the item
count is not fixed.

## What every component does, so you can rely on it

- **`render`** — every component takes it. `render={false}` skips the component
  and everything inside it, which keeps a condition next to the thing it
  controls instead of wrapping the markup in a ternary.
- **Empty components remove themselves.** No empty div with padding, no gap in a
  flex column where a CMS field was blank. The check is `slotContent()` from
  `src/utils/slots.ts`, which renders the slot and looks for something visible —
  `Astro.slots.has` is not enough, since a slot holding an expression that
  produces nothing still counts as provided.
- **Named slots are holes with names.** `<Img slot="column2" …>` for
  `ContentWrapper`'s second column, `slot="background"` for `Section`'s.
- **Impossible prop combinations do not typecheck.** `Card`'s image belongs to
  its `cover` and `stacked` variants, `Grid`'s column counts to `columns` and
  its widths to `autofit` and `autofill`, `Button`'s `href` to a link and `type`
  to a button. The editor says so as you type.
- **Mistakes warn rather than break.** A value that types cannot catch logs a
  `[lumos]` line in the dev terminal and falls back to the default. If something
  is not doing what you expect, read that terminal first.
- **`class` and every other attribute are forwarded.** A utility class, an `id`,
  a `data-` or `aria-` attribute all work as they would on a plain element.

Your own components follow the same conventions — see the new component
checklist in LUMOS.md.

## Accessibility: what is handled, what is yours

Handled: visible focus rings sized by token and never removed, the skip link
first in the layout, real `header` / `nav` / `main` / `footer` landmarks,
animation cut to nothing under `prefers-reduced-motion`, `alt=""` by default on
images, and `Button` rendering a `<button>` or an `<a>` depending on whether it
goes anywhere.

Yours, and the framework cannot decide them: **alt text** (describe it if it
carries meaning; leave it unset if it is decoration), **heading order** (`tag`
sets the level, `variant` sets the size — one `h1`, no skipping from h2 to h4
because a smaller size looked better), **link text** (three "Read more"s tell a
screen-reader user nothing), and **contrast** if you changed the swatches.

## Checking the work

```bash
npm run dev      # or `astro dev --background`; see AGENTS.md for managing it
npm run check    # astro check — catches the prop you renamed in one place only
npm run build
```

Then, by hand: tab through the page and make sure everything interactive is
reachable in a sensible order with a visible ring, put the mouse away for a
minute, and zoom to 200% — fluid type holds up, a fixed height you added might
not.
