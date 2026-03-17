# UnifyPayment

UnifyPayment is a TypeScript package that provides a unified interface for integrating with multiple payment providers, such as Stripe, LemonSqueezy, and more. With UnifyPayment, developers can easily switch between different payment providers without having to rewrite their payment logic.

## Features

- **Unified API:** Use a single class to interact with various payment providers.
- **Provider Agnostic:** Switch between different payment providers with minimal code changes.
- **Easy Integration:** Simplifies the integration process with well-documented methods and examples.
- **Extensible:** Easily add support for new payment providers as needed.

## Providers

| Provider     | Checkout | Verify Webhook | Tested Checkout    | Tested Webhook     |
| ------------ | -------- | -------------- | ------------------ | ------------------ |
| Stripe       | Yes      | Yes            | :white_check_mark: | :white_check_mark: |
| LemonSqueezy | Yes      | Yes            | :white_check_mark: | :white_check_mark: |
| SSLCommerz   | Yes      | No             | :x:                | :x:                |
| PayPal       | Yes      | No             | :x:                | :x:                |
| Bkash        | Yes      | No             | :x:                | :x:                |
| Nagad        | Yes      | No             | :x:                | :x:                |
| Razorpay     | Yes      | Yes            | :x:                | :x:                |
| Polar        | Yes      | Yes            | :x:                | :x:                |
| Paddle       | Yes      | Yes            | :x:                | :x:                |
| Coinbase     | Yes      | Yes            | :x:                | :x:                |

## Installation

To install the package, run the following command:

```bash
npm install @unify-payment/node
```

## Usage

```typescript
import { createPayment } from "@unify-payment/node";
```

### Stripe

```typescript
const payment = createPayment({
  provider: "stripe",
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

const { url } = await payment.createCheckoutSession({
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  productName: "Pro Plan",
});
```

### LemonSqueezy

```typescript
const payment = createPayment({
  provider: "lemonsqueezy",
  apiKey: process.env.LEMON_SECRET_KEY!,
});

const { url } = await payment.createCheckoutSession({
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  storeId: "your-store-id",
  variantId: "your-variant-id",
});
```

### PayPal

```typescript
const payment = createPayment({
  provider: "paypal",
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  sandbox: true,
});

const { url } = await payment.createCheckoutSession({
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  description: "Pro Plan",
});
```

### Paddle

```typescript
const payment = createPayment({
  provider: "paddle",
  apiKey: process.env.PADDLE_API_KEY!,
  sandbox: true,
});

const { url } = await payment.createCheckoutSession({
  priceId: "pri_xxxxx",
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
});
```

### Polar

```typescript
const payment = createPayment({
  provider: "polar",
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  sandbox: true,
});

const { url } = await payment.createCheckoutSession({
  productId: "your-product-id",
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
});
```

### Coinbase

```typescript
const payment = createPayment({
  provider: "coinbase",
  apiKey: process.env.COINBASE_API_KEY!,
});

const { url } = await payment.createCheckoutSession({
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  name: "Pro Plan",
  description: "Monthly subscription",
});
```

### Razorpay

```typescript
const payment = createPayment({
  provider: "razorpay",
  keyId: process.env.RAZORPAY_KEY_ID!,
  keySecret: process.env.RAZORPAY_KEY_SECRET!,
});

const { url } = await payment.createCheckoutSession({
  amount: 2999,
  currency: "inr",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  description: "Pro Plan",
});
```

### SSLCommerz

```typescript
const payment = createPayment({
  provider: "sslcommerz",
  apiUrl: process.env.SSLCOMMERZ_API_URL!,
  storeId: process.env.SSLCOMMERZ_STORE_ID!,
  storePassword: process.env.SSLCOMMERZ_SECRET_KEY!,
});

const { url } = await payment.createCheckoutSession({
  amount: 2999,
  currency: "usd",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  transactionId: "txn_123",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerAddress: "123 Main St",
  customerCity: "Dhaka",
  customerState: "Dhaka",
  customerPostcode: "1000",
  customerCountry: "Bangladesh",
  customerPhone: "01700000000",
  productName: "Pro Plan",
  productCategory: "SaaS",
});
```

### Bkash

```typescript
const payment = createPayment({
  provider: "bkash",
  apiUrl: process.env.BKASH_API_URL!,
  username: process.env.BKASH_USERNAME!,
  password: process.env.BKASH_PASSWORD!,
  appKey: process.env.BKASH_APP_KEY!,
  appSecret: process.env.BKASH_APP_SECRET!,
});

const { url } = await payment.createCheckoutSession({
  amount: 500,
  currency: "BDT",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  payerReference: "01700000000",
  merchantInvoiceNumber: "INV-123",
});
```

### Nagad

```typescript
const payment = createPayment({
  provider: "nagad",
  merchantId: process.env.NAGAD_MERCHANT_ID!,
  merchantNumber: process.env.NAGAD_MERCHANT_NUMBER!,
  privateKey: process.env.NAGAD_PRIVATE_KEY!,
  publicKey: process.env.NAGAD_PUBLIC_KEY!,
  callbackUrl: "https://example.com/callback",
  apiVersion: "v1",
  isLive: false,
});

const { url } = await payment.createCheckoutSession({
  amount: 500,
  currency: "BDT",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  orderId: "order_123",
  ip: "127.0.0.1",
});
```

## Webhook Verification

Providers that support webhook verification: **Stripe**, **LemonSqueezy**, **Razorpay**, **Polar**, **Paddle**, **Coinbase**.

```typescript
const payment = createPayment({
  provider: "stripe",
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

const webhookEvent = await payment.verifyWebhook!({
  body: await c.req.text(),
  signature: c.req.header("Stripe-Signature")!,
  secret: process.env.STRIPE_WEBHOOK_SECRET!,
});

console.log(webhookEvent.type); // e.g. "checkout.session.completed"
console.log(webhookEvent.data); // event payload
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

4. **Create**: `apps` directory and setup a nodejs project inside the `apps` directory.

5. **Add Dependencies**: Add `@unify-payment/node` as a dependencies to the `apps/nodejs-project/package.json` file.

6. **Make Changes**: Implement your changes or improvements to the codebase.
7. **Test Your Changes**: Ensure that your changes don't break any existing functionality and add tests if necessary.
8. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message.
   ```bash
   git commit -m "Add a brief description of your changes"
   ```
9. **Push to Your Fork**: Push your changes to your GitHub fork
   ```bash
   git push origin feature/your-feature-name
   ```
10. **Submit a Pull Request**: Go to the original UnifyPayment repository and submit a pull request with a clear description of your changes.

### Guidelines

- Follow the existing code style and conventions.
- Write clear, concise commit messages.
- Add or update tests for new features or bug fixes.
- Update documentation as needed.
- Be respectful and constructive in discussions and code reviews.
