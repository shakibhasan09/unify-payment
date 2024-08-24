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
}
