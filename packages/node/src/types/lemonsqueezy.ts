export interface CheckoutCreateParams {
  type: "checkouts";
  attributes: Attributes;
  relationships: Relationships;
}

interface Attributes {
  custom_price: number;
  product_options: ProductOptions;
  checkout_options: CheckoutOptions;
  checkout_data: CheckoutData;
  expires_at: string;
  preview: boolean;
}

interface ProductOptions {
  enabled_variants: number[];
}

interface CheckoutOptions {
  button_color: string;
}

interface CheckoutData {
  discount_code: string;
  custom: Custom;
}

interface Custom {
  user_id: number;
}

interface Relationships {
  store: Store;
  variant: Variant;
}

interface Store {
  data: Data;
}

interface Data {
  type: string;
  id: string;
}

interface Variant {
  data: Data2;
}

interface Data2 {
  type: string;
  id: string;
}
