export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'NETWORK_ERROR',
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class NetworkTimeoutError extends NetworkError {
  constructor(message: string = 'A requisição excedeu o tempo limite.') {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'NetworkTimeoutError';
  }
}

export class NetworkConnectionError extends NetworkError {
  constructor(message: string = 'Dispositivo sem conexão com a internet.') {
    super(message, 'CONNECTION_ERROR');
    this.name = 'NetworkConnectionError';
  }
}

export class HttpError extends NetworkError {
  constructor(
    statusCode: number,
    message: string,
    details?: unknown
  ) {
    super(message, `HTTP_${statusCode}`, statusCode, details);
    this.name = 'HttpError';
  }
}
