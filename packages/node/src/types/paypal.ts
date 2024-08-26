export interface paypalOptions {
  clientId: string;
  clientSecret: string;
  sandbox?: boolean;
}

export interface paypalPayload {}

export interface paypalAuthResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
  scope: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: link[];
}
export interface link {
  href: string;
  rel: string;
  method: string;
}
