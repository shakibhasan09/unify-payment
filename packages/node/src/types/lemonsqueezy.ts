export type TLemonSqueezyWebhookEvents =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_success"
  | "subscription_payment_failed"
  | "subscription_payment_recovered"
  | "subscription_payment_refunded"
  | "license_key_created"
  | "license_key_updated";

export type TGetCheckoutUrl =
  | { data: { attributes: { url: string } } }
  | { errors: [{ detail: string }] };

export type TWebhookEventResponse =
  | { error: Error }
  | {
      event: ILemonSqueezyWebhookEeventResponse;
      type: TLemonSqueezyWebhookEvents;
    };

export interface ILemonSqueezyWebhookEeventResponse {
  meta: {
    event_name: string;
    custom_data: {
      customer_id: number;
    };
  };
  data: {
    type: "orders" | "subscriptions";
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      identifier: string;
      order_number: number;
      user_name: string;
      user_email: string;
      currency: string;
      currency_rate: string;
      subtotal: number;
      discount_total: number;
      tax: number;
      total: number;
      subtotal_usd: number;
      discount_total_usd: number;
      tax_usd: number;
      total_usd: number;
      tax_name: string;
      tax_rate: string;
      status: string;
      status_formatted: string;
      refunded: boolean;
      refunded_at: any;
      subtotal_formatted: string;
      discount_total_formatted: string;
      tax_formatted: string;
      total_formatted: string;
      first_order_item: {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        price: number;
        created_at: string;
        updated_at: string;
        deleted_at: any;
        test_mode: boolean;
      };
      urls: {
        receipt: string;
      };
      created_at: string;
      updated_at: string;
    };
    relationships: {
      store: {
        links: {
          related: string;
          self: string;
        };
      };
      customer: {
        links: {
          related: string;
          self: string;
        };
      };
      "order-items": {
        links: {
          related: string;
          self: string;
        };
      };
      subscriptions: {
        links: {
          related: string;
          self: string;
        };
      };
      "license-keys": {
        links: {
          related: string;
          self: string;
        };
      };
      "discount-redemptions": {
        links: {
          related: string;
          self: string;
        };
      };
    };
    links: {
      self: string;
    };
  };
}

export interface ILemonSqueezyCheckoutOptions {
  type: "checkouts";
  attributes: {
    custom_price: number;
    product_options: {
      enabled_variants: number[];
    };
    checkout_options: {
      button_color: string;
    };
    checkout_data: {
      discount_code: string;
      custom: {
        user_id: number;
      };
    };
    expires_at: string;
    preview: boolean;
  };
  relationships: {
    store: {
      data: {
        type: string;
        id: string;
      };
    };
    variant: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}
