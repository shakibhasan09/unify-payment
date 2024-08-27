type TFetchOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  type?: "json" | "text";
};

export class UnifyFetch {
  async fetch<T extends {}>(url: string, options?: TFetchOptions) {
    const req = await fetch(url, options);

    if (options?.type === "text") {
      const res = await req.text();
      return {
        response: res,
        request: req,
      };
    }

    const res = (await req.json()) as T;
    return {
      response: res,
      request: req,
    };
  }

  async axios<T extends {}>(url: string, options?: TFetchOptions) {}
}
