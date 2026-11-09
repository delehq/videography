# John — videographer booking studio

Next.js App Router / TypeScript, GSAP + Lenis, Three.js and Supabase.

## Run
```
npm install
npm run dev
```
Open http://localhost:3000. Dashboard: http://localhost:3000/dashboard.

Without Supabase environment variables, booking and dashboard operate in a clearly labeled local demo. Inquiries stay in the same browser. No payment is taken.

## Connect
See [integration setup](docs/INTEGRATIONS.md), [SQL schema](supabase/schema.sql), and [.env.example](.env.example). The code includes Next.js route handlers; no separate backend service is required.

## Reference and fidelity
Read [the detailed reference audit](docs/REFERENCE-AUDIT.md) for source observations, motion timings, route coverage, and remaining differences. This is an initial working implementation, not a claim of pixel-perfect or complete animation parity. Original client details and identity were not attributed to John.

John's name and portfolio data live in `src/lib/brand.ts`. Replace media in `public/media/` before public launch. These are temporary reference images/films from thomasmamfredas.com. `download_media.py` records source paths. Additional sources: `/assets/videos/Thomas%20Mainx.mp4` and `/assets/images/used/opti/thomas.JPG`.

## Verify
```
npm run build
node scripts/verify.cjs
```
Run the dev server first for the browser check. It creates a synthetic local inquiry, approves it in the demo dashboard, checks filters, routes, mobile overflow, rejected invalid API input, and disabled payment status. No hosted Supabase or live provider has been tested.

Main pages: `/`, `/weddings`, `/commercial`, `/works`, `/stories`, `/contact`, `/book`, `/dashboard`, `/work/[slug]`.

## Scroll refinement
The source scroll controller and the Work / Let's Talk revisions are documented in [docs/SCROLL-AUDIT.md](docs/SCROLL-AUDIT.md). Test the pinned overlays, whole-section infinite opposing gallery, reverse release, project links and reduced-motion fallback with `node scripts/test-scroll-interactions.cjs`; targeted keyboard/touch/accessibility checks are in `node scripts/test-scroll-review.cjs`.

## Cover, loading and secondary-page refinement
The pale cover now visibly inverts the cloud through the source DOM stacking model; initial loader starts black and reveals decoded images progressively. Secondary-page layouts and interactions were audited and updated; see [docs/PAGE-AUDIT.md](docs/PAGE-AUDIT.md). Run `node scripts/test-page-audit.cjs` with the dev server for cross-route checks. Evidence screenshots are in `.impeccable/review/`.


## Client booking and payment provision
Clients receive a private booking page after submitting an inquiry. John can approve and quote from the dashboard, then copy the client link. The client sees the agreed quote and verified payment status. Live checkout remains disabled until the chosen payment provider is implemented and configured. See docs/INTEGRATIONS.md for the new schema/migration, provider adapter contract and webhook settlement flow.

Validate with node scripts/test-booking-payment-flow.cjs and node scripts/test-payment-contract.cjs. Portal routes are /booking/[id] and /booking/[id]/return; the access token is supplied through the private URL fragment.

The expanded `/dashboard` manages site content and studio records without analytics. Coverage, draft/publication behavior, security boundaries and the required database migration are documented in [docs/STUDIO-MANAGEMENT.md](docs/STUDIO-MANAGEMENT.md).

See [Availability and studio email](docs/AVAILABILITY-EMAIL.md) for the booking calendar, reservation rules, email service configuration and required migration.

Studio access now requires authentication. See [docs/AUTH.md](docs/AUTH.md) for owner account setup, login/password recovery, server access checks and verification. The dashboard stays locked when Supabase is not configured.
