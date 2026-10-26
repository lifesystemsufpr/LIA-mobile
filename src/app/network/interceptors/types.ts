import { HttpRequest, HttpResponse } from '../types';

export type RequestInterceptor = (request: HttpRequest) => Promise<HttpRequest> | HttpRequest;

export type ResponseInterceptor = (
  response: HttpResponse
) => Promise<HttpResponse> | HttpResponse;

export type ErrorInterceptor = (error: unknown) => Promise<unknown> | unknown;
