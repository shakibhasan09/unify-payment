export interface ICoinbaseOptions {
  apiKey: string;
}

export interface ICoinbaseChargePayload {
  name: string;
  description: string;
  pricing_type: "fixed_price" | "no_price";
  local_price: {
    amount: string;
    currency: string;
  };
  redirect_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
}

export interface ICoinbaseChargeResponse {
  data: {
    id: string;
    code: string;
    name: string;
    description: string;
    hosted_url: string;
    pricing_type: string;
    pricing: Record<string, { amount: string; currency: string }>;
    metadata?: Record<string, string>;
    created_at: string;
    expires_at: string;
  };
}

export type TCoinbaseWebhookEvents =
  | "charge:created"
  | "charge:confirmed"
  | "charge:failed"
  | "charge:delayed"
  | "charge:pending"
  | "charge:resolved";
