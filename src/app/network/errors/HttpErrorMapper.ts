import { HttpError, NetworkConnectionError, NetworkError, NetworkTimeoutError } from './NetworkError';

export class HttpErrorMapper {
  static fromStatus(statusCode: number, data?: unknown): HttpError {
    switch (statusCode) {
      case 400:
        return new HttpError(400, 'Requisição inválida enviada ao servidor.', data);
      case 401:
        return new HttpError(401, 'Credenciais expiradas ou não autenticado.', data);
      case 403:
        return new HttpError(403, 'Acesso não autorizado ao recurso.', data);
      case 404:
        return new HttpError(404, 'Recurso não encontrado.', data);
      case 409:
        return new HttpError(409, 'Conflito de dados no servidor.', data);
      case 500:
      default:
        return new HttpError(statusCode, 'Erro interno no servidor remoto.', data);
    }
  }

  static fromUnknown(error: unknown): NetworkError {
    if (error instanceof NetworkError) return error;
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new NetworkTimeoutError();
      }
      return new NetworkError(error.message);
    }
    return new NetworkError('Ocorreu um erro inesperado de rede.');
  }
}
