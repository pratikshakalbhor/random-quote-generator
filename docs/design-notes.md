# Design inspiration notes

Longer-form reasoning behind the visual and interaction design. The short version
lives in the root README.

## Intent

The app has exactly one job: show a single quote, and let you ask for another. The
design pushes every other concern — favorites, metadata, chrome — out of the way of
that one act.

## Typography

- Quotes are set in a **serif** (`Georgia`, with `Times New Roman` fallback), while
  UI text uses the **system sans** stack. The contrast signals "this is a quotation,
  not interface copy" without shipping a webfont.
- Quote size uses `clamp(1.25rem, 0.95rem + 3vw, 2rem)` so a single rule covers
  320px through desktop: readable on a phone, generously sized on a monitor, no
  breakpoint to maintain.
- Line height sits at `1.35` — tighter than body text, which keeps multi-line quotes
  feeling like a block rather than a paragraph.
- Headings and quote text opt into `text-wrap: balance` / `pretty` where supported
  so short quotes do not leave a single orphaned word on the last line.

## Palette

- One accent (indigo `#6366f1`) does all the work: the primary button, the focus
  ring, the saved-favorite state. Everything else is a neutral scale.
- Surfaces are strictly layered (page → card) with a 1px border **plus** a soft
  shadow. The border keeps the card legible when the shadow is subtle; the shadow
  keeps it from looking flat when the background is close in value.
- Genre chips use a tinted background of the same accent family, so the tag reads as
  metadata rather than a second call to action.

## Theme

- Everything is expressed as tokens in `:root` and re-declared under
  `@media (prefers-color-scheme: dark)`. No component knows which theme is active.
- `color-scheme` is set in both branches so form controls, scrollbars, and the
  browser's own chrome match the page.
- Dark mode is not an inverted light mode: the accent lightens (`#818cf8`) and the
  shadow deepens to keep contrast and depth in a low-luminance environment.

## Motion

- Motion exists to explain a change of state, never to decorate. A quote change
  fades and slides (200ms out, swap, 200ms in).
- The card's height is measured and frozen for the duration of the swap, so the
  layout never jumps and the button never moves out from under the cursor.
- `prefers-reduced-motion` removes the animation *and* the delay — the quote simply
  swaps, because a delayed swap with no animation is still a worse experience.

## Layout

- One `40rem` content column. Long measure hurts readability, and a quote is the
  worst place to get it wrong.
- Breakpoints are width-agnostic: `max-width: 360px` tightens padding for compact
  phones, `min-width: 48rem` (768px) switches the favorites list to two columns,
  and `max-height: 26rem` in landscape reclaims vertical space.
- Interactive targets are at least `44px` in both dimensions.

## Restraint

No illustrations, no gradients, no icon library, no animation library, no webfont
request. The only dependency doing UI work is React. That keeps the bundle small and
the aesthetic coherent.
