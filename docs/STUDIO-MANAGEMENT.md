# Studio data management audit

The dashboard at `/dashboard` is a records and content workspace. It has no analytics charts, KPI cards, traffic tracking, or revenue summaries.

## Coverage

| Section | Records and controls |
| --- | --- |
| Bookings | Every inquiry, including archived inquiries; search by reference/name/email/location/service; status filters; client details, project brief, date and venue editing; approve/decline/archive; quotes and private client access links; private production notes; complete CSV export without access tokens. |
| Payments | Every checkout attempt, including pending/failed/succeeded; client/booking link; provider/reference, amount/currency, creation and settlement dates; status/search filters and CSV export. Results cannot be manually marked paid. |
| Clients | Contacts derived from inquiries, additional manual contacts, email/phone/name/private notes, related bookings, CSV export. Client directory changes do not silently rewrite original inquiries. |
| Portfolio | Add projects; edit title, URL slug, client, category, description, cover/hero/film/preview/introduction media, types, metadata and ordered galleries; reorder; publish/unpublish. New published slugs resolve through the existing project template. |
| Pages | Public copy for the home/gallery/work sections, service narratives, about/process, navigation/footer and booking form. Project placements control Stories, selected-work lists and the two moving-footer columns independently. |
| Media | Existing local/reference assets and project media slots; search, previews, replacement URLs, real Supabase Storage uploads; global replacements apply to images, films, loaders, cloud images, previews and full-screen viewers. Larger films can use HTTPS URLs. |
| Availability | Inclusive date-range blocks with private reasons, removal, approved-project schedule. Server booking submission checks blocks, enabled services and the booking switch. |
| Settings | Brand name, description/metadata, email, phone, Instagram, booking switch and service descriptions/availability. Secrets and admin membership remain in deployment/Supabase configuration. |
| Data | Content JSON, full studio backup without client access tokens, content import to draft, previous publication versions restored to draft. Financial records are never rewritten by content restoration. |

Content edits are kept in memory until **Save draft** or **Publish changes**. Draft saving does not change the public site. Publication applies the whole content draft. Private clients, availability and notes use **Save records**, not publication. Reloading warns before discarding unsaved work and refreshes bookings/payment records as well as content. The editor warns before closing a tab with unsaved changes.

The existing portfolio layout, footer variants and scroll treatments remain authored in code. This is a content manager, not a visual page builder or arbitrary HTML/CSS editor. Fixed navigation destinations remain real application routes. Generic transactional and validation messages remain application logic. Media removal restores the original mapping; it does not permanently delete stored files. Restore imports public content only; the full private backup is for safekeeping/export, not an unrestricted database restore.

## Persistence and access

- With no Supabase environment configuration, this is explicitly a browser-only demo. Drafts, publications and private records use localStorage. They are not synchronized between devices and must not hold real client data. Local uploads accept small raster images only; films use URLs.
- Fresh Supabase installations can apply `supabase/schema.sql`, which includes booking/payment and studio-management setup. Existing installations apply the new `supabase/migrations/20261019_studio_management.sql` after the booking/payment migration. Do not apply the same storage policy creation twice.
- `studio_content` holds separate draft, published and private-operations rows. Content/history tables are not directly accessible to anonymous or ordinary signed-in users.
- `/api/studio` validates the session JWT with Supabase, then checks `studio_admins` before reads/writes. Only server service-role calls can save these rows. Saves use a transaction, per-record advisory lock and revision check to reject conflicting edits. Older publications are retained for restoration.
- `/api/site-content` exposes only published public content and anonymous blocked start/end dates. It never returns drafts, private client records, notes, block reasons or payment records.
- The public layout receives published content on the server when Supabase is connected. Request-time rendering prevents a build-time snapshot from making later publications require a rebuild.
- Bookings and payments are read in 1,000-row pages until exhausted, rather than silently stopping at the Supabase default result limit. Exports escape spreadsheet formula prefixes.
- Storage uploads are restricted to studio admins, supported raster/film MIME types and a 50 MB limit. Public portfolio media are deliberately public. Secret keys never enter public content.

The payment adapter is still intentionally unconfigured. No provider transaction is invented in demo mode. Real payment verification, settlement and quote protections retain the prior booking/payment integration contract.

## Verification and remaining setup

Local browser checks cover draft isolation/publication, new project routes, page copy, saved client notes, booking notes, availability rejection, backup contents, payment read-only state, desktop/mobile fit and unauthenticated endpoint rejection. Mocked handler tests cover JWT/admin checks, public/private separation, content/media validation, revision-conflict responses and pagination beyond 1,000 rows. Existing booking/payment and scroll/route checks were run for regression coverage.

Supabase migrations, storage upload policies, multi-session database conflicts and provider payments require validation against the client's configured Supabase project and chosen payment provider. No live credentials were supplied for this audit.

## Public booking entry points

Visitors can reach `/book` from desktop/mobile navigation, the home hero, service hero buttons, inquiry links and the footer. `/pricing` shows both services, their descriptions and optional starting prices. Dashboard → Settings → Services provides starting-price and currency fields; blank prices show Request a quote. Publish the content changes to make prices visible. Starting prices are informational; approved per-booking quotes remain the server-owned payment authority. No immediate charge or availability guarantee is implied by a published starting price. Online checkout remains disabled until the selected provider adapter and credentials are connected.

Verified with `scripts/test-pricing-entry.cjs` at desktop and mobile widths and `npm run build`.
