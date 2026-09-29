# Design system: "Blueprint Editorial"

Every page is a sheet in a set of technical drawings. The sheet is laid out like a Swiss editorial page: oversized type, asymmetric grids and a lot of white space. On top of that it uses the vocabulary of engineering drawings: graph paper, numbered sheets, hairline rules, crop marks, a title block, revision tables and approval stamps. The reasoning is recorded in [ADR 22](decisions.md#adr-22-the-blueprint-editorial-visual-system) and the motion stack in [ADR 21](decisions.md#adr-21-a-motion-system-css-for-the-first-viewport-gsap-and-lenis-for-scroll).

## Tokens

All tokens live in `src/styles/tokens.css`. Runtime values are defined in `:root` and `.dark`, and `@theme inline` exposes them as Tailwind utilities.

| Token | Light: blueprint paper | Dark: night cyanotype | Use |
| --- | --- | --- | --- |
| `background` | warm paper `hsl(40 23% 97%)` | ink blue `hsl(236 30% 7%)` | Page |
| `foreground` | near-black ink | bone | Text |
| `brand` | violet ink | light violet | Accents, sheet numbers, active states |
| `accent` / `accent-text` | signal cyan (fills) / deep cyan (text) | signal cyan | Annotations, signals |
| `border` / `border-strong` | hairline / ink | hairline / bone | Rules, frames |
| `grid-minor` / `grid-major` | 16 px and 80 px graph paper | same, cyan-tinted | `bp-grid` backdrop |
| `signal` | violet → cyan gradient | same, brighter | Signal line and reading progress only |
| `success`, `warning`, `destructive` | AA on paper | AA on ink | Callouts and form states |

Radius is 2 px everywhere, rules are 1 px and there are no soft shadows.

## Typography

| Role | Family | Utility |
| --- | --- | --- |
| Display (hero name) | Sora, 700 | `text-display`: `clamp(3.4rem, 12.5vw, 12.5rem)`, line height 0.86 |
| Page titles | Sora, 600 | `text-headline`: `clamp(2.6rem, 7vw, 7rem)` |
| Section titles | Sora, 600 | `text-title`: `clamp(2rem, 4.6vw, 4.25rem)` |
| Lead paragraphs | Inter | `text-lead`: `clamp(1.2rem, 1.9vw, 1.6rem)` |
| Body | Inter | 17 px base, line height 1.6, measure of 68 characters |
| Annotations | JetBrains Mono, uppercase, tracked | `annotation` |

## Layout and primitives

- `sheet` is the page gutter: `max-width: 96rem`, with padding of `clamp(1rem, 4vw, 3.5rem)`. Content hangs off a 12-column grid.
- Sheet numbers follow the navigation (`SHEETS` in `config/constants.ts`): 00 Home, 01 Projects, 02 Pills, 03 About, 04 Contact.
- Utilities in `src/styles/utilities.css`: `annotation`, `bp-grid` (+ `bp-grid-fade`), `signal-line`, `outline-text`, `draw-underline`, `stretched-link`, `focus-ring`.
- Components in `src/components/blueprint`:
  - `CropMarks`: corner registration marks.
  - `SectionHeading`: numbered label, a rule that draws, and a title that rises line by line.
  - `TitleBlock`: a labelled facts table.
  - `CapabilityMap`: the skills as a system diagram, from `about.json`.
  - `Stamp`: an approval stamp.
- The page header is `PageHero` in `src/components/content/HeroSection.tsx`.
- The z-index scale is 30 (header), 40 (overlays) and 50 (skip link). The mobile menu is a modal `<dialog>` in the top layer.

## Motion

All values come from `src/config/motion.ts` and are mirrored as CSS variables in `src/styles/motion.css`.

| | Values |
| --- | --- |
| Durations | instant 120 ms · fast 200 ms · base 420 ms · slow 800 ms · epic 1200 ms (nothing longer) |
| Easing | `expo.out` / `cubic-bezier(.16,1,.3,1)` for arrivals, `power3.inOut` for state changes, linear for scrubbed scroll |
| Stagger | characters 28 ms, lines 80 ms, items 80 ms, capped at 6 items |
| Scroll reveals | start when an element's top crosses 85 % of the viewport; they play once |

Each kind of motion has one owner:

| Owner | What it animates |
| --- | --- |
| CSS | Everything in the first viewport (plays before hydration): `SplitHeadline`, `.reveal`, `.draw-on-load`, `.grow-on-load`, and the hover and focus states |
| GSAP | `ScrollReveal`, `RevealText` (SplitText), `CapabilityMap` (scrubbed), the mobile menu timeline, `useFlip` (project filters), `useMagnetic`, the hero parallax, the project index preview, and reading progress |
| Lenis | Wheel smoothing with a fine pointer only (`MotionProvider`) |
| View Transitions | Page changes, the project cover and title morph, and the theme switch's circular reveal |
| WebGL 2 | The hero graph paper, with its pointer lens and scan line (`features/home/hero`) |

Signature moments:

1. **Hero schematic.** The real skill groups are drawn as a system: frontend → backend → data & AI, with a DevOps delivery bus underneath. The schematic draws itself, signal pulses travel along it, and the layers drift with the pointer.
2. **Work index.** Project titles are set large. With a mouse, the hovered or focused project's cover floats beside the list; on touch screens the covers appear inline.
3. **Sheet to case study.** The project card's cover and title morph into the case-study header.
4. **Capability map.** It assembles with the scroll: first the bus, then the nodes, the layers and the tools.
5. **Closing.** An oversized invitation, magnetic calls to action, and a footer drawn as the final title block of the sheet.

### Reduced motion

With `prefers-reduced-motion: reduce`:

- CSS animations settle at their end state.
- The signal pulses are removed.
- GSAP reveals, parallax, magnets and the menu timeline are skipped.
- Lenis does not start.
- The WebGL field never loads.
- Page and theme transitions become instant.

Prerendered content is complete without JavaScript, and scroll reveals only hide what is below the fold at hydration.

## References

The direction was informed by developer and studio sites featured as Awwwards Sites of the Day in September 2026. They are system-style portfolios with editorial type, oversized indices and pointer-driven previews.

Inspecting those sites in a browser was limited: several open behind WebGL preloaders that the automated browser could not get past. The concept therefore draws mostly on the vocabulary of technical drawings rather than on any single site.

We deliberately avoided three things: custom cursors that hide the system cursor, long preloaders, and horizontal scroll hijacking on phones.
