# Secondary pages, pale cover and loading audit - 19 October 2026

## User correction and observed cause
The pale cloud-cover section was opaque in the first implementation. Adding difference blending alone was insufficient because explicit panel z-indexes were inherited by GSAP pin-spacers, isolating the cover from the cloud backdrop. The reference controller relies on DOM stacking order. The explicit indexed z-layer assignment has been removed; the pale `#f0f0f0` panel now difference-blends with the pinned cloud, preserving and inverting the scattered images and introductory text.

The fixed header now follows the source's dark-to-transparent scrim with white links rather than inverting its text to black over the pale cover. Introductory cloud text placement and measure were aligned to the supplied screenshot.

## Loader
The server-rendered initial state contains no tile images. It starts fully black with invisible empty slots, waits500ms, and inserts one successfully decoded image every120ms. Once the grid has populated and the page is ready, it exits after at least2seconds through the existing .45s difference sweep and .25s fade. A7second bound prevents a blocked media/font request from trapping the user. Reduced-motion skips it. Each public route transition remounts the loader; studio dashboard remains immediate.

## Page-by-page findings and changes
| Route | Mismatch found | Updated behavior |
|---|---|---|
| `/` | Pale panel erased cloud; wrong compositing isolation; immediate full image grid | Difference cover preserves inverted cloud; source stacking order and header scrim; dark-first progressive loader |
| `/weddings` | Invented multi-line campaign headline; conventional static intro/diptych; generic grid | Single-word service title and lower biography; source wedding hero assets; pinned left film roll with right Presence narrative; category-filtered Work board; pale transition and simple contact footer |
| `/commercial` | Same static service template | Commercial hero and biography; pinned film roll / Attention narrative; Commercial Work board and plain contact ending |
| `/stories` | Reused Works grid | Three viewport-sized media-left/copy-right story panels with their own project links, stacking transitions and editorial contact ending |
| `/contact` | Large sales headline and image collage | Source-style About and Process editorial panels, followed by media-left/contact-right booking links |
| `/works` | Huge heading and staggered two-column grid | Compact square auto-fill grid, contained rounded tiles, category/title overlays, working category filters, direct detail links; removed unrelated infinite-gallery footer |
| `/work/[slug]` | Playback modal trapped all Tab events on Close | Native video controls and mute button keyboard reachable; bounded focus, Escape, inert background, scroll lock and trigger focus restoration |
| `/book` | No corresponding booking route in original | Existing functional John booking extension preserved; shared loader/header refinements applied |
| `/dashboard` | No corresponding studio route in original | Existing booking CRUD/demo workflow preserved; no portfolio loader added |

## Responsive and interaction evidence
Desktop1920x930 and mobile390x844 captures are under `.impeccable/review/`, with `*-audit-desktop.png`, `*-audit-mobile.png`, service roll captures, `cloud-white-desktop.png`, `loader-dark.png`, and `loader-progress.png`. All five secondary public routes showed document width equal to390px at the mobile viewport. Latest batched capture reported no browser page errors.

`test-page-audit.cjs` verifies actual client-side navigation, service roll movement and cleanup when changing routes, Works filters/detail links, film playback native control keyboard access, modal focus restoration, Stories/Contact section counts and booking navigation. `test-scroll-interactions.cjs` remains the homepage gallery/stack regression check.

## Limits retained
Source code and user screenshots provide the reference evidence. Live connected reference-browser control is unavailable, so this is not a frame-for-frame certification on every device. Seven illustrative John projects remain rather than copying all33 Thomas projects, client claims, personal details or external social destinations. The original Works tile-expansion transition is not duplicated; tiles navigate directly to project detail pages as requested for this booking portfolio. Final licensed media, Supabase and payment dependencies remain documented in INTEGRATIONS.md.

## Completed checks
- Latest desktop/mobile capture batch: no browser page errors; five audited secondary routes have no horizontal overflow at390px.
- `node scripts/test-page-audit.cjs`: PASS for navigation, service roll movement and cleanup, grid filtering/detail routes, native video keyboard focus, Escape/focus restoration, Stories/Contact composition, and booking links.
- Finish reviewer: PASS for the requested visual corrections and tested page interactions. Header hit-testing was corrected to the source's pointer-transparent scrim behavior.
- Final homepage scroll/gallery regression: PASS with zero browser errors.
- Final production build after header hit-testing correction: PASS (19 generated pages).


## CTA and typography correction ? 19 October 2026
Source CSS was computed at 1920, 1440, 768 and 390px (`audit/source/typography-computed.json`). Public display text uses Arimo: home hero clamp(41.6px,8vw,120px), service hero maximum104px, section titles63px (mobile section/contact46px), contact links33px/1.5 and weight600. The homepage About display remains63px. Ambient videos have no pause overlays.

Works tiles open an expanding photo/video preview (0.66s power2.inOut); its View project link enters a distinct detail page. Home selected-work rows and story links navigate directly. Service inquiry links scroll to their own contact area. Project pages use centered43px titles, two-column introductions and photographic contact footers; photographic projects open a photograph viewer, films open the film viewer. Gallery media belongs to the homepage footer only; Stories/Contact retain editorial footers; Works has none. The homepage gallery is hidden below992px, following the source.

Local Playwright checks passed client navigation, filter/preview/project flow, player controls and focus restoration, pinned service roll, homepage overlap, infinite opposing gallery motion and reverse release, dark/progressive loader, mobile widths and reduced motion. Desktop/mobile captures are in `.impeccable/review`. These checks verify local implementation; they do not establish pixel-identical live-reference playback. Placeholder John copy, portfolio material and booking destinations remain intentional product substitutions.


## Latest seven-route audit
Supersedes the earlier seven-item catalog and filter checks: see [ROUTE-FLOW-AUDIT.md](ROUTE-FLOW-AUDIT.md). Works now has all 33 reference entries, no filter bar, and project-specific source media structures. Live desktop and mobile reference captures are available.


## Stories layout correction - 19 October 2026
The wide-screen story title could put its arrow on a separate line. Zakynthos titles now keep the source-style two-line composition, with the final word and arrow grouped together. Grid columns use minmax(0,...) to prevent text from expanding the copy column. Mobile typography fits the available width. Expanded the adapted Zakynthos photo-essay description to restore the intended editorial text density. The page has one accessible Stories heading and per-entry h2 links.

scripts/test-stories-layout.cjs checks1920px,1440px and390px: all three title/arrow bounds, no horizontal overflow, footer access, pinned overlap and no browser page errors. Production build passes. Captures are stories-fixed-* in .impeccable/review.
