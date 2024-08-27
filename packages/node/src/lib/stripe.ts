import { Stripe as StripeSDK } from "stripe";
import { TStripeWebhookEventResponse } from "../types/stripe";

export class Stripe {
  private stripe: StripeSDK;

  constructor(
    private apiKey: string,
    config: StripeSDK.StripeConfig
  ) {
    this.stripe = new StripeSDK(apiKey, config);
  }

  async getCheckoutUrl(params: StripeSDK.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create(params);
    if (!session.url) {
      throw new Error("Failed to get checkout url");
    }
    return session.url;
  }

  async verifySignature(payload: {
    signature: string;
    secret: string;
    body: string;
  }): Promise<TStripeWebhookEventResponse> {
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
