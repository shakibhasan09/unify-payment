import {
  CreateTransactionRequestBody,
  Paddle as PaddleNodeSdk,
  PaddleOptions,
} from "@paddle/paddle-node-sdk";
import { IPaddleWebhookEventResponse } from "../types/paddle";

export class Paddle {
  private paddle: PaddleNodeSdk;

  constructor(
    private apiKey: string,
    options: PaddleOptions
  ) {
    this.paddle = new PaddleNodeSdk(this.apiKey, options);
  }

  async getCheckoutUrl(payload: CreateTransactionRequestBody) {
    const transaction = await this.paddle.transactions.create(payload);

    if (!transaction.checkout?.url) {
      throw new Error("Failed to get checkout url");
    }

    return transaction.checkout.url;
  }

  async verifySignature(payload: IPaddleWebhookEventResponse) {
    try {
      const event = this.paddle.webhooks.unmarshal(
        payload.body,
        payload.secret,
        payload.signature
      );

      if (!event) {
        throw new Error("Event verification failed");
      }

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
