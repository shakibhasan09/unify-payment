import Stripe from "stripe";

export { Stripe };

export class UnifyStripe {
  constructor(private stripe: Stripe) {}

  async getCheckoutUrl(params: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create(params);
    if (!session.url) {
      throw new Error("Failed to get checkout url");
    }
    return session.url;
  }

  webhook = new UnifyStripeWebhook(this.stripe);
}

export type StripeWebhookEventResponse =
  | { error: Error }
  | { event: Stripe.Event };

export class UnifyStripeWebhook {
  constructor(private stripe: Stripe) {}

  async verifySignature(payload: {
    signature: string;
    secret: string;
    body: string;
  }): Promise<StripeWebhookEventResponse> {
    try {
      const event = await this.stripe.webhooks.constructEventAsync(
        payload.body,
        payload.signature,
        payload.secret
      );

      return {
        event,
      };
    } catch (err) {
      return {
        error: err as Error,
      };
    }
  }
}
