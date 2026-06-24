import type { EtecsaClientContext } from '../../client';
import { requestEtecsaApi, EtecsaApiError } from '../../core/api';
import { MobileServiceRequestOptions } from './types';

/**
 * Función auxiliar para peticiones de servicios móviles
 */
export const mobileServicesRequest = async <T>(
  context: EtecsaClientContext,
  options: MobileServiceRequestOptions,
): Promise<T> => {
  try {
    const data = await requestEtecsaApi<T>(
      context,
      '/servicios_moviles/servicios_moviles/servicios_moviles_api',
      {
        method: 'post',
        data: {
          operacion: options.operation,
          ...options.data,
        },
      },
    );
    return data;
  } catch (err) {
    if (err instanceof EtecsaApiError) {
      if (err.status === 403) {
        throw new EtecsaApiError('Su sesión expiró', 403, {
          code: 'session_expired',
        });
      }
      if (err.status === 423) {
        throw new EtecsaApiError('El servicio no está disponible', 423, {
          code: 'service_unavailable',
        });
      }

      if (
        err.details &&
        typeof err.details === 'object' &&
        'error' in err.details
      ) {
        const details = err.details as Record<string, unknown>;
        throw new EtecsaApiError(details.error as string, err.status, {
          code: details.code || 'server_error',
        });
      }
    }
    throw err;
  }
};
