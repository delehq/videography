---
name: John Videography
description: A monochrome cinematic editorial portfolio and studio workspace.
colors:
  background: "#0d0d0d"
  ink: "#ededed"
  muted: "#aaa"
  line: "#333"
  paper: "#e3e3e3"
  action: "#e6e6e6"
  action-ink: "#111"
  white: "#fff"
  source-black: "#000"
  source-surface: "#111"
  source-line: "#1c1c1c"
  source-cover: "#f0f0f0"
  dashboard-background: "#f6f8fb"
  dashboard-ink: "#182230"
  dashboard-muted: "#526175"
  dashboard-line: "#e2e8f0"
  dashboard-sidebar: "#ffffff"
  pending-background: "#e9e3d1"
  pending-ink: "#665323"
  approved-background: "#dce7d8"
  approved-ink: "#355c2b"
  declined-background: "#eddfdb"
  declined-ink: "#7b3d32"
typography:
  display:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(2.6rem,8vw,7.5rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: ".01em"
  headline:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(40px,4.7vw,68px)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: ".005em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    letterSpacing: "-.025em"
  body:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: ".04em"
  reference-heading:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "63px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
  reference-inquiry:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "33px"
    lineHeight: 1.3
  reference-support:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "15px"
  reference-table-label:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: ".04em"
  reference-editorial-body:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.55
  reference-navigation:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "12.8px"
    fontWeight: 700
    lineHeight: 1.2
  reference-tile-title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 500
  reference-caption:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "12px"
rounded:
  flat: "0"
  status: "3px"
  editorial: "16px"
  editorial-mobile: "12px"
  tile-mobile: "10px"
spacing:
  page: "4vw"
  mobile-page: "20px"
  editorial-gap: "25px"
  board-gap: "30px"
  section: "110px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.flat}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
  button-dashboard:
    backgroundColor: "{colors.dashboard-ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.flat}"
    padding: "16px 22px"
  button-outline:
    rounded: "{rounded.flat}"
    padding: "12px 15px"
  field:
    rounded: "{rounded.flat}"
    padding: "15px 0"
  status-pending:
    backgroundColor: "{colors.pending-background}"
    textColor: "{colors.pending-ink}"
    rounded: "{rounded.status}"
    padding: "5px 9px"
---

# Design System: John Videography

## Overview

**Creative North Star: "The Cinematic Editorial Portfolio"**

The visual authority is the user's chosen reference, thomasmamfredas.com. Preserve its monochrome film-led composition, compact navigation, large typography, asymmetric media arrangements, and smooth spatial motion while substituting John's identity. This is a code-led replication: no separate build specification or approved composition exists.

This document records the source-aligned implementation and its provisional fidelity limits, not final brand approval. The public portfolio is spacious and cinematic; the studio dashboard is a quieter light workspace. Temporary reference photography and films are not John's portfolio and require replacement with his licensed work before public launch. Source inspection and remaining replication differences are recorded in `docs/REFERENCE-AUDIT.md`; downloaded reference material lives under `audit/source/`.

**Key Characteristics:**
- Monochrome surfaces with grayscale film and photography.
- Full-screen film heroes and asymmetric editorial media.
- Inter display typography with compact Arimo supporting text.
- Flat controls, fine separators, and visible keyboard states.
- Smooth motion with reduced-motion and static media fallbacks.
- Light, restrained operational dashboard.

## Colors

The portfolio uses dark neutral surfaces and pale type; imagery supplies chromatic variation. The frontmatter is normative for extracted reusable colors.

### Primary
- **Pale Action:** `action` and `action-ink` invert the public inquiry button; `white` supplies its hover state.

### Neutral
- **Cinema Black:** `background` anchors public pages. Intentional source additions `source-black`, `source-surface`, and `source-line` cover the black loader, editorial media/Works tile beds, and inquiry separators; `source-cover` supplies the difference-blended pale cover. These neutral values preserve the reference rather than introducing an accent palette.
- **Film White:** `ink` supplies primary public text; `muted` supports annotations and secondary copy; `line` separates content.
- **Pale Interlude:** `paper` marks deliberate light transitions and selected service choices.
- **Studio Paper:** `dashboard-background` and `dashboard-sidebar` define the operational workspace; its ink, muted, and line tokens carry the hierarchy.
- **Status Tints:** pending, approved, and declined pairs are functional dashboard indicators, each accompanied by a text label.

**The Monochrome Frame Rule.** Keep public interface chrome neutral; color may emerge from the media rather than an added decorative accent.

## Typography

**Display Font:** Inter, with Arial and sans-serif fallbacks.
**Body Font:** Arimo, with Arial and sans-serif fallbacks.

The source-inspired type is direct and compact: heavy cinematic headings, uppercase editorial fragments, and small practical navigation. Fonts are currently loaded through Google Fonts in `src/app/globals.css`.

### Hierarchy
- **Reference additions:** the reference-heading, reference-inquiry, reference-support, reference-table-label, reference-caption, reference-editorial-body, reference-navigation, and reference-tile-title roles intentionally preserve source-derived Work/contact sizes. They are additions to the incumbent scale, not drift to normalize away. Editorial body serves reference panels, navigation preserves the source header, and tile title serves Works overlays. Headings serve Work and contact; inquiry serves contact links; supporting text, table labels, and captions remain compact. Responsive overrides follow `src/app/scroll-sections.css`.
- **Display:** the final cascading hero rule uses the frontmatter display role, replacing the earlier larger declaration. Mobile uses `clamp(3.5rem,17vw,7.5rem)`.
- **Headline:** the frontmatter role describes the right-aligned About heading; service and collection headings use their own fluid Inter scales.
- **Title:** medium-weight booking section headings use the title role.
- **Body:** Arimo is the public default; long service/project copy grows to 17px with generous leading. The dashboard uses Inter throughout.
- **Label:** compact uppercase labels identify sections, navigation, metadata, and tables; avoid applying display weight to routine controls.

## Layout

The home stack preserves the source order: hero, About, empty film interlude, photo cloud, pale interlude, Work, and contact footer. Both interludes span the viewport; the film interlude disappears under reduced motion.

Public pages share viewport-relative gutters, changing to the mobile-page spacing on narrow screens. Heroes fill the small viewport height with cover-cropped films, a dark gradient, and a lower-left name. Supporting biography sits at the lower right on desktop and beneath the name on mobile.

About is a narrow centered editorial composition, normally 72% wide with a 1040px maximum, with staggered portrait and film proportions. Selected work pairs equal-width desktop columns with a 24px gap: a 4:3 preview with a 650px minimum height and a three-column Project / Client / Category table. The full-viewport contact footer uses a 4:8 desktop split, copy inset 120px from the top, and two opposing contained-media tracks. Desktop frames are 16:9; their media retain portrait or landscape proportions. At 991px the client column disappears and the footer reduces to one media column; at 650px work stacks vertically and footer frames become 4:5. Works uses a compact square auto-fill grid: 280px minimum columns, increasing to the source 320px minimum at 1600px, and two columns at 650px. Captions overlay each tile; category filters remain above the grid, and its accessible title is visually hidden. Works has no gallery footer. Service pages pair a single-word film hero and lower biography with a pinned left film roll and right narrative, a category-filtered Work board, a pale transition, and a plain contact footer. Stories uses three viewport-sized media-left/copy-right panels; Contact uses About and Process panels. Both end with the editorial media-left/contact-right footer. At 991px editorial panels stack; the service roll retains two columns until its mobile layout reverses copy above the film track. Preserve asymmetry where it survives comfortably on the available width. The final `.offset` rule resets the earlier negative margin to zero.

Observed responsive boundaries are 1600px, 1100px, 1000px, 991px, and 650px; 1100px and 991px refine the Work/contact composition. At the smallest boundary the dashboard sidebar becomes a top bar, summary statistics form two columns, and the booking table remains horizontally scrollable. The main desktop dashboard sidebar is 215px wide, reduced to 175px at the intermediate boundary.

## Elevation & Depth

Surfaces are flat: no reusable card-shadow vocabulary exists. Film crop, scrims, overlapping media, difference blending, and WebGL perspective carry depth. A backdrop separates the booking detail drawer; the film viewer occupies a nearly black full-screen overlay. The preview's text shadow is a local readability treatment, not a general elevation token.

## Shapes

Controls, fields, tables, and panel shells have square corners. Source editorial media and Works tiles use 16px corners; editorial media reduces to 12px on mobile, while Works tiles and mobile service-roll frames use 10px. Dashboard status labels retain their small 3px radius. The circular custom cursor is a pointer affordance rather than a card language. Fine bottom borders distinguish fields, links, rows, and selected tabs.

## Components

### Buttons

Primary actions are flat pale rectangles on public pages and dark rectangles in the dashboard. Outline actions use a fine neutral stroke. Public primary buttons have a 48px minimum height and a short background transition. Disabled controls reduce opacity and stop presenting an actionable cursor. General keyboard focus uses a current-color outline with offset; retain it in new variants.

### Inputs / Fields

Public fields are transparent and underlined with square corners. Focus brightens the underline; visible labels remain above inputs. Errors use restrained warm text. Dashboard editing changes controls to a light color scheme, and its search field sits inside a fine rectangular border. Do not infer an unimplemented disabled or error style beyond the observed controls.

### Navigation

The public header is a fixed white monogram and two compact uppercase link stacks over a dark-to-transparent gradient. It uses normal blending, preserving white text over the pale cover. Its outer surface is pointer-transparent; anchors and buttons receive pointer input. On mobile its link set contracts to work/menu access. The full-screen pale menu reveals through a clipped sweep and presents large uppercase links. It contains keyboard focus, closes on Escape, and returns focus to its trigger.

### Cards / Containers

Works entries are square rounded media links with category/title overlays and working category filters. Their images retain color. Other editorial media restores color on hover; project detail links remain direct navigation rather than reproducing the source tile-expansion transition. Service choice panels are outlined rectangles that invert to pale paper when selected. Dashboard rows favor fine separators over elevated cards.

### Status Labels

Small tinted labels identify pending, approved, and declined states using both color and text. These functional colors belong to the operational dashboard.

### Cinematic Media and Motion

Film components are muted, looping cover crops with visible play/pause controls. Intersection observation pauses off-screen playback; reduced-motion preference bypasses automatic playback. Selected-work rows change the preview on hover and keyboard focus with a crossfade and small scale change.

Lenis uses a 0.9-second duration with cubic easing `1 - (1 - t)^3`. Home and reference panels stack in DOM order without artificial panel or pin-spacer z-indexes, so the pale difference cover blends through the pinned cloud. Other opaque panels stack: each preceding panel pins without added spacing until the next reaches the top. Panels taller than 1.02 viewport heights begin pinning at their bottom; shorter panels begin at their top. The preceding inner surface scales from 1 to .92 while the next panel covers it. The source stack also restores the empty full-viewport film interlude immediately before the photo cloud, using `rgba(27,14,14,.306)` and difference blending; it is hidden under reduced motion. The pale transition before Work fills a viewport and uses difference blending to preserve inverted cloud images and introductory text underneath.

The contact gallery repeats each column three times and moves opposing tracks only in response to input. At its terminal viewport position, wheel input across the contact section advances tracks with a .30 multiplier; drag and touch use 1.3. Interpolation is .07 per nominal 60Hz frame with elapsed-time correction. Upward input first reverses the tracks; after accumulated `min(220px, 22vh)` travel, subsequent upward input releases document scrolling. That threshold implements the user's observed behavior rather than a numeric constant extracted from the reference. Home/Escape also exit. A drag beyond 6px suppresses accidental navigation.

DOM project anchors remain the real keyboard and pointer targets beneath a pointer-transparent WebGL overlay. Only successfully loaded media hide behind the canvas, and context loss restores DOM images. Rendering pauses offscreen and while the tab is hidden. The public loader mounts on each route change with black, image-free server markup. It waits 500ms, then inserts one decoded tile every 120ms. Once nine slots are filled and the page is ready, exit waits until at least two seconds have elapsed; the difference sweep takes .45s and the .25s fade begins at .3s. A seven-second failsafe releases blocked loads. The dashboard skips the loader. The custom cursor, clipped reveals, and draggable photo cloud remain provisional reference treatments. Reduced-motion skips pinning, smooth scrolling, loader, cursor, reveal animation, and the contact canvas; the gallery becomes static scrollable links. Coarse pointers hide the cursor. Keep normal project links available when the photo cloud receives keyboard focus.

The portal-based film viewer permits keyboard access to native video controls and mute, bounds focus at its edges, closes on Escape, makes main/header/footer inert while open, locks body scrolling, and restores scrolling and trigger focus on close.

`docs/PAGE-AUDIT.md` records secondary-route changes. The page audit passed client navigation, service roll movement/cleanup, Works filters/detail links, modal keyboard/focus behavior, section counts and booking links with zero browser errors. Desktop/mobile visual review, page interaction checks, the home-gallery regression and final production build all passed. Seven illustrative projects and temporary reference assets remain; live reference parity has not been certified.

`docs/SCROLL-AUDIT.md` records source-derived behavior and interaction checks. It establishes the described build behavior, not frame-by-frame equality with every reference device or effect.

## Do's and Don'ts

### Do:
- **Do** preserve the pinned reference's monochrome cinematic editorial system.
- **Do** use the final cascading CSS values when duplicate declarations exist.
- **Do** keep keyboard focus and reduced-motion fallbacks visible and usable.
- **Do** identify temporary reference assets and illustrative projects honestly.
- **Do** retain the light dashboard's operational hierarchy and text status labels.

### Don't:
- **Don't** add a new aesthetic direction, decorative accent palette, or rounded card system.
- **Don't** claim exact reference fidelity or final visual approval from this provisional implementation.
- **Don't** present the reference creator's work, clients, or identity as John's.
- **Don't** make motion or pointer-only exploration the sole route to project content.


## Dashboard administration surface

Mode: Operate. The dashboard uses a conventional white workspace over a cool light background, with blue primary actions and restrained semantic status colors. These decisions apply to studio administration only. The public portfolio retains its cinematic reference design.

- A 248px fixed sidebar groups Studio, Website and Administration tasks; a labeled native section picker replaces it at 900px and below.
- Body text, table content, labels and controls remain at least 16px. Page titles are 30px; section titles are 22px. Controls have at least 44px targets, consistent 6px corners and visible blue focus outlines.
- Booking records live in a bordered white table panel with search, status filters and 20-row pagination. CSV exports include all filtered rows, not just the current page. Record counts are navigation aids, not analytics.
- Editing surfaces share consistent spacing, labels and save/publish actions. Private production notes are collapsed by default with their own Save notes action.
- Portfolio projects use a selectable thumbnail list and a dedicated editor. Image/film and gallery/credits fields are expandable groups. Media are shown as a searchable 24-item grid with page controls.
- A white detail drawer contains booking information, quote/payment controls and reservation actions. No analytics charts or KPI cards are part of this surface.
- The authoritative scoped styles are in src/app/dashboard.css, loaded after public styles.

Verification uses an isolated component harness with synthetic records; no public dashboard-preview route or authentication bypass is introduced.
