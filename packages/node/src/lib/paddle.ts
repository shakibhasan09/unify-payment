import {
  Environment,
  Paddle as PaddleSDK,
  type EventEntity,
} from "@paddle/paddle-node-sdk";
import type { IPaddleOptions } from "../types/paddle";

export class Paddle {
  private sdk: PaddleSDK;

  constructor(options: IPaddleOptions) {
    this.sdk = new PaddleSDK(options.apiKey, {
      environment: options.sandbox ? Environment.sandbox : Environment.production,
    });
  }

  async createTransaction(params: {
    items: Array<{ priceId: string; quantity: number }>;
    customerId?: string;
    customData?: Record<string, string>;
  }): Promise<{ id: string; url: string }> {
    const transaction = await this.sdk.transactions.create({
      items: params.items.map((item) => ({
        priceId: item.priceId,
        quantity: item.quantity,
      })),
      ...(params.customerId && { customerId: params.customerId }),
      ...(params.customData && { customData: params.customData }),
    });

    const url = transaction.checkout?.url;
    if (!url) {
      throw new Error("Failed to create Paddle checkout session");
    }

    return { id: transaction.id, url };
  }

  async verifySignature(payload: {
    body: string;
    secret: string;
    signature: string;
  }): Promise<{ type: string; event: EventEntity } | { error: Error }> {
    try {
      const event = this.sdk.webhooks.unmarshal(
        payload.body,
        payload.secret,
        payload.signature,
      );

      if (!event) {
        throw new Error("Invalid webhook signature");
      }

      return {
        type: event.eventType,
        event: event,
      };
    } catch (err) {
      return { error: err as Error };
    }
  }
}
