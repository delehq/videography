# Studio authentication

The dashboard is no longer an open browser demo. Requests to /dashboard require a verified Supabase user and a matching studio_admins row. Missing configuration, missing/expired sessions, membership removal and provider errors fail closed.

## Flow

- /login: email/password sign-in, password visibility control, generic credential errors and a password-recovery link. There is no public registration.
- /forgot-password: requests a Supabase recovery email with a generic response that does not confirm whether an account exists.
- /auth/callback: exchanges a PKCE code for a session. The only permitted destinations are /dashboard and /reset-password. Invalid links return to login. Redirect locations are relative to the current site.
- /reset-password: requires an authenticated studio administrator, at least 12 characters and matching confirmation; updates the password and signs out before returning to login.
- Sign out clears the session and returns to /login. The client boundary listens for sign-out/auth changes and rechecks access on focus and every minute. Private database/API writes are independently protected, not dependent on that polling interval.

The Next.js proxy refreshes cookie-backed sessions. The dashboard server layout independently verifies the current user with auth.getUser() and checks membership before rendering any workspace. The client boundary repeats the check and clears its workspace on lost access. Private APIs continue validating bearer tokens and membership, and Supabase row-level policies protect bookings/payments when queried by the browser.

No localStorage flag, demo password, public account registration or unconfigured-mode bypass grants dashboard access. Data already saved in a browser's former demo storage remain local to that browser, but cannot open the secured dashboard.

Implementation follows the [Supabase server-side auth guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), using @supabase/ssr for cookie-backed browser/server clients. Server authorization never trusts getSession() as proof of identity. Server layouts read cookies; the proxy/route handlers handle refresh and cookie writes. Auth pages are excluded from indexing and caching.

## Owner setup

1. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and the server-only SUPABASE_SERVICE_ROLE_KEY in the environment. Restart development or rebuild deployment after changing public environment variables.
2. Apply the existing Supabase schema/migrations. Create the owner's email/password account in Supabase Authentication, using a strong unique password.
3. Add that account's actual Auth UUID to public.studio_admins. A valid Supabase login alone does not grant studio access. Do not grant this row to ordinary visitors.
4. Set the Supabase Auth Site URL to the site's real origin. Add the exact /auth/callback and /auth/callback?next=/reset-password URLs to the allowed redirect list for development and production.
5. Configure Supabase Auth email delivery and password-recovery templates. Auth recovery mail is managed by Supabase; the separate studio-event Resend queue does not send password-reset messages. A verified SMTP sender can be configured in Supabase as needed.
6. Open /login. Test owner login, a non-admin account denial, password recovery in the same browser that requested it, logout and a subsequent direct dashboard request. PKCE recovery links may fail when opened in a different browser because the verifier is stored in the requesting browser.

Accounts are administratively provisioned; no invitation-mail redemption flow is implemented. Public signup can be disabled in Supabase because clients currently book using private booking links rather than accounts. There are no default administrator credentials in the repository.

## Verification and limitations

- scripts/test-auth-access.cjs verifies no-config lockout, forged browser flags/cookies, server and RSC redirects, denial with JavaScript disabled, private API rejection, invalid recovery/open-redirect handling, no signup UI and desktop/mobile layouts.
- scripts/test-auth-contract.cjs mocks Supabase to verify authenticated administrator authorization, non-admin rejection, provider failure, independent server-layout checks and callback allowlisting.
- Production build passed. Live sign-in, refresh, logout and recovery email delivery still require the configured Supabase project and real administrator account; those were not exercised using live credentials.

Older browser-demo dashboard tests assumed unprotected access. They require an authenticated project/fixture before running against this secured version; they must not be made to pass by adding a public bypass.
