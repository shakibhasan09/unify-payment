import { CreateTransactionRequestBody, Paddle } from "@paddle/paddle-node-sdk";

export class UnifyPaddle {
  constructor(private paddle: Paddle) {}

  async getCheckoutUrl(payload: CreateTransactionRequestBody) {
    const transaction = await this.paddle.transactions.create(payload);

    if (!transaction.checkout?.url) {
      throw new Error("Failed to get checkout url");
    }

    return transaction.checkout.url;
  }

  webhook = new UnifyPaddleWebhook(this.paddle);
}

export class UnifyPaddleWebhook {
  constructor(private paddle: Paddle) {}

  async verifySignature(payload: {
    signature: string;
    secret: string;
    body: string;
  }) {
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
