import Stripe from "stripe";

export class UnifyStripe {
  constructor(private stripe: Stripe) {}

  async getCheckoutUrl(params: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create(params);
    if (!session.url) {
      throw new Error("Failed to get checkout url");
    }

    return session.url;
  }
}
