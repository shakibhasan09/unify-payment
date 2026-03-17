import { Bkash } from "./lib/bkash";
import { LemonSqueezy } from "./lib/lemonsqueezy";
import { Nagad } from "./lib/nagad";
import { Paypal } from "./lib/paypal";
import { SSLCommerz } from "./lib/sslcommerz";
import { Stripe } from "./lib/stripe";
import { createPayment } from "./unified";

const UnifyPayment = {
  LemonSqueezy,
  Bkash,
  Paypal,
  SSLCommerz,
  Stripe,
  Nagad,
};

export { UnifyPayment, createPayment };

export type {
  PaymentConfig,
  PaymentInstance,
  CheckoutSession,
  CreateCheckoutSessionParams,
  StripeConfig,
  PaypalConfig,
  LemonSqueezyConfig,
  BkashConfig,
  SSLCommerzConfig,
  NagadConfig,
  StripeCheckoutSessionParams,
  PaypalCheckoutSessionParams,
  LemonSqueezyCheckoutSessionParams,
  BkashCheckoutSessionParams,
  SSLCommerzCheckoutSessionParams,
  NagadCheckoutSessionParams,
  VerifyWebhookParams,
  WebhookEvent,
} from "./types/unified";
