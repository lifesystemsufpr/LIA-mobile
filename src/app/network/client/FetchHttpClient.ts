import { defaultNetworkConfig, NetworkConfig } from '../config/networkConfig';
import { HttpErrorMapper } from '../errors/HttpErrorMapper';
import {
  ErrorInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from '../interceptors/types';
import {
  HttpMethod,
  HttpRequest,
  HttpResponse,
  QueryParams,
  RequestOptions,
} from '../types';
import { HttpClient } from './HttpClient';

export class FetchHttpClient implements HttpClient {
  private config: NetworkConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: Partial<NetworkConfig> = {}) {
    this.config = { ...defaultNetworkConfig, ...config };
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.execute<T>({ path, method: 'GET', ...options });
  }

  async post<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>): Promise<T> {
    return this.execute<T>({ path, method: 'POST', body, ...options });
  }

  async put<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>): Promise<T> {
    return this.execute<T>({ path, method: 'PUT', body, ...options });
  }

  async patch<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>): Promise<T> {
    return this.execute<T>({ path, method: 'PATCH', body, ...options });
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.execute<T>({ path, method: 'DELETE', ...options });
  }

  private async execute<T>(initialRequest: HttpRequest): Promise<T> {
    let req = initialRequest;
    for (const interceptor of this.requestInterceptors) {
      req = await interceptor(req);
    }

    const url = this.buildUrl(req.path, req.queryParams);
    const timeoutMs = req.timeoutMs ?? this.config.defaultTimeoutMs;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers = {
        ...this.config.defaultHeaders,
        ...req.headers,
      };

      const response = await fetch(url, {
        method: req.method,
        headers,
        body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
        signal: req.abortSignal ?? controller.signal,
      });

      clearTimeout(timeoutId);

      const parsedData = await this.parseResponseData<T>(response);
      const headersMap: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        headersMap[key] = val;
      });

      let res: HttpResponse<T> = {
        statusCode: response.status,
        data: parsedData,
        headers: headersMap,
        ok: response.ok,
      };

      for (const interceptor of this.responseInterceptors) {
        res = (await interceptor(res as HttpResponse)) as HttpResponse<T>;
      }

      if (!response.ok) {
        throw HttpErrorMapper.fromStatus(response.status, res.data);
      }

      return res.data;
    } catch (error) {
      clearTimeout(timeoutId);
      let mappedError = HttpErrorMapper.fromUnknown(error);
      for (const interceptor of this.errorInterceptors) {
        mappedError = (await interceptor(mappedError)) as typeof mappedError;
      }
      throw mappedError;
    }
  }

  private buildUrl(path: string, params?: QueryParams): string {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let fullUrl = base ? `${base}${cleanPath}` : cleanPath;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }
    }

    return fullUrl;
  }

  private async parseResponseData<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
    const text = await response.text();
    return text as unknown as T;
  }
}
