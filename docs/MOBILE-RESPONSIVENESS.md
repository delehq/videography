> Motion behavior in this earlier audit is superseded by [the reference-motion restoration](MOBILE-MOTION-RESTORATION.md). The phone pinning, covers, loader, service rolls and viewer timings now follow the reference again.

# Mobile responsiveness review

The public site retains its monochrome cinematic styling. The final responsive
stylesheet is imported after the reference and dashboard styles so earlier
reference measurements cannot restore desktop sizes on small screens.

## Changes

- Fluid headings remove horizontal overflow at 320px, including About and
  Commercial work headings.
- Mobile navigation uses 44px tap targets and an opaque header for readable
  controls over scrolling content. The menu reflows into two columns in short
  landscape viewports and scrolls independently of the smooth-scroll controller.
- Phones use normal page scrolling instead of pinned panel transitions. Service
  film rolls use normal flow below 992px, including after a desktop-to-mobile
  resize. Desktop pinning remains available.
- Vertical touch gestures over the WebGL photo cloud scroll the page; horizontal
  gestures still pan the photographs.
- Booking layouts stack on tablets, and service choices stack on narrow phones.
  Form controls retain a 16px font and summaries wrap long values.
- Gallery previews and viewer controls fit smaller screens, with larger tap
  targets. Footers grow with their content instead of clipping it on tablets.

## Verification

Run the application and then `node scripts/test-mobile-responsive.cjs`.
The suite checks 13 routes at 320, 360, 390, 768, 1024 and 1440px, plus
portrait/landscape touch navigation, booking form steps, previews, fullscreen
gallery navigation, reduced motion and live viewport resizing. All 88 layout
checks passed with no page errors. The suite aborts remote reference-site media
requests for repeatability; local images and fonts are still used.

`node scripts/test-dashboard-ui.cjs` passed all ten studio sections with
synthetic records at 320, 390, 768 and 1440px. This isolated component fixture
does not bypass authentication or modify live studio data.

Additional synthesized Chromium touch checks confirmed that vertical swipes
over the cloud scroll the page and horizontal drags change the cloud without
moving the page. Narrow-screen menu and service-choice screenshots, tablet
footer containment and TypeScript checks also passed. Captures and layout
measurements are stored locally in `.impeccable/review/mobile/`.

These are Chromium emulation checks. Physical iPhone/Android devices, Safari,
mobile keyboard/browser chrome behavior and live backend integrations have not
been verified by this review.
