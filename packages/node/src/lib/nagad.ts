import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { UnifyFetch } from "../utils/fetch";
import {
  INagadConfirmPaymentArgs,
  INagadConfirmPaymentResponse,
  INagadCreatePaymentArgs,
  INagadCreatePaymentBody,
  INagadDecryptResponse,
  INagadInitializeResponse,
  INagadOptions,
  INagadSensitiveData,
} from "../types/nagad";
import crypto from "node:crypto";

export class Nagad extends UnifyFetch {
  constructor(private options: INagadOptions) {
    super();

    dayjs.extend(timezone);
    dayjs.extend(utc);
  }

  private getApiBaseUrl() {
    if (this.options.is_live) {
      return "https://api.mynagad.com/api/dfs";
    }

    return "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs";
  }

  private getMerchantId() {
    return this.options.merchant_id;
  }

  private getMerchantNumber() {
    return this.options.merchant_number;
  }

  private getPrivateKey() {
    return this.options.private_key;
  }

  private getPublicKey() {
    return this.options.public_key;
  }

  private getTimeStamp() {
    return dayjs().tz("Asia/Dhaka").format("YYYYMMDDHHmmss");
  }

  private getCallbackUrl() {
    return this.options.callbackURL;
  }

  private getApiHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-KM-Api-Version": this.options.apiVersion,
    };
  }

  private createHash(string: string) {
    return crypto.createHash("sha1").update(string).digest("hex").toUpperCase();
  }

  private encrypt<T>(data: T) {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${this.getPublicKey()}\n-----END PUBLIC KEY-----`;

    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(JSON.stringify(data), "utf8")
    );

    return encrypted.toString("base64");
  }

  private decrypt<T>(data: string): T {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${this.getPrivateKey()}\n-----END PRIVATE KEY-----`;

    const decrypted = crypto
      .privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(data, "base64")
      )
      .toString();

    return JSON.parse(decrypted);
  }

  private sign<T>(data: T) {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${this.getPrivateKey()}\n-----END PRIVATE KEY-----`;

    const signerObject = crypto.createSign("SHA256");
    signerObject.update(JSON.stringify(data));
    signerObject.end();

    return signerObject.sign(privateKey, "base64");
  }

  private async confirmPayment(options: INagadConfirmPaymentArgs) {
    const sensitiveData = {
      currencyCode: "050",
      amount: options.amount,
      orderId: options.orderId,
      challenge: options.challenge,
      merchantId: this.getMerchantId(),
    };

    const payload = {
      signature: this.sign(sensitiveData),
      paymentRefId: options.paymentReferenceId,
      sensitiveData: this.encrypt(sensitiveData),
      merchantCallbackURL: this.getCallbackUrl(),
      additionalMerchantInfo: {
        ...options.productDetails,
      },
    };

    const [data] = await this.axios<INagadConfirmPaymentResponse>(
      `${this.getApiBaseUrl()}/check-out/complete/${options.paymentReferenceId}`,
      {
        method: "POST",
        headers: {
          ...this.getApiHeaders(),
          "X-KM-IP-V4": options.ip,
          "X-KM-Client-Type": options.clientType,
        },
        body: JSON.stringify(payload),
      }
    );

    return data;
  }

  async getCheckoutUrl(options: INagadCreatePaymentArgs) {
    const timestamp = this.getTimeStamp();
    const endpoint = `${this.getApiBaseUrl()}/check-out/initialize/${this.getMerchantId()}/${options.orderId}`;

    const sensitive: INagadSensitiveData = {
      datetime: timestamp,
      orderId: options.orderId,
      merchantId: this.getMerchantId(),
      challenge: this.createHash(options.orderId),
    };

    const payload: INagadCreatePaymentBody = {
      dateTime: timestamp,
      signature: this.sign(sensitive),
      sensitiveData: this.encrypt(sensitive),
      accountNumber: this.getMerchantNumber(),
    };

    const [res] = await this.axios<INagadInitializeResponse>(endpoint, {
      method: "POST",
      headers: {
        ...this.getApiHeaders(),
        "X-KM-IP-V4": options.ip,
        "X-KM-Client-Type": options.clientType,
      },
      body: JSON.stringify(payload),
    });

    const decrypt = this.decrypt<INagadDecryptResponse>(res.sensitiveData);

    const response = await this.confirmPayment({
      ip: options.ip,
      challenge: decrypt.challenge,
      amount: options.amount,
      orderId: options.orderId,
      clientType: options.clientType,
      paymentReferenceId: decrypt.paymentReferenceId,
      productDetails: options.productDetails,
    });

    return response.callBackUrl;
  }
}
