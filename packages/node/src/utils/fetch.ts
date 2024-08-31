import axios from "axios";

type TFetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit;
};

export class UnifyFetch {
  async jsonFetch<T>(
    url: string,
    options?: TFetchOptions
  ): Promise<[T, Response]> {
    const req = await fetch(url, options);
    const res = (await req.json()) as T;

    return [res, req];
  }

  async axios<T>(url: string, options?: TFetchOptions) {
    const req = await axios({
      url,
      method: options?.method,
      headers: options?.headers,
      data: options?.body,
    });
  }
}
