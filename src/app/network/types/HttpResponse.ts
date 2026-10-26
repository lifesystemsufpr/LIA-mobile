export type HttpResponse<T = unknown> = {
  statusCode: number;
  data: T;
  headers: Record<string, string>;
  ok: boolean;
};
