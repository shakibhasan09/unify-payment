import { Stripe as StripeSDK } from "stripe";
import { TStripeWebhookEventResponse } from "../types/stripe";

export class Stripe {
  private stripe: StripeSDK;

  constructor(apiKey: string, config?: StripeSDK.StripeConfig) {
    this.stripe = new StripeSDK(apiKey, config);
  }

  async createCheckoutSession(
    params: StripeSDK.Checkout.SessionCreateParams
  ): Promise<StripeSDK.Checkout.Session> {
    return this.stripe.checkout.sessions.create(params);
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
