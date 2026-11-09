# Availability and studio email

Weddings reserve a whole date. Commercial shoots offer full-day or half-day coverage with start times, a duration and a buffer after each shoot. Configure timezone, working days/hours, minimum notice, duration, buffer and payment hold length in Dashboard → Availability → Save records.

An inquiry does not reserve a slot. Approval starts a hold (48 hours by default); verified payment confirms it. Expired unpaid holds stop blocking availability immediately. Renewing a hold rechecks availability. Cancellation releases the slot; archiving only hides the record and leaves its private link and reservation intact.

The studio can prepare a quote before approval. The amount collected can be a deposit or the full fee. New inquiries default to deposit; legacy records keep their full-payment meaning. Remaining balances and refunds are agreed separately; automatic balance invoicing/refunds are not implemented. A payment arriving after hold expiry requires studio review and cannot claim a released slot.

Database guards serialize approval, schedule/hold changes and confirmation, and check overlapping reservations including buffers. Pending inquiries can request the same date; two overlapping approvals cannot both succeed. Existing reservations keep their stored times and buffer when working-hour settings change.

## Studio email

Important booking changes queue a private notification in the same database transaction: new inquiry, approval/decline/return to pending, quote, schedule, cancellation, renewed/expired hold and verified payment. Payment reconciliation problems also queue a review alert. These messages go to the studio, not automatically to clients.

The worker uses [Resend's email API](https://resend.com/docs/api-reference/emails/send-email) with a stable [idempotency key](https://resend.com/changelog/idempotency-keys) per event. Queue claims use leases and SKIP LOCKED. Failed requests back off and retry up to eight times within a 23-hour window; later manual retries require checking provider logs first. Notification failures do not roll back a saved inquiry or verified payment.

Dashboard → Notifications shows the latest 200 events, their status, provider reference and safe error details, with processing/retry controls. “Accepted” means the provider accepted the request; inbox delivery is not verified. Delivery/bounce webhooks are not implemented.

Set server-only environment variables RESEND_API_KEY, STUDIO_EMAIL_FROM, STUDIO_NOTIFY_EMAIL, APP_URL and CRON_SECRET. Use a verified sender domain, the real site origin and a strong random cron secret. The recipient setting accepts comma-separated studio recipients. Never use NEXT_PUBLIC variables for these secrets.

Configure a hosting scheduler or external cron service to call GET /api/cron/notifications every five minutes with Authorization: Bearer followed by CRON_SECRET. This is required for unattended retries and expired-hold notifications while the dashboard is closed. Inquiry saves and payment callbacks also attempt processing after the response, and studio updates request a queue flush; these do not replace the scheduler.

Without credentials, events remain queued and no real email is sent. The browser demo records clearly labeled “Demo · not emailed” events. No real email was sent during implementation or testing.

## Setup and verification

Fresh installations run the complete supabase/schema.sql once. Existing projects apply supabase/migrations/20261020_availability_notifications.sql after the prior booking/payment and studio-management migrations. Do not apply the same migration twice. Existing approved unpaid inquiries receive a 48-hour transitional hold; review them before live traffic. Legacy coverage is conservative until reviewed/rescheduled.

Public calendar responses contain availability and schedule rules only, without client identities, booking IDs, notes or block reasons. Studio endpoints require a validated Supabase session and studio_admins membership. The cron endpoint requires its secret.

- scripts/test-availability-postgres.cjs uses an isolated PostgreSQL 16 Docker container named john-availability-test and its john_availability test database. It tests real schema/triggers, concurrent approvals, buffers, expiry, archive safety, cancellation, paid-booking guards, block conflicts and idempotent payment/notification events. It does not use the client's database.
- scripts/test-availability-flow.cjs tests the browser calendar, commercial times, approval holds, disabled reserved dates, demo notifications, access guards and desktop/mobile fit.
- scripts/test-notification-worker.cjs mocks email sending and tests recipient selection, idempotency keys, acceptance, failure backoff and missing credentials.

Hosted Supabase access, the deployed scheduler, sender-domain verification/inbox delivery and actual payment callbacks still need the client's configured services. The payment provider remains unselected, so checkout cannot charge money yet.
