# UnifyPayment

UnifyPayment is a TypeScript package that provides a unified interface for integrating with multiple payment providers, such as Stripe, LemonSqueezy, and more. With UnifyPayment, developers can easily switch between different payment providers without having to rewrite their payment logic.

## Features

- **Unified API:** Use a single class to interact with various payment providers.
- **Provider Agnostic:** Switch between different payment providers with minimal code changes.
- **Easy Integration:** Simplifies the integration process with well-documented methods and examples.
- **Extensible:** Easily add support for new payment providers as needed.

## Installation

To install the package, run the following command:

```bash
npm install unify-payment
```

## Usage

```typescript
const stripeKey = process.env.STRIPE_API_SECRET_KEY!;
const lemonsqueezyKey = process.env.LEMON_SECRET_KEY!;

const unify = new UnifyPayment({
  stripe: new Stripe(stripeKey),
  lemonsqueezy: new LemonSqueezy(lemonsqueezyKey),
});

const url1 = await unify.stripe.getCheckoutUrl(stripePayload);
const url2 = await unify.lemonsqueezy.getCheckoutUrl(lemonsqueezyPayload);
```
