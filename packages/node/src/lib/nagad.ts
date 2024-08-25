import * as crypto from "crypto";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  ICreatePaymentArgs,
  INagadCreatePaymentBody,
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
      return "https://api.mynagad.com/api/dfs/";
    } else {
      return "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/";
    }
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
    return this.options.private_key;
  }

  getApiHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-KM-Api-Version": this.options.apiVersion,
    };
  }
}

export class UnifyNagad {
  constructor(private nagad: Nagad) {}
  private async fetch(
    url: string,
    params?: { method?: string; headers?: HeadersInit; body?: BodyInit }
  ) {
    console.log("run", url);
    return await fetch(url, {
      method: params?.method || "POST",
      headers: params?.headers,
      body: params?.body,
    });
  }

  async getCheckoutUrl(nagadPaymentConfig: ICreatePaymentArgs) {
    const endpoint = `${this.nagad.getApiBaseUrl()}check-out/initialize/${this.nagad.getMerchantId()}/${nagadPaymentConfig.orderId}`;
    const timestamp = this.getTimeStamp();

    const sensitive: INagadSensitiveData = {
      merchantId: this.nagad.getMerchantId(),
      datetime: timestamp,
      orderId: nagadPaymentConfig.orderId,
      challenge: this.createHash(nagadPaymentConfig.orderId),
    };

    const payload: INagadCreatePaymentBody = {
      accountNumber: this.nagad.getMerchantNumber(),
      dateTime: timestamp,
      sensitiveData: this.encrypt(sensitive),
      signature: this.sign(sensitive),
    };

    const newIP =
      nagadPaymentConfig.ip === "::1" || nagadPaymentConfig.ip === "127.0.0.1"
        ? "103.100.200.100"
        : nagadPaymentConfig.ip;
    const response = await this.fetch(endpoint, {
      headers: {
        ...this.nagad.getApiHeaders(),
        "X-KM-IP-V4": newIP,
        "X-KM-Client-Type": nagadPaymentConfig.clientType,
      },
      body: JSON.stringify(payload),
      method: "POST",
    });
    console.log(response);
    console.log("response");
    return response;
  }

  private getTimeStamp() {
    const timestamp = dayjs().tz("Asia/Dhaka").format("YYYYMMDDHHmmss");
    return timestamp;
  }

  private createHash(string: string): string {
    return crypto.createHash("sha1").update(string).digest("hex").toUpperCase();
  }

  private encrypt<T>(data: T): string {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${this.nagad.getPublicKey()}\n-----END PUBLIC KEY-----`;
    try {
      // Convert the data to a buffer
      const buffer = Buffer.from(JSON.stringify(data), "utf8");
      // Encrypt the data using the public key
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        buffer
      );

      // Return the encrypted data encoded in base64
      return encrypted.toString("base64");
    } catch (error: any) {
      throw new Error("Encryption failed: " + error.message);
    }
    return "";
  }
  private sign(data: string | Record<string, string>) {
    const signerObject = crypto.createSign("SHA256");
    signerObject.update(JSON.stringify(data));
    signerObject.end();
    console.log(
      "run sing",
      signerObject.sign(this.nagad.getPrivateKey(), "base64")
    );
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${this.nagad.getPrivateKey()}\n-----END RSA PRIVATE KEY-----`;
    return signerObject.sign(privateKey, "base64");
  }
}
