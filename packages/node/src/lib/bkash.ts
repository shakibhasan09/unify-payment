export type BkashPayloadProps = {
  apiUrl: string;
  username: string;
  password: string;
  app_key: string;
  app_secret: string;
};

export class Bkash {
  private apiUrl: string;

  constructor(private payload: BkashPayloadProps) {
    this.apiUrl = payload.apiUrl;
  }

  getApiBaseUrl() {
    return this.apiUrl;
  }

  getApiRequestHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: this.payload.username,
      password: this.payload.password,
    };
  }
}

export class UnifyBkash {
  constructor(private bkash: Bkash) {}

  private async fetch() {}

  private async getAccessToken() {}

  async getCheckoutUrl() {}
}
