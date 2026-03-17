export interface IPaddleOptions {
  apiKey: string;
  sandbox?: boolean;
}

export interface IPaddleTransactionCreatePayload {
  items: Array<{
    price_id: string;
    quantity: number;
  }>;
  customer_id?: string;
  currency_code?: string;
  collection_mode?: "automatic" | "manual";
  custom_data?: Record<string, string>;
  checkout?: {
    url?: string;
  };
}

export interface IPaddleTransactionResponse {
  id: string;
  status: string;
  checkout: {
    url: string | null;
  } | null;
  currency_code: string;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export type TPaddleWebhookEvents =
  | "transaction.created"
  | "transaction.ready"
  | "transaction.billed"
  | "transaction.completed"
  | "transaction.canceled"
  | "transaction.payment_failed"
  | "transaction.past_due"
  | "transaction.updated"
  | "subscription.created"
  | "subscription.updated"
  | "subscription.canceled"
  | "subscription.past_due"
  | "subscription.paused"
  | "subscription.resumed"
  | "subscription.activated"
  | "subscription.trialing"
  | "customer.created"
  | "customer.updated";
