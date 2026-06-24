import type { EtecsaClientContext } from '../../client';
import { requestEtecsaApi, EtecsaApiError } from '../../core/api';
import { AuthCredentials, LoginSuccessData } from './types';
import { detectUserFormat, sanitizeUserFormat } from './utils';

/**
 * Iniciar sesión con credenciales de ETECSA
 */
export const createLogin = (context: EtecsaClientContext) => {
  return async (credentials: AuthCredentials): Promise<LoginSuccessData> => {
    const sanitizedUser = sanitizeUserFormat(credentials.user);

    try {
      await requestEtecsaApi<null>(context, '/autenticarse/autenticarse_api', {
        method: 'put',
        data: {
          operacion: 'autenticar',
          usuario: sanitizedUser,
          contrasenna: credentials.pass,
        },
      });

      const cookies = context.cookiesJar.getCookiesSync(context.href);
      const csrfToken = cookies.find((c) => c.key === 'csrftoken');
      const sessionId = cookies.find((c) => c.key === 'sessionid');

      if (!csrfToken || !sessionId) {
        throw new EtecsaApiError(
          'No se pudieron obtener las cookies de sesión',
          500,
          { code: 'session_cookies_missing' },
        );
      }

      return { cookies: { csrfToken, sessionId } };
    } catch (err) {
      if (err instanceof EtecsaApiError) {
        if (err.status === 203) {
          throw new EtecsaApiError('Usuario o contraseña incorrectos', 203, {
            code: 'invalid_credentials',
          });
        }
        if (err.status === 226) {
          throw new EtecsaApiError(
            'Ha superado el límite de 3 intentos fallidos. Por favor verifique sus datos e inténtelo nuevamente en 30 minutos.',
            226,
            { code: 'too_many_attempts' },
          );
        }
      }
      throw err;
    }
  };
};

/**
 * Verificar si un usuario existe en el sistema ETECSA.
 * (Nota: actualmente no se usa en el flujo principal, se mantiene como utilidad)
 */
export const checkUserExistsAuthApi = async (
  context: EtecsaClientContext,
  user: string,
): Promise<{ exists: false } | { exists: true; attemptsExceeded: true }> => {
  const userFormat = detectUserFormat(user);
  user = sanitizeUserFormat(user);

  try {
    const data = await requestEtecsaApi<{ existe: boolean }>(
      context,
      '/autenticarse/autenticarse_api',
      {
        method: 'post',
        data: {
          operacion: 'verificar_usuario',
          tipo_usuario: userFormat === 'phone' ? 'celular' : 'correo',
          usuario: user,
        },
      },
    );

    if (data.existe) {
      throw new EtecsaApiError(
        userFormat === 'phone'
          ? 'Ha superado el número de intentos para un día con ese número móvil'
          : 'Ha superado el número de intentos para un día con ese correo electrónico',
        200,
        { code: 'too_many_attempts', exists: true },
      );
    }

    return { exists: false };
  } catch (err) {
    if (err instanceof EtecsaApiError && err.status === 204) {
      throw new EtecsaApiError(
        userFormat === 'phone'
          ? 'El teléfono móvil no está registrado en el sistema'
          : 'El correo electrónico no está registrado en el sistema',
        204,
        { code: 'user_not_found' },
      );
    }
    throw err;
  }
};
