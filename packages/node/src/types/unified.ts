import { Stripe as StripeSDK } from "stripe";

// --- Provider configs (discriminated union) ---

export type StripeConfig = {
  provider: "stripe";
  apiKey: string;
  config?: StripeSDK.StripeConfig;
};

export type PaypalConfig = {
  provider: "paypal";
  clientId: string;
  clientSecret: string;
  sandbox?: boolean;
};

export type LemonSqueezyConfig = {
  provider: "lemonsqueezy";
  apiKey: string;
};

export type BkashConfig = {
  provider: "bkash";
  apiUrl: string;
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
};

export type SSLCommerzConfig = {
  provider: "sslcommerz";
  apiUrl: string;
  storeId: string;
  storePassword: string;
};

export type NagadConfig = {
  provider: "nagad";
  merchantId: string;
  merchantNumber: string;
  privateKey: string;
  publicKey: string;
  callbackUrl: string;
  apiVersion: string;
  isLive?: boolean;
};

export type PolarConfig = {
  provider: "polar";
  accessToken: string;
  sandbox?: boolean;
};

export type RazorpayConfig = {
  provider: "razorpay";
  keyId: string;
  keySecret: string;
};

export type PaymentConfig =
  | StripeConfig
  | PaypalConfig
  | LemonSqueezyConfig
  | BkashConfig
  | SSLCommerzConfig
  | NagadConfig
  | PolarConfig
  | RazorpayConfig;

// --- Unified checkout session params ---

export interface CreateCheckoutSessionParams {
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "stripe";
  productName?: string;
  metadata?: Record<string, string>;
  overrides?: Partial<StripeSDK.Checkout.SessionCreateParams>;
}

export interface PaypalCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "paypal";
  description?: string;
  brandName?: string;
}

export interface LemonSqueezyCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "lemonsqueezy";
  storeId: string;
  variantId: string;
  redirectUrl?: string;
}

export interface BkashCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "bkash";
  payerReference: string;
  merchantInvoiceNumber: string;
}

export interface SSLCommerzCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "sslcommerz";
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerPostcode: string;
  customerCountry: string;
  customerPhone: string;
  productName: string;
  productCategory: string;
  productProfile?:
    | "general"
    | "physical-goods"
    | "non-physical-goods"
    | "airline-tickets"
    | "travel-vertical"
    | "telecom-vertical";
  shippingMethod?: "NO" | "YES";
}

export interface NagadCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "nagad";
  orderId: string;
  ip: string;
  clientType?: "PC_WEB" | "MOBILE_WEB" | "MOBILE_APP" | "WALLET_WEB_VIEW" | "BILL_KEY";
  productDetails?: Record<string, string>;
}

export interface RazorpayCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "razorpay";
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerContact?: string;
  notes?: Record<string, string>;
}

export interface PolarCheckoutSessionParams extends CreateCheckoutSessionParams {
  provider?: "polar";
  productId: string;
  quantity?: number;
  customerEmail?: string;
  customerName?: string;
  customerExternalId?: string;
  metadata?: Record<string, string>;
  discountId?: string;
  allowDiscountCodes?: boolean;
}

// --- Checkout session result ---

export interface CheckoutSession {
  url: string;
  sessionId?: string;
  raw?: unknown;
}

// --- Webhook verification ---

export interface VerifyWebhookParams {
  body: string;
  signature: string;
  secret: string;
  webhookId?: string;
  timestamp?: string;
}

export interface WebhookEvent {
  type: string;
  data: unknown;
  raw: unknown;
}

// --- Unified payment instance ---

export type CheckoutParamsForConfig<T extends PaymentConfig> =
  T extends StripeConfig ? StripeCheckoutSessionParams :
  T extends PaypalConfig ? PaypalCheckoutSessionParams :
  T extends LemonSqueezyConfig ? LemonSqueezyCheckoutSessionParams :
  T extends BkashConfig ? BkashCheckoutSessionParams :
  T extends SSLCommerzConfig ? SSLCommerzCheckoutSessionParams :
  T extends NagadConfig ? NagadCheckoutSessionParams :
  T extends PolarConfig ? PolarCheckoutSessionParams :
  T extends RazorpayConfig ? RazorpayCheckoutSessionParams :
  CreateCheckoutSessionParams;

export interface PaymentInstance<T extends PaymentConfig = PaymentConfig> {
  createCheckoutSession(params: CheckoutParamsForConfig<T>): Promise<CheckoutSession>;
  verifyWebhook?(params: VerifyWebhookParams): Promise<WebhookEvent>;
}
