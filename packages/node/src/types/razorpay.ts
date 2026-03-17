export interface IRazorpayOptions {
  keyId: string;
  keySecret: string;
}

export interface IRazorpayPaymentLinkPayload {
  amount: number;
  currency: string;
  description?: string;
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notify?: {
    sms?: boolean;
    email?: boolean;
  };
  callback_url: string;
  callback_method: "get";
  notes?: Record<string, string>;
}

export interface IRazorpayPaymentLinkResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  short_url: string;
  description: string | null;
  created_at: number;
  cancelled_at: number | null;
  expired_at: number | null;
}

export type TRazorpayWebhookEvents =
  | "payment.authorized"
  | "payment.captured"
  | "payment.failed"
  | "payment_link.paid"
  | "payment_link.partially_paid"
  | "payment_link.expired"
  | "payment_link.cancelled"
  | "order.paid"
  | "refund.created"
  | "refund.processed"
  | "refund.failed";
