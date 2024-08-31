export interface INagadOptions {
  merchant_id: string;
  merchant_number: string;
  private_key: string;
  public_key: string;
  callbackURL: string;
  apiVersion: string;
  is_live: boolean;
}

export type INagadClientType =
  | "PC_WEB"
  | "MOBILE_WEB"
  | "MOBILE_APP"
  | "WALLET_WEB_VIEW"
  | "BILL_KEY";

export interface INagadCreatePaymentArgs {
  orderId: string;
  amount: string;
  productDetails: Record<string, string>;
  ip: string;
  clientType: INagadClientType;
}

export interface INagadSensitiveData {
  merchantId: string;
  datetime: string;
  orderId: string;
  challenge: string;
}

export interface INagadCreatePaymentBody {
  accountNumber: string;
  dateTime: string;
  sensitiveData: string;
  signature: string;
}

export interface INagadDecryptResponse {
  paymentReferenceId: string;
  challenge: string;
  acceptDateTime: string;
}

export interface INagadInitializeResponse {
  sensitiveData: string;
  signature: string;
}

export interface INagadConfirmPaymentArgs {
  ip: string;
  amount: string;
  orderId: string;
  challenge: string;
  paymentReferenceId: string;
  productDetails: Record<string, string>;
  clientType: string;
}

export interface INagadConfirmPaymentResponse {
  callBackUrl: string;
  status: string;
}
