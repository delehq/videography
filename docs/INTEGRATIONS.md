# Booking and payment integrations

## Implemented flow

1. Client submits /book and receives a private /booking/[id]#access=... link.
2. John reviews the inquiry in /dashboard, approves it, and saves an agreed quote with a currency. Prices are not prefilled.
3. John copies the private client link and sends it manually. No email is sent automatically.
4. The client reviews the request, quote and payment status on their booking page.
5. Once an actual provider adapter is connected, Pay securely creates hosted checkout using the stored server quote. Requests cannot choose their own amount or currency.
6. The return page checks saved status and never treats query strings or redirects as proof of payment. Only a verified provider webhook can reconcile a payment and mark it paid.

Without Supabase, the same inquiry/approval/quote/review flow is a labelled, browser-local demo. No money is collected, and links only work where those demo records exist.

## Supabase setup

For a new database, run supabase/schema.sql. For an existing database with the earlier booking schema, run supabase/migrations/20261019_booking_payments.sql instead. The migration adds private client tokens, quote fields, paid timestamps, payment attempts, a single-pending-checkout index, an immutable-paid-quote trigger, and the atomic record_verified_payment function.

Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in .env.local. Create John's Auth user and explicitly add that user UUID to studio_admins. Set APP_URL to the public HTTPS origin at deployment. Restart Next.js after changing environment variables.

Anonymous users cannot read or insert into booking tables directly. The validated booking API accepts inquiries; private portal requests require the booking UUID and a 64-character random bearer token. Tokens travel in the URL fragment and Authorization header, rather than server URL query strings. Client API responses are not cached. Studio RLS and column grants permit quote/detail updates but do not permit setting payment status. Only the service role can execute payment settlement. Do not expose the service-role key through NEXT_PUBLIC variables.

Private booking links are bearer credentials: anyone given the whole link can view that booking. An authenticated client account and automatic email delivery are not part of this flow.

## Payment provider connection still required

src/lib/payment-provider.ts defines the adapter contract and intentionally returns null until a real provider is selected. Merely setting PAYMENT_PROVIDER does not enable charging. Supply the provider name, official checkout/API and webhook documentation, sandbox credentials, settlement currency and whether the agreed quote is a deposit or the full fee. The earlier Bachs pricing link does not specify a checkout API contract.

Implement createCheckout with provider-supported idempotency keyed by attemptId, and verifyWebhook using the raw request body and the provider's signature verification. Return the normalized attempt ID, booking ID, reference, integer amount and currency from verified provider data. The /api/payments route reuses matching pending checkout sessions; it rejects stale quote amounts and paid/unapproved requests. /api/payments/webhook passes verified details to one database transaction which checks the stored checkout and current quote, handles repeated successful delivery, and updates payment and booking records together. Ambiguous or failed reconciliation needs studio/provider review; no refund is automatically performed.

Current supported quote currencies use two decimal minor units: NGN, USD, EUR, GBP, GHS, CAD, AUD and ZAR. Final provider and currency support must be validated against the selected provider.

Before live traffic, validate hosted RLS and settlement in the provider sandbox, including duplicate callbacks, wrong signatures, amount/currency mismatches, concurrent checkout, changed quotes and failed payments. Confirm date capacity/holds, payment terms, contact details, privacy/retention and persistent form abuse protection. Dates are manually approved; there is no automatic scheduling capacity or cancellation/refund policy.

## Local verification

npm run build
node scripts/test-booking-payment-flow.cjs
node scripts/test-payment-contract.cjs

The first browser test uses synthetic local demo data. The second executes route handlers with a mocked provider/database to verify checkout guards, server-owned amounts, signature failure and reconciliation arguments. These are not hosted Supabase or live payment tests. No real charge has been attempted.

## Studio management

The dashboard now includes bookings, payment attempts, clients, portfolio projects, public copy, media, availability, site settings and content backups. See [Studio management coverage and setup](STUDIO-MANAGEMENT.md). Existing Supabase projects must apply `supabase/migrations/20261019_studio_management.sql` after the booking/payment migration. Fresh setup can use the complete `supabase/schema.sql` instead. The browser demo is not a live database; provider checkout still requires its adapter and credentials.

Availability, temporary holds, deposit/full-fee payments and studio email setup: see [AVAILABILITY-EMAIL.md](AVAILABILITY-EMAIL.md). Existing projects must apply the 20261020_availability_notifications.sql migration after prior migrations. Live alerts require Resend credentials, a verified sender and a protected five-minute scheduler.

Dashboard authentication is now enforced on the server, with cookie-backed Supabase sessions and administrator membership checks. See [AUTH.md](AUTH.md) for setup, recovery redirects, and the removal of open demo access.
