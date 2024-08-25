import * as crypto from "crypto";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  IConfirmPaymentArgs,
  ICreatePaymentArgs,
  INagadCreatePaymentBody,
  INagadDecryptResponse,
  INagadInitializeResponse,
  INagadSensitiveData,
  nagadOptions,
} from "../types/nagad";

export class Nagad {
  constructor(private options: nagadOptions) {
    dayjs.extend(timezone);
    dayjs.extend(utc);
  }

  getApiBaseUrl() {
    if (this.options.is_live) {
      return "https://api.mynagad.com/api/dfs";
    }

    return "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs";
  }

  getMerchantId() {
    return this.options.merchant_id;
  }

  getMerchantNumber() {
    return this.options.merchant_number;
  }

  getPrivateKey() {
    return this.options.private_key;
  }

  getPublicKey() {
    return this.options.public_key;
  }

  getTimeStamp() {
    return dayjs().tz("Asia/Dhaka").format("YYYYMMDDHHmmss");
  }

  getCallbackUrl() {
    return this.options.callbackURL;
  }

  getApiHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-KM-Api-Version": this.options.apiVersion,
    };
  }
}

export class UnifyNagad {
  constructor(private nagad: Nagad) {}

  private async fetch<T extends {}>(
    url: string,
    params?: { method?: string; headers?: HeadersInit; body?: BodyInit }
  ): Promise<T> {
    const req = await fetch(url, {
      method: params?.method || "GET",
      headers: params?.headers,
      body: params?.body,
    });

    if (req.status !== 200) throw new Error("Failed to fetch");

    return await req.json();
  }

  async getCheckoutUrl(nagadPaymentConfig: ICreatePaymentArgs) {
    const timestamp = this.nagad.getTimeStamp();
    const endpoint = `${this.nagad.getApiBaseUrl()}/check-out/initialize/${this.nagad.getMerchantId()}/${nagadPaymentConfig.orderId}`;

    const sensitive: INagadSensitiveData = {
      datetime: timestamp,
      orderId: nagadPaymentConfig.orderId,
      merchantId: this.nagad.getMerchantId(),
      challenge: this.createHash(nagadPaymentConfig.orderId),
    };

    const payload: INagadCreatePaymentBody = {
      dateTime: timestamp,
      signature: this.sign(sensitive),
      sensitiveData: this.encrypt(sensitive),
      accountNumber: this.nagad.getMerchantNumber(),
    };

    const res = await this.fetch<INagadInitializeResponse>(endpoint, {
      method: "POST",
      headers: {
        ...this.nagad.getApiHeaders(),
        "X-KM-IP-V4": nagadPaymentConfig.ip,
        "X-KM-Client-Type": nagadPaymentConfig.clientType,
      },
      body: JSON.stringify(payload),
    });

    const decrypt = this.decrypt<INagadDecryptResponse>(res.sensitiveData);

    const { callBackUrl } = await this.confirmPayment({
      ip: nagadPaymentConfig.ip,
      challenge: decrypt.challenge,
      amount: nagadPaymentConfig.amount,
      orderId: nagadPaymentConfig.orderId,
      clientType: nagadPaymentConfig.clientType,
      paymentReferenceId: decrypt.paymentReferenceId,
      productDetails: nagadPaymentConfig.productDetails,
    });

    return callBackUrl;
  }

  private async confirmPayment(params: IConfirmPaymentArgs) {
    const sensitiveData = {
      currencyCode: "050",
      amount: params.amount,
      orderId: params.orderId,
      challenge: params.challenge,
      merchantId: this.nagad.getMerchantId(),
    };

    const payload = {
      signature: this.sign(sensitiveData),
      paymentRefId: params.paymentReferenceId,
      sensitiveData: this.encrypt(sensitiveData),
      merchantCallbackURL: this.nagad.getCallbackUrl(),
      additionalMerchantInfo: {
        ...params.productDetails,
      },
    };

    return await this.fetch<{ callBackUrl: string; status: string }>(
      `${this.nagad.getApiBaseUrl()}/check-out/complete/${params.paymentReferenceId}`,
      {
        method: "POST",
        headers: {
          ...this.nagad.getApiHeaders(),
          "X-KM-IP-V4": params.ip,
          "X-KM-Client-Type": params.clientType,
        },
        body: JSON.stringify(payload),
      }
    );
  }

  private createHash(string: string) {
    return crypto.createHash("sha1").update(string).digest("hex").toUpperCase();
  }

  private encrypt(data: Record<string, string>) {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${this.nagad.getPublicKey()}\n-----END PUBLIC KEY-----`;

    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(JSON.stringify(data), "utf8")
    );

    return encrypted.toString("base64");
  }

  private sign(data: string | Record<string, string>) {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${this.nagad.getPrivateKey()}\n-----END PRIVATE KEY-----`;

    const signerObject = crypto.createSign("SHA256");
    signerObject.update(JSON.stringify(data));
    signerObject.end();

    return signerObject.sign(privateKey, "base64");
  }

  private decrypt<T>(data: string): T {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${this.nagad.getPrivateKey()}\n-----END PRIVATE KEY-----`;

    const decrypted = crypto
      .privateDecrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from(data, "base64")
      )
      .toString();

    return JSON.parse(decrypted);
  }
}
