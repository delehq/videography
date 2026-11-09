# Reference mobile motion restored

The previous mobile UX pass changed the intended animation design. This repair
restores the motion language from [Thomas Mamfredas](https://thomasmamfredas.com/)
instead of replacing it with a simplified mobile flow.

## Reference observations

The live reference was inspected at 390 × 844 with touch emulation. Its index
has six pinned transitions across seven panels. Each outgoing surface scales
from 1 to .92 while the next panel enters. Sections taller than the viewport
finish scrolling before they pin. Both the dark film interlude and pale cloud
cover remain full viewport panels on phones, with difference blending.

The reference Commercial page also uses a pinned, scroll-linked film roll on
phones. Its first film is portrait; still images retain their own proportions.
This is the behavior now used in the local app.

## Restored behavior

- The shared panel controller runs on phones again. The replacement mobile
  hero-only parallax effect is removed.
- Dark and pale transition panels are visible at full viewport height again.
- The photo cloud returns to its full-screen composition with overlaid copy.
- Service pages restore their scroll-linked tracks, portrait opening frame,
  naturally proportioned stills and media-before-copy ordering.
- The loader, menu transition and fullscreen media/preview timings no longer
  use the shortened mobile variants introduced in the UX pass.
- Reduced-motion visitors retain static alternatives.

Navigation consistency, touch target sizes, video gallery posters, responsive
type sizing and the menu focus fix remain. Shared texture loading and deferred
graphics initialization also remain without removing the reference motion.
Fixed-size video decoding no longer refreshes the entire pinned stack unless
its layout dimensions actually change. Pin bounds are measured from the
document-flow spacer rather than a child's temporary fixed position.

## Verification and captures

`node scripts/test-mobile-motion.cjs` checks the mobile pin count, hero scale,
About/dark-cover overlap, cloud/pale-cover overlap, difference blending, both
service film rolls, secondary routes and reduced motion in Chromium and WebKit.
Each phone width starts in a fresh page to avoid carrying emulator resize state
between device profiles. External media and the Google Fonts stylesheet are
blocked in this mechanical regression; screenshot font-readiness waiting is
disabled because WebKit can otherwise wait indefinitely on the aborted font
request. These checks establish transition geometry, not font fidelity.
Programmatic jumps explicitly dispatch scroll events to flush WebKit's cached
scroll sample. A separate synthesized Chromium phone swipe also verified that
real touch input advances About while the hero stays pinned.

The desktop transition-integrity regression passed as well, including both
service rolls. TypeScript and the production build are checked separately.

Captures:

- [Live reference phone transition](../.impeccable/review/mobile-motion/reference-index-transition.png)
- [Restored shrinking hero](../.impeccable/review/mobile-motion/chromium-hero-cover.png)
- [Restored dark cover](../.impeccable/review/mobile-motion/chromium-dark-cover.png)
- [Restored pale inversion](../.impeccable/review/mobile-motion/chromium-light-cover.png)

Earlier UX audit screenshots document the previous simplified flow and are
marked as superseded. This repair is local; it is not deployed. Emulation does
not certify physical-phone frame rate or exact frame-by-frame visual parity.
