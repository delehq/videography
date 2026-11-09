> Motion behavior in this earlier audit is superseded by [the reference-motion restoration](MOBILE-MOTION-RESTORATION.md). The phone pinning, covers, loader, service rolls and viewer timings now follow the reference again.

# Mobile UI/UX and motion audit

Reviewed 9 November 2026 using the Impeccable audit, adaptation and motion
playbooks. Visual reference: [Thomas Mamfredas](https://thomasmamfredas.com/).
The cinematic identity is retained; mobile behavior prioritizes reading,
navigation and native touch scrolling.

Open the [screenshot audit](../.impeccable/review/mobile-ux/index.html) to inspect
top, middle and bottom captures of all 46 public routes, reference comparisons,
private booking states and the ten studio sections. Raw captures remain beside
that index. The public routes include all 33 projects, the portfolio and service
pages, pricing, booking, authentication screens and private-link error states.
An unauthenticated password-reset request correctly redirects to sign-in.

## Findings and corrections

| Finding | Result |
| --- | --- |
| Separate desktop/mobile navigation definitions and misleading decorative counts | Both menus now render the same eight destinations and labels from one list. The mobile Works shortcut matches the reference; the full menu includes booking and pricing. Current-page state is visible and exposed through `aria-current`. |
| Menu focus restored while the background was still inert | Closing restores background interaction before returning focus to Menu. Background content cannot receive focus while the menu is open. |
| Mobile loader could hold every route for up to seven seconds | Mobile, touch and reduced-motion visitors bypass the blocking loader. Desktop retains its authored entrance. |
| Mobile scroll continued to run desktop smoothing and refresh machinery | Touch uses native scrolling. Compact layouts avoid panel pinning and global refreshes on each media load. The index uses one coalesced camera movement inside its hero, with a smooth native About link. |
| Moving cloud photographs competed with overlaid copy | Mobile copy now precedes the gallery, with instructions that distinguish horizontal exploration from vertical page scrolling. |
| Graphics initialized before they were visible, including a hidden footer | Cloud initialization waits until the gallery approaches the viewport. Compact devices render 14 planes instead of 28 at a lower pixel ratio; duplicated textures share one load per image. Hidden footer graphics do not initialize. Resize and reduced-motion changes clean up their effects. |
| Empty transitions and full-height project introductions interrupted the mobile flow | Mobile blank interludes are removed; project introductions size to their actual content. |
| Some video galleries presented black rectangles without a play affordance | All five affected project galleries now have posters, play indicators and film-specific accessible labels. Video downloads wait for viewing. |
| Fullscreen transitions animated blur and used long desktop timings | Mobile previews and media viewers use shorter transitions without animated backdrop blur. Desktop motion remains available. |

## Verification

- **276 mobile scroll-position checks passed:** 46 routes × 320/390px ×
  top/middle/bottom positions. The 390px captures were visually inspected as
  individual screens and contact sheets. No horizontal overflow was found.
- **88 broader responsive checks passed:** widths from 320 to 1440px, portrait
  and landscape menus, booking steps, previews, media navigation, live resizing
  and reduced motion.
- **WebKit:** 24 route layout checks passed at 320/390px. Follow-up tap tests
  passed for menu navigation, the booking calendar and short preview/film
  transitions. Chromium passed the same interaction checks.
- **Touch gestures:** synthesized Chromium touch input confirmed that horizontal
  cloud drags change the gallery without moving the page, while vertical swipes
  scroll the page. This is gesture evidence, not just a resized screenshot.
- **Private booking:** pending, approved/quoted and paid states fit at 320/390px,
  using isolated synthetic browser records. No live inquiry or payment was made.
- **Studio:** all ten sections passed at 320, 390, 768 and 1440px in the isolated
  component fixture; the populated detail drawer was also checked at 320px.
- TypeScript, the production build and whitespace checks passed.

Re-run with the app running:

```sh
node scripts/audit-mobile-ux.cjs
node scripts/test-mobile-responsive.cjs
node scripts/test-dashboard-ui.cjs --capture
```

`audit-mobile-ux.cjs --checks-only` runs the navigation and motion assertions
without recapturing every route. The audit aborts remote reference-site video
requests for repeatability, so screenshots verify local layout and posters,
not availability of every external film. Reference captures were taken from
the live site separately.

These are emulated Chromium/WebKit results, not physical iPhone or Android
certification or a measured frame-rate guarantee. Real-device battery/GPU
performance, browser chrome, virtual keyboards and live Supabase/payment
integrations remain outside the verified scope. The changes are local and have
not been deployed.
