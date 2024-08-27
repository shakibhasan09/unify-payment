import Stripe from "stripe";

export type TStripeWebhookEventResponse =
  | { error: Error }
  | { event: Stripe.Event };
