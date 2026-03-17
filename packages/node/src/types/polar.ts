export interface IPolarOptions {
  accessToken: string;
  sandbox?: boolean;
}

export interface IPolarCheckoutCreatePayload {
  products: Array<{ product_id: string; quantity?: number }>;
  customer_email?: string;
  customer_name?: string;
  customer_external_id?: string;
  success_url?: string;
  metadata?: Record<string, string>;
  allow_discount_codes?: boolean;
  discount_id?: string;
}

export interface IPolarCheckoutResponse {
  id: string;
  url: string;
  client_secret: string;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  amount: number | null;
  currency: string | null;
  metadata: Record<string, string>;
  created_at: string;
  modified_at: string | null;
  expires_at: string;
}

export type TPolarWebhookEvents =
  | "checkout.created"
  | "checkout.updated"
  | "order.created"
  | "order.paid"
  | "order.updated"
  | "order.refunded"
  | "subscription.created"
  | "subscription.active"
  | "subscription.canceled"
  | "subscription.updated";
