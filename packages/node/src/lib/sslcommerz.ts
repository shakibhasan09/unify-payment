import { paymentInitDataProcess } from "../helpers/sslcommerz";
import type { checkoutParams } from "../types/sslcommerz";
export class SSLCommerz {
  private baseURL: string;
  constructor(
    private store_id: string,
    private store_passwd: string,
    live: boolean = false,
    private store_url: string
  ) {
    this.baseURL = `https://${live ? "securepay" : "sandbox"}.sslcommerz.com`;
  }
  storeInfo() {
    return {
      store_id: this.store_id,
      store_passwd: this.store_passwd,
      store_url: this.store_url,
    };
  }
  InitUrl() {
    return `${this.baseURL}/gwprocess/v4/api.php`;
  }
  ValidationUrl() {
    return `${this.baseURL}/validator/api/validationserverAPI.php?`;
  }
  RefundUrl() {
    return `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
  }
  RefundQueryUrl() {
    return `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
  }
  TransactionQueryBySessionIdUrl() {
    return `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
  }
  TransactionQueryByTransactionIdUrl() {
    return `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
  }
}
export class UnifySSLCommerz {
  constructor(private sslcommerz: SSLCommerz) {}

  //get checkout url
  async getCheckoutUrl(data: any, method: string = "POST") {
    data.store_id = this.sslcommerz.storeInfo().store_id;
    data.store_passwd = this.sslcommerz.storeInfo().store_passwd;
    const processedData = await paymentInitDataProcess(data);
    const response = await fetch(this.sslcommerz.InitUrl(), {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      redirect: "follow", // manual, *follow, error
      referrer: this.sslcommerz.storeInfo().store_url, // no-referrer, *client
      body: processedData, // body data type must match "Content-Type" header
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
    //return session.url;
    return response;
  }
}
