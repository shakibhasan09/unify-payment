# @unify-payment/node

## 1.1.0

### Minor Changes

- Audit pass across webhook security, provider wrappers, types, and packaging.
  - Webhook signature verification now uses `crypto.timingSafeEqual` on Buffer comparisons for LemonSqueezy, Razorpay, Coinbase, and Polar — string equality is vulnerable to timing attacks.
  - LemonSqueezy `verifyWebhook` reads the event type from the payload's `meta.event_name` instead of the previously empty header channel; the unified result's `type` is no longer always `""`.
  - Stripe wrapper consolidates onto a single SDK instance: `getCheckoutUrl` is replaced by `createCheckoutSession` returning the full Session, and the unified bridge no longer instantiates a parallel `StripeSDK`. **Breaking** for anyone importing `UnifyPayment.Stripe` directly.
  - Drop `node-rsa` and `dayjs` dependencies. Nagad now uses `crypto.privateDecrypt` for RSA and `Intl.DateTimeFormat` with `hourCycle: "h23"` for the Asia/Dhaka timestamp.
  - Widen `currency` types on PayPal and SSLCommerz from `"USD" | "EUR"` to `string`; both gateways support far more currencies and the user-provided value was already passed through unchecked. Bkash now forwards `params.currency` instead of hardcoding `"BDT"`.
  - Document on `CreateCheckoutSessionParams.amount` that the value is always the currency's smallest unit (cents, paise, poisha) so callers don't have to reverse-engineer it per provider.
  - Remove five unused private URL helpers from the SSLCommerz wrapper.
  - Add an `exports` map, `engines.node >=18`, and the missing provider keywords (paypal, paddle, polar, razorpay, coinbase, webhook) to the published `package.json`.

## 1.0.3

### Patch Changes

- Replaced `axios` with native `fetch` to reduce bundle size and remove external dependency

## 1.0.2

### Patch Changes

- Updated package version

## 1.0.1

### Patch Changes

- Updated package version

## 1.0.0

### Major Changes

- Enhanced README with detailed payment provider integration examples and webhook verification

## 0.0.11

### Patch Changes

- Test

## 0.0.10

### Patch Changes

- Added github actions

## 0.0.9

### Patch Changes

- Added chageset
