export interface IBkashAccessTokenResponse {
  expires_in: string;
  id_token: string;
  refresh_token: string;
  token_type: "Bearer" | string;
  statusCode: string;
  statusMessage: string;
}

export interface IBkashErrorResponse {
  errorCode: string;
  errorMessage: string;
}

export interface IBkashCheckoutOptions {
  code: "0011";
  payerReference: string;
  callbackURL: string;
  amount: string;
  currency: "BDT";
  intent: "sale";
  merchantInvoiceNumber: string;
  merchantAssociationInfo?: string;
}

export interface IBkashCheckoutResponse {
  paymentID: string;
  paymentCreateTime: string;
  transactionStatus: string;
  amount: string;
  currency: "BDT";
  intent: "sale";
  merchantInvoiceNumber: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
  statusCode: string;
  statusMessage: string;
}
