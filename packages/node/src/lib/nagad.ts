export class Nagad {
  constructor(
    private merchant_id: string,
    private merchant_number: string,
    private private_key: string,
    private public_key: string,
    private is_live: boolean = false
  ) {}
  //baseUrl
  baseUrl() {
    if (this.is_live) {
      return "https://api.mynagad.com/api/dfs/";
    } else {
      return "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/";
    }
  }
  //merchantInfo
  merchantInfo() {
    return {
      merchantId: this.merchant_id,
      merchantNumber: this.merchant_number,
      privateKey: this.private_key,
      publicKey: this.public_key,
    };
  }
  //getHeaders
  getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-KM-IP-V4": "", //ip address
      "X-KM-Api-Version": "v-0.2.0",
      "X-KM-Client-Type": "PC_WEB",
    };
  }
}

export class UnifyNagad {
  constructor(private nagad: Nagad) {}
  generateRandomString(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  //initialize payment
  async initialize(invoice: string) {
    const url = `${this.nagad.baseUrl()}check-out/initialize/${this.nagad.merchantInfo().merchantId}/${invoice}`;
    //sensitive data
    const sensitiveData = {
      merchantId: this.nagad.merchantInfo().merchantId,
      datetime: new Date().toISOString(),
      orderId: invoice,
      challenge: this.generateRandomString(12),
    };
    //signature
  }
  //create payment
  async create(amount: number, invoice: string, account: number = 1) {
    const initialize = await this.initialize(invoice);
  }
  //getCheckoutUrl
  async getCheckoutUrl(amount: number, invoice: string, account: number = 1) {
    const response = await this.create(amount, invoice, account);
    console.log("response");
    console.log(response);
    return response;
  }
}
