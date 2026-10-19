# Screenshots

The root [`README.md`](../../README.md) links to the files listed below. Capture them
and drop them in this folder using the exact file names so the links resolve.

## How to capture

1. Build and serve the production bundle (the service worker is only active in a
   build, so screenshots match what reviewers will open):

   ```bash
   npm run build
   npm run preview
   ```

2. Open the preview URL in a browser and use DevTools device toolbar to set each
   width.
3. Toggle the OS/browser theme (or DevTools > Rendering > Emulate
   `prefers-color-scheme`) for the dark variants.
4. Capture the viewport (not the full page) so the framing stays consistent.

## Required files

| File | Width | Theme | Notes |
| --- | --- | --- | --- |
| `320px-light.png` | 320px | Light | Narrow phone; card fills the width, no horizontal scroll |
| `768px-light.png` | 768px | Light | Tablet; quote card centered at max width |
| `1280px-light.png` | 1280px | Light | Desktop; hero card plus favorites grid |
| `1280px-dark.png` | 1280px | Dark | Same as above in dark theme |
| `favorites.png` | 1280px | Light | Two or three saved quotes with the header count |

Optional extras: `landscape-short.png` (short landscape viewport) and
`reduced-motion.png` (with reduced motion enabled).

## Tips

- Prefer PNG; 1x or 2x device pixel ratio both look fine.
- Keep the window chrome out of the frame.
- If you change the UI, re-capture every screenshot in one pass so the set stays
  visually consistent.
