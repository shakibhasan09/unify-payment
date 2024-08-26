import { Paddle } from "@paddle/paddle-node-sdk";
import Stripe from "stripe";
import { LemonSqueezy, UnifyLemonSqueezy } from "./lemonsqueezy";
import { UnifyPaddle } from "./paddle";
import { SSLCommerz, UnifySSLCommerz } from "./sslcommerz";
import { UnifyStripe } from "./stripe";
import { Paypal, UnifyPaypal } from "./paypal";

export type UnifyPaymentOptions = {
  stripe?: Stripe;
  lemonsqueezy?: LemonSqueezy;
  sslcommerz?: SSLCommerz;
  paddle?: Paddle;
  paypal?: Paypal;
};

export class UnifyPayment<T extends UnifyPaymentOptions = UnifyPaymentOptions> {
  stripe: T["stripe"] extends Stripe ? UnifyStripe : undefined;
  sslcommerz: T["sslcommerz"] extends SSLCommerz ? UnifySSLCommerz : undefined;
  lemonsqueezy: T["lemonsqueezy"] extends LemonSqueezy
    ? UnifyLemonSqueezy
    : undefined;
  paddle: T["paddle"] extends Paddle ? UnifyPaddle : undefined;
  paypal: T["paypal"] extends Paypal ? UnifyPaypal : undefined;

  constructor(options: T) {
    // stripe
    this.stripe = new UnifyStripe(options.stripe!) as T["stripe"] extends Stripe
      ? UnifyStripe
      : undefined;

    // sslcommerz
    this.sslcommerz = new UnifySSLCommerz(
      options.sslcommerz!
    ) as T["sslcommerz"] extends SSLCommerz ? UnifySSLCommerz : undefined;

    // lemonsqueezy
    this.lemonsqueezy = new UnifyLemonSqueezy(
      options.lemonsqueezy!
    ) as T["lemonsqueezy"] extends LemonSqueezy ? UnifyLemonSqueezy : undefined;

    // paddle
    this.paddle = new UnifyPaddle(options.paddle!) as T["paddle"] extends Paddle
      ? UnifyPaddle
      : undefined;

    // paypal
    this.paypal = new UnifyPaypal(options.paypal!) as T["paypal"] extends Paypal
      ? UnifyPaypal
      : undefined;
  }
}
