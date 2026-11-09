# Route flow audit - 19 October 2026

Audited live at 1440x1000 and 390x844: weddings, commercial, contact, works, work/ionian-aura, stories, work/zakynthos-greece. Downloaded HTML, inline styles/scripts, inventory and computed layout evidence are in audit/source. Reference captures are named ref-* in .impeccable/review; local captures are named local-* and *-audit-*.

| Route | Implemented structure and actions | Footer |
| --- | --- | --- |
| /weddings | Full viewport film; fullscreen action; pinned media roll; right editorial copy; inquiry scrolls to contact; five selected projects | Photographic contact |
| /commercial | Its own hero film and commercial media sequence; pinned roll; selected commercial work; inquiry scrolls to contact | Photographic contact |
| /contact | About film, process photograph, then contact; media toggles grayscale/color rather than navigating | Media left, contact right |
| /works | All 33 reference entries in source order; grayscale squares with video play markers; no invented filter bar; expanding preview then View project | None |
| /work/ionian-aura | Image hero with photograph fullscreen; metadata and separate 4:3 video introduction; no invented description or photo gallery; pale transition | Photographic contact |
| /stories | Three distinct entries in source order; media toggles color; titles navigate; photograph versus film content preserved | Media left, contact right |
| /work/zakynthos-greece | Image hero; photo introduction with text; pale transition; all 16 photographs; fullscreen gallery with arrows, keyboard and swipe navigation | Photographic contact |

All 33 project routes use the actual source media structure, including optional galleries, video heroes and image heroes. Fullscreen media travels from its originating bounds over 0.78 seconds with power3.inOut; reduced motion uses a short transition. Works preview uses its separate 0.66 second power2.inOut expansion and 16:9 preview layout. Ambient media has no pause overlays. Photography opens photography; film launches video controls intentionally.

## Intentional product substitutions and outstanding configuration

John remains the temporary brand. The portfolio is labelled reference material; reference clients, titles and metadata describe the supplied design reference, not John's commissions. Some long editorial descriptions are adapted placeholder copy. Booking inquiries continue into the requested booking system rather than emailing the reference photographer. John's email address and Instagram URL are still pending; these two labels have explicit unavailable states rather than linking to someone else's accounts. Reference videos currently stream from the reference host; local images are downloaded and oversized images resized to a maximum of 2400 pixels. Full replacement with John's media and own hosting remains a launch requirement.

## Validation

- npm run typecheck: PASS.
- npm run build: PASS, 45 generated pages including 33 project routes.
- scripts/test-reference-route-flows.cjs: PASS for all seven routes, page-specific footers, 33 Works entries, preview-to-project navigation, separate photograph/video actions, the 16-photo gallery, mobile widths and no page errors.
- scripts/test-scroll-interactions.cjs: PASS for pinned overlap, opposing infinite gallery, reverse release, project navigation and reduced motion.
- Focused confirmation: mobile service overflow fixed; Stories color controls support keyboard; project film metadata loading checked.

Live layout and behavior were inspected; this is not a certification of frame-for-frame equivalence across every device or network condition. The bounded screenshot review found and corrected mobile service min-content overflow.
