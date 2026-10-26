export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type RequestHeaders = Record<string, string>;

export type HttpRequest<B = unknown> = {
  path: string;
  method: HttpMethod;
  headers?: RequestHeaders;
  queryParams?: QueryParams;
  body?: B;
  timeoutMs?: number;
  abortSignal?: AbortSignal;
};

export type RequestOptions<B = unknown> = Omit<HttpRequest<B>, 'path' | 'method'>;
