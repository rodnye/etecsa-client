import { AxiosError, AxiosResponse } from 'axios';
import type { EtecsaClientContext } from '../client';

/**
 * Error lanzado cuando ocurre un fallo en una llamada a la API de ETECSA.
 * Contiene el código de estado HTTP y detalles adicionales si están disponibles.
 */
export class EtecsaApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'EtecsaApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Realiza una petición a la API de ETECSA.
 * En caso de éxito (2xx) retorna los datos de la respuesta.
 * Si ocurre un error de red o el servidor responde con un código de error,
 * lanza una excepción `EtecsaApiError`.
 */
export const requestEtecsaApi = async <T = unknown>(
  context: EtecsaClientContext,
  relative: string,
  config: { method?: string; data?: object } = {},
): Promise<T> => {
  await context.ensureInit();

  try {
    const response: AxiosResponse<T> = await context.axios({
      url: context.href + relative,
      method: config.method || 'get',
      data: config.data && context.encryptPayload(config.data),
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 500;
    let errorMessage = 'Ocurrió un error al conectar con el servidor';

    if (
      axiosError.response?.data &&
      typeof axiosError.response.data === 'object'
    ) {
      const data = axiosError.response.data as Record<string, unknown>;
      if (typeof data.mensaje === 'string') errorMessage = data.mensaje;
      else if (typeof data.error === 'string') errorMessage = data.error;
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }

    throw new EtecsaApiError(errorMessage, status, axiosError.response?.data);
  }
};
