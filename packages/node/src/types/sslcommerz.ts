export type ISSLCommerzCreateCheckoutPayload =
  | {
      tran_id: string;
      store_id: string;
      store_passwd: string;

      total_amount: number;
      currency: "USD" | "EUR";

      success_url?: string;
      cancel_url?: string;

      cus_name: string;
      cus_email: string;
      cus_add1: string;
      cus_add2?: string;
      cus_city: string;
      cus_state: string;
      cus_postcode: string;
      cus_country: string;
      cus_phone: string;
      cus_fax?: string;

      shipping_method: "NO";

      product_name: string;
      product_category: string;
      product_profile:
        | "general"
        | "physical-goods"
        | "non-physical-goods"
        | "airline-tickets"
        | "travel-vertical"
        | "telecom-vertical";
    }
  | {
      tran_id: string;
      store_id: string;
      store_passwd: string;

      total_amount: number;
      currency: "USD" | "EUR";

      success_url?: string;
      cancel_url?: string;

      cus_name: string;
      cus_email: string;
      cus_add1: string;
      cus_add2?: string;
      cus_city: string;
      cus_state: string;
      cus_postcode: string;
      cus_country: string;
      cus_phone: string;
      cus_fax?: string;

      shipping_method: "YES";

      ship_name: string;
      ship_add1: string;
      ship_add2?: string;
      ship_city: string;
      ship_state: string;
      ship_postcode: string;
      ship_country: string;

      product_name: string;
      product_category: string;
      product_profile:
        | "general"
        | "physical-goods"
        | "non-physical-goods"
        | "airline-tickets"
        | "travel-vertical"
        | "telecom-vertical";
    };

export interface ISSLCommerzCheckoutResponse {
  status: "SUCCESS" | "FAILED";
  failedreason: string;
  sessionkey: string;
  gw: {
    visa: string;
    master: string;
    amex: string;
    othercards: string;
    internetbanking: string;
    mobilebanking: string;
  };
  redirectGatewayURL: string;
  directPaymentURLBank: string;
  directPaymentURLCard: string;
  directPaymentURL: string;
  redirectGatewayURLFailed: string;
  GatewayPageURL: string;
  storeBanner: string;
  storeLogo: string;
  store_name: string;
  desc: {
    name: string;
    type: string;
    logo: string;
    gw: string;
    r_flag?: string;
    redirectGatewayURL?: string;
  }[];
  is_direct_pay_enable: string;
}

export type ISSLCommerzOptions = {
  apiUrl: string;
  store_id: string;
  store_url?: string;
  store_passwd: string;
};
