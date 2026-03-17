import { Stripe as StripeSDK } from "stripe";
import { Stripe } from "./lib/stripe";
import { Paypal } from "./lib/paypal";
import { LemonSqueezy } from "./lib/lemonsqueezy";
import { Bkash } from "./lib/bkash";
import { SSLCommerz } from "./lib/sslcommerz";
import { Nagad } from "./lib/nagad";
import { Polar } from "./lib/polar";
import type {
  PaymentConfig,
  PaymentInstance,
  CheckoutSession,
  StripeConfig,
  PaypalConfig,
  LemonSqueezyConfig,
  BkashConfig,
  SSLCommerzConfig,
  NagadConfig,
  PolarConfig,
  StripeCheckoutSessionParams,
  PaypalCheckoutSessionParams,
  LemonSqueezyCheckoutSessionParams,
  BkashCheckoutSessionParams,
  SSLCommerzCheckoutSessionParams,
  NagadCheckoutSessionParams,
  PolarCheckoutSessionParams,
  VerifyWebhookParams,
  WebhookEvent,
} from "./types/unified";

function createStripePayment(config: StripeConfig): PaymentInstance<StripeConfig> {
  const stripe = new Stripe(config.apiKey, config.config);
  const stripeSDK = new StripeSDK(config.apiKey, config.config);

  return {
    async createCheckoutSession(params: StripeCheckoutSessionParams): Promise<CheckoutSession> {
      const sessionParams: StripeSDK.Checkout.SessionCreateParams = {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: params.currency,
              unit_amount: params.amount,
              product_data: {
                name: params.productName || "Payment",
              },
            },
            quantity: 1,
          },
        ],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
        ...params.overrides,
      };

      const session = await stripeSDK.checkout.sessions.create(sessionParams);

      if (!session.url) {
        throw new Error("Failed to create checkout session");
      }

      return {
        url: session.url,
        sessionId: session.id,
        raw: session,
      };
    },

    async verifyWebhook(params: VerifyWebhookParams): Promise<WebhookEvent> {
      const result = await stripe.verifySignature({
        body: params.body,
        signature: params.signature,
        secret: params.secret,
      });

      if ("error" in result) {
        throw result.error;
      }

      return {
        type: result.event.type,
        data: result.event.data.object,
        raw: result.event,
      };
    },
  };
}

function createPaypalPayment(config: PaypalConfig): PaymentInstance<PaypalConfig> {
  const paypal = new Paypal({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    sandbox: config.sandbox,
  });

  return {
    async createCheckoutSession(params: PaypalCheckoutSessionParams): Promise<CheckoutSession> {
      const amountStr = (params.amount / 100).toFixed(2);
      const currencyCode = params.currency.toUpperCase() as "USD" | "EUR";

      const url = await paypal.getCheckoutUrl({
        intent: "CAPTURE",
        purchase_units: [
          {
            items: [
              {
                name: params.description || "Payment",
                description: params.description || "Payment",
                quantity: 1,
                unit_amount: {
                  currency_code: currencyCode,
                  value: amountStr,
                },
              },
            ],
            amount: {
              currency_code: currencyCode,
              value: amountStr,
              breakdown: {
                item_total: {
                  currency_code: currencyCode,
                  value: amountStr,
                },
              },
            },
          },
        ],
        application_context: {
          return_url: params.successUrl,
          cancel_url: params.cancelUrl,
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: params.brandName,
        },
      });

      return { url };
    },
  };
}

function createLemonSqueezyPayment(
  config: LemonSqueezyConfig
): PaymentInstance<LemonSqueezyConfig> {
  const ls = new LemonSqueezy(config.apiKey);

  return {
    async createCheckoutSession(
      params: LemonSqueezyCheckoutSessionParams
    ): Promise<CheckoutSession> {
      const url = await ls.getCheckoutUrl({
        type: "checkouts",
        attributes: {
          custom_price: params.amount,
          product_options: {
            redirect_url: params.redirectUrl || params.successUrl,
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: params.storeId },
          },
          variant: {
            data: { type: "variants", id: params.variantId },
          },
        },
      });

      return { url };
    },

    async verifyWebhook(params: VerifyWebhookParams): Promise<WebhookEvent> {
      const result = await ls.verifySignature({
        body: params.body,
        signature: params.signature,
        secret: params.secret,
        x_event: "",
      });

      if ("error" in result) {
        throw result.error;
      }

      return {
        type: result.type,
        data: result.event,
        raw: result.event,
      };
    },
  };
}

function createBkashPayment(config: BkashConfig): PaymentInstance<BkashConfig> {
  const bkash = new Bkash({
    apiUrl: config.apiUrl,
    username: config.username,
    password: config.password,
    app_key: config.appKey,
    app_secret: config.appSecret,
  });

  return {
    async createCheckoutSession(params: BkashCheckoutSessionParams): Promise<CheckoutSession> {
      const url = await bkash.getCheckoutUrl({
        mode: "0011",
        payerReference: params.payerReference,
        callbackURL: params.successUrl,
        amount: String(params.amount),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: params.merchantInvoiceNumber,
      });

      return { url };
    },
  };
}

function createSSLCommerzPayment(config: SSLCommerzConfig): PaymentInstance<SSLCommerzConfig> {
  const sslcommerz = new SSLCommerz({
    apiUrl: config.apiUrl,
    store_id: config.storeId,
    store_passwd: config.storePassword,
  });

  return {
    async createCheckoutSession(
      params: SSLCommerzCheckoutSessionParams
    ): Promise<CheckoutSession> {
      const currencyCode = params.currency.toUpperCase() as "USD" | "EUR";

      const url = await sslcommerz.getCheckoutUrl({
        tran_id: params.transactionId,
        store_id: config.storeId,
        store_passwd: config.storePassword,
        total_amount: params.amount / 100,
        currency: currencyCode,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        cus_name: params.customerName,
        cus_email: params.customerEmail,
        cus_add1: params.customerAddress,
        cus_city: params.customerCity,
        cus_state: params.customerState,
        cus_postcode: params.customerPostcode,
        cus_country: params.customerCountry,
        cus_phone: params.customerPhone,
        shipping_method: "NO",
        product_name: params.productName,
        product_category: params.productCategory,
        product_profile: params.productProfile || "general",
      });

      return { url };
    },
  };
}

function createNagadPayment(config: NagadConfig): PaymentInstance<NagadConfig> {
  const nagad = new Nagad({
    merchant_id: config.merchantId,
    merchant_number: config.merchantNumber,
    private_key: config.privateKey,
    public_key: config.publicKey,
    callbackURL: config.callbackUrl,
    apiVersion: config.apiVersion,
    is_live: config.isLive ?? false,
  });

  return {
    async createCheckoutSession(params: NagadCheckoutSessionParams): Promise<CheckoutSession> {
      const url = await nagad.getCheckoutUrl({
        orderId: params.orderId,
        amount: String(params.amount),
        ip: params.ip,
        clientType: params.clientType || "PC_WEB",
        productDetails: params.productDetails || {},
      });

      return { url };
    },
  };
}

function createPolarPayment(config: PolarConfig): PaymentInstance<PolarConfig> {
  const polar = new Polar({
    accessToken: config.accessToken,
    sandbox: config.sandbox,
  });

  return {
    async createCheckoutSession(
      params: PolarCheckoutSessionParams
    ): Promise<CheckoutSession> {
      const url = await polar.getCheckoutUrl({
        products: [
          { product_id: params.productId, quantity: params.quantity },
        ],
        success_url: params.successUrl,
        customer_email: params.customerEmail,
        customer_name: params.customerName,
        customer_external_id: params.customerExternalId,
        metadata: params.metadata,
        discount_id: params.discountId,
        allow_discount_codes: params.allowDiscountCodes,
      });

      return { url };
    },

    async verifyWebhook(params: VerifyWebhookParams): Promise<WebhookEvent> {
      const result = await polar.verifySignature({
        body: params.body,
        signature: params.signature,
        secret: params.secret,
        webhookId: params.webhookId || "",
        timestamp: params.timestamp || "",
      });

      if ("error" in result) {
        throw result.error;
      }

      return {
        type: result.type,
        data: result.event,
        raw: result.event,
      };
    },
  };
}

export function createPayment<T extends PaymentConfig>(config: T): PaymentInstance<T> {
  switch (config.provider) {
    case "stripe":
      return createStripePayment(config) as PaymentInstance<T>;
    case "paypal":
      return createPaypalPayment(config) as PaymentInstance<T>;
    case "lemonsqueezy":
      return createLemonSqueezyPayment(config) as PaymentInstance<T>;
    case "bkash":
      return createBkashPayment(config) as PaymentInstance<T>;
    case "sslcommerz":
      return createSSLCommerzPayment(config) as PaymentInstance<T>;
    case "nagad":
      return createNagadPayment(config) as PaymentInstance<T>;
    case "polar":
      return createPolarPayment(config) as PaymentInstance<T>;
    default:
      throw new Error(`Unsupported payment provider: ${(config as any).provider}`);
  }
}
