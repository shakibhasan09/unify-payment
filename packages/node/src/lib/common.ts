import Stripe from "stripe";
import { LemonSqueezy, UnifyLemonSqueezy } from "./lemonsqueezy";
import { UnifyStripe } from "./stripe";

export type UnifyPaymentOptions = {
  stripe?: Stripe;
  lemonsqueezy?: LemonSqueezy;
};

export class UnifyPayment<T extends UnifyPaymentOptions = UnifyPaymentOptions> {
  stripe: T["stripe"] extends Stripe ? UnifyStripe : undefined;

  lemonsqueezy: T["lemonsqueezy"] extends LemonSqueezy
    ? UnifyLemonSqueezy
    : undefined;

  constructor(options: T) {
    this.stripe = new UnifyStripe(options.stripe!) as T["stripe"] extends Stripe
      ? UnifyStripe
      : undefined;

    this.lemonsqueezy = new UnifyLemonSqueezy(
      options.lemonsqueezy!
    ) as T["lemonsqueezy"] extends LemonSqueezy ? UnifyLemonSqueezy : undefined;
  }
}
