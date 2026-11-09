# Reference audit — 19 October 2026

## Evidence and limits
Reference: https://thomasmamfredas.com/ and its linked `/weddings`, `/commercial`, `/works`, `/stories`, `/contact` pages. HTML, CSS and main motion modules were downloaded for inspection under `audit/source/`. The supplied PDF has three A4 pages and captures the home page with page breaks, rather than recording motion. No document text was treated as an instruction. Browser control could not connect in this environment; motion timings below come from source inspection. Exact timing, pointer physics, all responsive breakpoints, and visual parity across every project detail have **not** been verified against a live reference browser. This is a working first implementation, not a certified exact reproduction.

## Home composition
1. Fixed/absolute small monogram at top left, small uppercase two-stack navigation at top right. Mobile collapses to Work/Menu controls.
2. Viewport-height grayscale hero film, cover crop, dark scrim. Name at lower left and short right-aligned biography at lower right. Source display title: 8vw, maximum 7.5rem, 900 weight, .95 line height. John uses one line because only a first name is available.
3. About section: 140px top spacing, centered narrow editorial width, portrait at upper left, right-aligned three-line heading. Uppercase supporting text; asymmetric 7:5 film composition, grayscale by default.
4. Image cloud: WebGL perspective scene, scattered media at varying depths. Dark background; introductory copy at left. Drag pans the scene; mouse controls and damping are part of the interaction.
5. Selected work: large Work link, preview on the left, project/client/category rows on the right. Hover or focus changes preview. Original rows are real Thomas projects; the build uses explicitly illustrative John projects rather than attributing Thomas's clients to John.
6. Pale interlude between work and footer.
7. Contact/footer: large Let's Talk heading and inquiry links on left, infinitely scrolling film columns on right.

## Motion inventory
| Element | Reference source evidence | Build implementation / remaining difference |
|---|---|---|
| Initial loader | 3×3 tiles; square grid `min(86vmin,720px)`, 18px gap; 14 images; random tile replacements at nominal 10Hz, 0.18s fade and small y jitter | Same grid/assets and 100ms swaps; deterministic sequencing; fixed 1.4s demonstration duration rather than original load-event gate |
| Loader pulses | 1.4s alternating 1.01–1.05 scaling | 1.4s pulse, smaller 1.035 amplitude |
| Reveal sweep | White difference-blended scrim, `power3.inOut`, .45s; grid/scrim fade .25s | GSAP .45s sweep and .25s fade |
| Smooth scrolling | Lenis included | Lenis 1.15s smoothing with GSAP ticker; reduced-motion bypass |
| Hero scroll | Scaler wrappers, perspective and viewport-sized film | ScrollTrigger scale .94 and y parallax; reference exact trigger curve remains unverified |
| Menu | Large index/category/type navigation; .5s opacity/translation transitions in source | .65s clipped full-screen panel, keyboard dismissal and focus containment; exact reference choreography differs |
| Media | Grayscale source media; press-and-hold color flood present in cursor source | Grayscale-to-color hover; hold-to-color flood is not yet reproduced |
| Custom cursor | Ring, tail, dot, icon label; spring/damping, .14–.28s fades; long-hold behavior | Difference-blended ring with hover expansion; tail, icon vocabulary and long-hold flood remain unimplemented |
| Photo cloud | Three.js, 60° perspective, camera distance 900, min 140, pan clamp ±900, damping .08; scattered 3D media, focus/recenter logic | Three.js scene, 60° camera at 900, damping .08, bounded pan, depth/fog, project click; deterministic layout. Original focus/zoom choreography and complete image set not duplicated |
| Work previews | Dual-layer .45s crossfade with scale 1.03?1, power2 easing; video/image depending on input | .45s image crossfade and scale; keyboard focus selects preview; full video preview parity pending |
| Film roll | Two opposing infinite DOM tracks rendered into WebGL; easing .07, wheel .30, drag 1.3; RGB split .012, barrel .08, speed-gated bell deformation max .9 | Two opposing WebGL columns, .07 smoothing, .30 wheel, 1.3 drag, .012 RGB split, bell bending and .9 clamp; barrel and original video texture mapping differ |
| Mobile / reduced motion | Multiple breakpoints and coarse-pointer-specific logic | Responsive layouts, touch pan, reduced-motion static fallbacks, standard visible links for keyboard access |

## Route and interaction map
- `/`: home narrative, About anchor, cloud project links, selected work links, inquiry links.
- `/weddings`: wedding service narrative, alternating portrait/film media and wedding work.
- `/commercial`: commercial service narrative, alternating imagery/film, commercial work.
- `/works`: full project index. Original has 33 projects and loading/filter mechanics. Build has 7 illustrative entries and category filters; not all 33 reference detail pages were cloned.
- `/stories`: original has 3 story items and links to `/work/...`; build provides 3 illustrative stories using the same project-detail route family.
- `/contact`: original is mostly contact/inquiry destinations. Build connects it to a real booking workflow rather than the original person's mailto/phone details.
- `/work/[slug]`: 7 project pages, film viewing with native playback controls, mute and close controls, project inquiry link.
- Added `/book`: 3 steps (project/date/location, contact details, story/review), validation, demo success reference or server persistence.
- Added `/dashboard`: studio login when connected, booking list, search, status filters, detail view, approval/decline/reset, editing, reversible archive/restore, CSV export, honest payment connection state.
- Original external Instagram, telephone, maps and designer credits are not republished as John's identity. Actual contact/social details are outstanding.
- Original generic theme footer contains unrelated architecture business details; these were excluded intentionally.

## Bachs link
The downloaded https://bachs.io/pricing page describes a payments/billing product. The user has not confirmed whether this is the intended provider. No endpoint, webhook signature format, settlement currency or credentials were assumed. See `docs/INTEGRATIONS.md`.

## Assets
Local files in `public/media/` were sourced from the Thomas reference solely as temporary reference assets for this build. They must be replaced with John's licensed photography/films before public launch. Exact source mapping is in `download_media.py` plus the hero and portrait URLs noted in README. Project names and descriptions are illustrative; no testimonials, client counts, awards or package prices were fabricated.
