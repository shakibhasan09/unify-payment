import Stripe from "stripe";
import { LemonSqueezy, UnifyLemonSqueezy } from "./lemonsqueezy";
import { UnifyStripe } from "./stripe";
import { Paddle } from "@paddle/paddle-node-sdk";
import { UnifyPaddle } from "./paddle";

export type UnifyPaymentOptions = {
  stripe?: Stripe;
  lemonsqueezy?: LemonSqueezy;
  paddle?: Paddle;
};

export class UnifyPayment<T extends UnifyPaymentOptions = UnifyPaymentOptions> {
  stripe: T["stripe"] extends Stripe ? UnifyStripe : undefined;

  lemonsqueezy: T["lemonsqueezy"] extends LemonSqueezy
    ? UnifyLemonSqueezy
    : undefined;

  paddle: T["paddle"] extends Paddle ? UnifyPaddle : undefined;

  constructor(options: T) {
    this.stripe = new UnifyStripe(options.stripe!) as T["stripe"] extends Stripe
      ? UnifyStripe
      : undefined;

    this.lemonsqueezy = new UnifyLemonSqueezy(
      options.lemonsqueezy!
    ) as T["lemonsqueezy"] extends LemonSqueezy ? UnifyLemonSqueezy : undefined;

    this.paddle = new UnifyPaddle(options.paddle!) as T["paddle"] extends Paddle
      ? UnifyPaddle
      : undefined;
  }
}
