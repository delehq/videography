# Scroll and section audit - 19 October 2026

## Correction to the initial audit
The first audit missed the dynamically injected `/assets/js/manim.js?100` module. Its loader is in `audit/source/inline-2.js`; the downloaded module and a decoded inspection copy are now in `audit/source/manim.js` and `manim-decoded.js`. No analytics or unrelated remote scripts were copied into the application.

The first build approximated scrolling with hero parallax and normal document sections. Its footer gallery was a small fixed-height canvas listening only on itself, with no project links. Those were material mismatches with the reference and the user's supplied Work / Let's Talk screenshots.

## Observed reference controller
- Lenis duration: 0.9 seconds; cubic ease `1 - (1 - t)^3`; wheel multiplier 1.
- Opaque sections form a stack. Each prior panel pins until the next panel reaches `top top`; pin spacing is false.
- A panel taller than 1.02 viewport heights pins from `bottom bottom`, preserving access to its content; shorter panels pin from `top top`.
- The prior panel's inner surface scales from 1 to .92 as the next section moves from `top bottom` to `top top`. This creates the covering/indexing effect; it is not a simple translate/parallax entrance.
- The header remains fixed over the stacked sections.
- The original sequence also includes empty difference-blended and pale transition panels. The build restores both the empty difference-blended transition before the image cloud and the full pale transition before Work, preserving their positions in the section stack.

## Work UI
Source preview: 4:3 with 650px minimum height on large desktop, rather than the former 430px strip. Heading uses 63px source sizing and a larger diagonal arrow. Table includes Project, Client and Category; fine horizontal card-like separators were removed. Source work imagery replaces the unrelated initial preview. Preview remains crossfaded and linked; all seven placeholder project rows link to their detail pages. Client names remain unspecified rather than attributing Thomas's clients to John.

## Contact gallery
- Full viewport contact composition, four/eight column split on desktop, copy beginning 120px from top, 63px heading and 33px inquiry links.
- Repeating 16:9 frames with media contained at their own aspect ratios, producing alternating narrow portrait and wide landscape images.
- Two three-copy tracks travel in opposite directions. Target position is driven by input, not an autonomous timer. Desktop wheel multiplier .30, mouse drag multiplier 1.3, smoothing .07 per nominal 60Hz frame with elapsed-time correction.
- Wheel input is captured across the section, including over the contact copy. At its settled terminal position downward input circulates projects without leaving the section. This also prevents Lenis from consuming the same event.
- The first upward input reverses the tracks. After min(220px, 22vh) accumulated upward input, subsequent upward input releases document scroll. This threshold implements the user's observed behavior; it was not extracted as an explicit numeric constant from the reference.
- Links are actual Next.js anchors. The WebGL layer has no pointer events and cannot intercept a project click. Dragging beyond 6px suppresses accidental navigation. Cached textures are shared between repeated tracks.
- RGB split .012, barrel .08, speed-gated bell deformation capped at .9. The rendering is bounded to the visible gallery and pauses offscreen/when the tab is hidden.
- Mobile has one contained-media column; reduced motion uses static, scrollable links with no pinning or canvas. Home/Escape provide an additional exit from the terminal gallery.

## Verification
`node scripts/test-scroll-interactions.cjs` passed: prior panel stays pinned under entering section, wheel over copy advances gallery while document holds, idle motion settles, reverse first moves gallery then releases document, visible gallery tile navigates to its own route, mobile has no horizontal overflow and responds to input, reduced motion bypasses pinning and canvas. Browser page errors: zero.

`node scripts/verify-scroll.cjs` recorded desktop gallery state around one wheel event: document Y unchanged at 5182; gallery displacement increased from 0 to 142.88px; both tracks changed in opposing directions (one wraps seamlessly). Reverse first held the document; later input moved the page from Y5182 to Y4682. Desktop capture:1920x930; mobile:390x844. Evidence in `.impeccable/review/scroll-*.png`.

Live user-browser control was unavailable. The controller and UI dimensions were audited from downloaded reference code and supplied screenshots. This verifies the described interaction in our build, not a frame-by-frame equality claim across every device and every motion effect on the original site.

## Targeted review confirmation
The finish reviewer scored all three follow-up issues resolved: native Space activation remains available on the Menu button; touch uses the source multiplier1.3 (100px finger movement produced127.6px of smoothed gallery displacement toward130px); duplicate film cycles are hidden from assistive technology while two canonical cycles remain exposed. Evidence: `scripts/test-scroll-review.cjs`, `.impeccable/review/scroll-review-checks.json`, and `scroll-touch-mobile.png`. The scoped verdict is ship after successful production build; this is not a full live-reference equality certification.


## Index regression repair - 19 October 2026

The shared App Router layout retains the motion controller between pages. Its earlier pathname-only setup could miss late/replaced panels and did not remeasure when media changed the editorial height or the page loader completed. A stale start/end left an incoming transition detached from the prior pinned section. An immediate post-loader transition check exposed an intermittent cover-position failure.

The controller now observes panel identity changes, rebuilds only when that set changes, observes panel/surface sizes, and refreshes after image/video metadata, fonts, viewport changes and page restoration. Loader completion performs a synchronous bounds refresh. Each route gets a fresh Lenis instance; listeners, observers, frames, timers and GSAP contexts are disposed during cleanup. DOM stacking and difference blending remain unchanged.

New checks:
- test-scroll-lifecycle.cjs: PASS after client navigation to index, a late 320px layout change, late panel insertion/removal, resize and return navigation. The cloud stayed at top0 while covered. More than600 sampled photograph pixels per capture matched the expected difference inversion, rather than a blank opaque cover. All five secondary navigation routes cleaned up prior pins.
- test-transition-integrity.cjs: PASS for About remaining pinned until the dark cover passes; wedding and commercial film tracks advance with wheel input.
- Immediate post-loader dark-cover check: 3 consecutive passes at1920x945; About bottom945 and incoming cover top472.
- Existing test-scroll-interactions.cjs: PASS including infinite opposing gallery, reverse release, navigation and reduced motion.
- test-reference-route-flows.cjs: PASS for seven routes, footers, Works previews, separate photo/film actions, 16-photo gallery and mobile widths.

Evidence: .impeccable/review/lifecycle-*.png. This repairs the shared scroll lifecycle without altering the reference page designs.


## Commercial/Weddings roll spacing repair - 19 October 2026

A separate defect remained in the custom service roll: automatic pinSpacing interacted with the shared no-spacing panel controller during refresh, offsetting later panels by a viewport. At the cover's natural start, the light panel and Selected Work could both be translated by945px at1920x945; a residual roll frame appeared over a blank pale transition.

Matched the source's explicit #about-roll-spacer strategy: the React service roll reserves distance()+1 in a sibling .service-roll-space and uses pinSpacing:false. Space is synchronized before refresh and after track/viewport resizes; observers and listeners clean up with the component. This keeps later panel positions independent of pin refresh order.

Validation: typecheck, transition integrity tests and test-service-section-flow.cjs passed. Both service pages show Work at top0 while the cover enters at472px halfway and1px almost fully covered; the previous roll's bottom is already outside the viewport. The photographic footer arrives correctly and mobile resize has no horizontal overflow. Evidence: commercial-cover-repaired.png, weddings-cover-repaired.png and corresponding footer captures in .impeccable/review.


## Image-cloud click zoom - 19 October 2026
Cloud photographs no longer navigate to arbitrary project pages. A click focuses the selected Three.js plane by moving the camera/target over650ms, with a small desktop scale pop. Another click or Escape reverses over560ms. Dragging remains separate from clicking. A distinct HD control opens the same image in the fullscreen media viewer; closing preserves the focused cloud and document position. The DOM/reduced-motion fallback exposes equivalent focus and HD actions with keyboard controls. Desktop focus sizing leaves the editorial copy readable.

scripts/test-cloud-zoom.cjs passed WebGL focusing, HD fullscreen, URL preservation, background scroll lock, Escape restoration, drag distinction and keyboard/mobile fallback. TypeScript and production build passed. Evidence: cloud-focus-desktop.png, cloud-zoom-desktop.png and cloud-zoom-mobile.png in .impeccable/review.
