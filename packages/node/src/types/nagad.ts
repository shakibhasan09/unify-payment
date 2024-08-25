export interface nagadOptions {
  merchant_id: string;
  merchant_number: string;
  private_key: string;
  public_key: string;
  callbackURL: string;
  apiVersion: string;
  is_live: boolean;
}

export type IClientType =
  | "PC_WEB"
  | "MOBILE_WEB"
  | "MOBILE_APP"
  | "WALLET_WEB_VIEW"
  | "BILL_KEY";

export interface ICreatePaymentArgs {
  orderId: string;
  amount: string;
  productDetails: Record<string, string>;
  ip: string;
  clientType: IClientType;
}

export interface INagadSensitiveData extends Record<string, string> {
  merchantId: string;
  datetime: string;
  orderId: string;
  challenge: string;
}

export interface INagadCreatePaymentBody extends Record<string, string> {
  accountNumber: string;
  dateTime: string;
  sensitiveData: string;
  signature: string;
}
