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
// Stripe
const unify = new UnifyPayment({
  stripe: new Stripe(process.env.STRIPE_API_SECRET_KEY!),
});
const redirect = await unify.stripe.getCheckoutUrl(stripePayload);

// LemonSqueezy
const unify = new UnifyPayment({
  lemonsqueezy: new LemonSqueezy(process.env.LEMON_SECRET_KEY!),
});
const redirect = await unify.lemonsqueezy.getCheckoutUrl(lemonsqueezyPayload);
```

## Webhook

```typescript
// Stripe
const unify = new UnifyPayment({
  stripe: new Stripe(stripeKey),
});

const sign = c.req.header("Stripe-Signature");
if (!sign) throw new Error("No Signature");

const webhookEvent = await unify.stripe.webhook.verifySignature({
  signature: sign,
  secret: "PUT YOUR WEBHOOK SECRET HERE",
  body: await c.req.text(),
});

if ("error" in webhookEvent) throw new Error(webhookEvent.error.message);

switch (webhookEvent.event.type) {
  case "checkout.session.async_payment_succeeded":
    break;

  default:
    break;
}

// LemonSqueezy
const unify = new UnifyPayment({
  lemonsqueezy: new LemonSqueezy(lemonsqueezyKey),
});

const sign = c.req.header("X-Signature");
if (!sign) throw new Error("No Signature");

const webhookEvent = await unify.lemonsqueezy.webhook.verifySignature({
  signature: sign,
  secret: "PUT YOUR WEBHOOK SECRET HERE",
  body: await c.req.text(),
  x_event: c.req.header("X-Event-Name")!,
});

if ("error" in webhookEvent) throw new Error(webhookEvent.error.message);

switch (webhookEvent.type) {
  case "order_refunded":
    break;

  default:
    break;
}
```

## Contributing

We welcome contributions to UnifyPayment! If you'd like to help improve this package, here's how you can contribute:

1. **Fork the Repository**: Start by forking the [UnifyPayment repository](https://github.com/shakibhasan09/unify-payment) on GitHub.

2. **Clone Your Fork**: Clone your fork to your local machine for development.

   ```bash
   git clone https://github.com/shakibhasan09/unify-payment
   ```

3. Create a Branch: Create a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**: Implement your changes or improvements to the codebase.
5. **Test Your Changes**: Ensure that your changes don't break any existing functionality and add tests if necessary.
6. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message.
   ```bash
   git commit -m "Add a brief description of your changes"
   ```
7. **Push to Your Fork**: Push your changes to your GitHub fork
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Submit a Pull Request**: Go to the original UnifyPayment repository and submit a pull request with a clear description of your changes.

### Guidelines

- Follow the existing code style and conventions.
- Write clear, concise commit messages.
- Add or update tests for new features or bug fixes.
- Update documentation as needed.
- Be respectful and constructive in discussions and code reviews.

## Special Thanks

A special thanks to **Piyush Garg** ([@piyushgargdev](https://www.youtube.com/@piyushgargdev)) for suggesting the idea behind this package. Piyush is a talented developer and content creator who shares valuable insights and ideas in the world of software development. His suggestion was the spark that led to the creation of UnifyPayment, aiming to simplify payment integrations for developers.

We appreciate Piyush's contribution to the developer community and encourage you to check out his YouTube channel for more inspiring content and innovative ideas in the tech space.
