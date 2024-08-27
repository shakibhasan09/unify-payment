import { Bkash } from "./lib/bkash";
import { LemonSqueezy } from "./lib/lemonsqueezy";
import { Paypal } from "./lib/paypal";
import { SSLCommerz } from "./lib/sslcommerz";
import { Stripe } from "./lib/stripe";

const UnifyPayment = {
  LemonSqueezy,
  Bkash,
  Paypal,
  SSLCommerz,
  Stripe,
};

export { UnifyPayment };
