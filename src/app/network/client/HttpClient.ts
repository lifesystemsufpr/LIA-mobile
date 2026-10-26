import { RequestOptions } from '../types';

export type HttpClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>): Promise<T>;
  put<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>): Promise<T>;
  patch<T, B = unknown>(path: string, body?: B, options?: RequestOptions<B>): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
};
