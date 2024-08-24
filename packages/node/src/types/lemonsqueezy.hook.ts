export type LemonSqueezyWebhookEvents =
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

export interface LemonSqueezyWebhookEevent {
  meta: Meta;
  data: Data;
}

interface Meta {
  event_name: string;
  custom_data: CustomData;
}

interface CustomData {
  customer_id: number;
}

interface Data {
  type: "orders" | "subscriptions";
  id: string;
  attributes: Attributes;
  relationships: Relationships;
  links: Links7;
}

interface Attributes {
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
  first_order_item: FirstOrderItem;
  urls: Urls;
  created_at: string;
  updated_at: string;
}

interface FirstOrderItem {
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
}

interface Urls {
  receipt: string;
}

interface Relationships {
  store: Store;
  customer: Customer;
  "order-items": OrderItems;
  subscriptions: Subscriptions;
  "license-keys": LicenseKeys;
  "discount-redemptions": DiscountRedemptions;
}

interface Store {
  links: Links;
}

interface Links {
  related: string;
  self: string;
}

interface Customer {
  links: Links2;
}

interface Links2 {
  related: string;
  self: string;
}

interface OrderItems {
  links: Links3;
}

interface Links3 {
  related: string;
  self: string;
}

interface Subscriptions {
  links: Links4;
}

interface Links4 {
  related: string;
  self: string;
}

interface LicenseKeys {
  links: Links5;
}

interface Links5 {
  related: string;
  self: string;
}

interface DiscountRedemptions {
  links: Links6;
}

interface Links6 {
  related: string;
  self: string;
}

interface Links7 {
  self: string;
}
