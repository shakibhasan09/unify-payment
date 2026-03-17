import { Bkash } from "./lib/bkash";
import { LemonSqueezy } from "./lib/lemonsqueezy";
import { Nagad } from "./lib/nagad";
import { Paypal } from "./lib/paypal";
import { Polar } from "./lib/polar";
import { Razorpay } from "./lib/razorpay";
import { SSLCommerz } from "./lib/sslcommerz";
import { Stripe } from "./lib/stripe";
import { createPayment } from "./unified";

const UnifyPayment = {
  LemonSqueezy,
  Bkash,
  Paypal,
  Polar,
  Razorpay,
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
  PolarConfig,
  RazorpayConfig,
  StripeCheckoutSessionParams,
  PaypalCheckoutSessionParams,
  LemonSqueezyCheckoutSessionParams,
  BkashCheckoutSessionParams,
  SSLCommerzCheckoutSessionParams,
  NagadCheckoutSessionParams,
  PolarCheckoutSessionParams,
  RazorpayCheckoutSessionParams,
  VerifyWebhookParams,
  WebhookEvent,
} from "./types/unified";
