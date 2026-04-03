<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Recurrly, an Expo (React Native) subscription tracking app. Here is a summary of all changes made:

- **`app.config.js`** (new): Created to expose PostHog config via `expo-constants` extras, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables at build time.
- **`lib/posthog.ts`** (new): PostHog singleton client configured with `expo-constants`, with batching, feature flags, and graceful no-op when unconfigured.
- **`.env`** (updated): Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **`app/_layout.tsx`** (updated): Wrapped the app with `PostHogProvider` (outside `ClerkProvider`), added manual screen tracking via `usePathname`/`useGlobalSearchParams` and `posthog.screen()`.
- **`app/(auth)/sign-in.tsx`** (updated): Added `user_signed_in` event + `posthog.identify()` on successful finalize, and `sign_in_failed` on auth error.
- **`app/(auth)/sign-up.tsx`** (updated): Added `user_signed_up` event + `posthog.identify()` on successful finalize, `sign_up_failed` on error, `email_verification_requested` after code is sent, and `email_verification_completed` after code is verified.
- **`app/(tabs)/settings.tsx`** (updated): Added `user_signed_out` event and `posthog.reset()` before sign-out.
- **`app/(tabs)/index.tsx`** (updated): Added `subscription_card_expanded` and `subscription_card_collapsed` events when users interact with subscription cards.
- **`app/subscriptions/[id].tsx`** (updated): Added `subscription_details_viewed` event on mount.
- **`app/onboarding.tsx`** (updated): Added `onboarding_viewed` event on mount and `onboarding_completed` event when user navigates to dashboard.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully completes sign-in (after finalize) | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User successfully completes sign-up and email verification | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User signs out from the settings screen | `app/(tabs)/settings.tsx` |
| `sign_in_failed` | A sign-in attempt fails due to an error | `app/(auth)/sign-in.tsx` |
| `sign_up_failed` | A sign-up attempt fails due to an error | `app/(auth)/sign-up.tsx` |
| `email_verification_requested` | Verification code successfully sent during sign-up | `app/(auth)/sign-up.tsx` |
| `email_verification_completed` | User successfully verifies their email during sign-up | `app/(auth)/sign-up.tsx` |
| `subscription_details_viewed` | User opens the detail screen for a specific subscription | `app/subscriptions/[id].tsx` |
| `subscription_card_expanded` | User expands a subscription card on the home screen | `app/(tabs)/index.tsx` |
| `subscription_card_collapsed` | User collapses an expanded subscription card | `app/(tabs)/index.tsx` |
| `onboarding_viewed` | User lands on the onboarding screen (top of activation funnel) | `app/onboarding.tsx` |
| `onboarding_completed` | User presses 'Back to dashboard' to complete onboarding | `app/onboarding.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/152974/dashboard/603288
- **Sign-up conversion funnel**: https://eu.posthog.com/project/152974/insights/V9WGxyl8
- **Sign-in to subscription engagement funnel**: https://eu.posthog.com/project/152974/insights/zp8iTvox
- **Onboarding completion funnel**: https://eu.posthog.com/project/152974/insights/C5I8CSHm
- **Authentication failures over time**: https://eu.posthog.com/project/152974/insights/UmhGA5Hw
- **Daily active users (sign-ins)**: https://eu.posthog.com/project/152974/insights/hbI6aV54

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
