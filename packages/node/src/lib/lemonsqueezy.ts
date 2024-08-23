import { CheckoutCreateParams } from "../types/lemonsqueezy";

export class LemonSqueezy {
  constructor(private apiKey: string) {}

  getApiBaseUrl() {
    return "https://api.lemonsqueezy.com/v1";
  }

  getApiRequestHeaders() {
    return {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }
}

export class UnifyLemonSqueezy {
  constructor(private lemonSqueezy: LemonSqueezy) {}

  private async fetch(
    path: string,
    params?: { method?: string; headers?: HeadersInit; body?: BodyInit }
  ) {
    return await fetch(`${this.lemonSqueezy.getApiBaseUrl()}${path}`, {
      method: params?.method || "GET",
      headers: this.lemonSqueezy.getApiRequestHeaders(),
      body: params?.body,
    });
  }

  async getCheckoutUrl(body: CheckoutCreateParams) {
    const req = await this.fetch("/checkouts", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = (await req.json()) as
      | { data: { attributes: { url: string } } }
      | { errors: [{ detail: string }] };

    if ("errors" in res) {
      throw new Error(res.errors[0].detail);
    }

    return res.data.attributes.url;
  }
}
