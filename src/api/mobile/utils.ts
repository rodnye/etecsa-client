import { ApiResult, requestEtecsaApi } from '../../core/api';
import { MobileServiceRequestOptions } from './types';

/**
 * just other request helper
 */
export const mobileServicesRequest = async <T>(
  options: MobileServiceRequestOptions
): Promise<ApiResult<T>> => {
  const result = await requestEtecsaApi<T>(
    '/servicios_moviles/servicios_moviles/servicios_moviles_api',
    {
      method: 'post',
      data: {
        operacion: options.operation,
        ...options.data,
      },
    }
  );

  if (!result.ok) {
    return result;
  }

  const { status, data } = result;

  if (status === 403) {
    return {
      ok: false,
      error: 'Su sesión expiró',
      status: 403,
      details: { code: 'session_expired' },
    };
  }

  if (status === 423) {
    return {
      ok: false,
      error: 'El servicio no está disponible',
      status: 423,
      details: { code: 'service_unavailable' },
    };
  }

  if (status !== 200 && typeof data === 'object' && data !== null) {
    const errorData = data as Record<string, unknown>;
    if (typeof errorData.error === 'string') {
      return {
        ok: false,
        error: errorData.error as string,
        status,
        details: { code: errorData.code || 'server_error' },
      };
    }
  }

  return result;
};
