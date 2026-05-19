import { requestEtecsaApi, ApiResult } from '../../core/api';
import { ETECSA } from '../../core/methods';
import { AuthCredentials, LoginSuccessData } from './types';
import { detectUserFormat, validateUserFormat } from './utils';

/**
 * Login with ETECSA credentials
 */
export const login = async (
  credentials: AuthCredentials,
): Promise<ApiResult<LoginSuccessData>> => {
  if (
    !validateUserFormat(credentials.user, detectUserFormat(credentials.user))
  ) {
    return {
      ok: false,
      error: 'Formato de usuario incorrecto',
      status: 400,
      details: { code: 'invalid_format' },
    };
  }

  const result = await requestEtecsaApi<null>(
    '/autenticarse/autenticarse_api',
    {
      method: 'put',
      data: {
        operacion: 'autenticar',
        usuario: credentials.user,
        contrasenna: credentials.pass,
      },
    },
  );

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      status: result.status,
      details: { code: 'server_error', original: result.details },
    };
  }

  const { status } = result;

  if (status === 200) {
    const cookies = ETECSA.cookiesJar.getCookiesSync(ETECSA.href);
    const csrfToken = cookies.find((c) => c.key === 'csrftoken');
    const sessionId = cookies.find((c) => c.key === 'sessionid');
    if (!csrfToken || !sessionId) {
      return {
        ok: false,
        error: 'No se pudieron obtener las cookies de sesión',
        status: 500,
        details: { code: 'session_cookies_missing' },
      };
    }
    return {
      ok: true,
      data: { cookies: { csrfToken, sessionId } },
      status: 200,
    };
  }

  if (status === 203) {
    return {
      ok: false,
      error: 'Usuario o contraseña incorrectos',
      status: 203,
      details: { code: 'invalid_credentials' },
    };
  }

  if (status === 226) {
    return {
      ok: false,
      error:
        'Ha superado el límite de 3 intentos fallidos. Por favor verifique sus datos e inténtelo nuevamente en 30 minutos.',
      status: 226,
      details: { code: 'too_many_attempts' },
    };
  }

  return {
    ok: false,
    error: 'Ocurrió un error durante la autenticación',
    status,
    details: { code: 'server_error' },
  };
};

/**
 * Verificar si un usuario existe en el sistema ETECSA
 */
export const checkUserExistsAuthApi = async (
  user: string,
): Promise<
  ApiResult<{ exists: false } | { exists: true; attemptsExceeded: true }>
> => {
  const userFormat = detectUserFormat(user);
  if (!validateUserFormat(user, userFormat)) {
    return {
      ok: false,
      error: 'Formato de usuario incorrecto',
      status: 400,
      details: { code: 'invalid_format' },
    };
  }

  const result = await requestEtecsaApi<{ existe: boolean }>(
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

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      status: result.status,
      details: { code: 'server_error', original: result.details },
    };
  }

  const { status, data } = result;

  if (status === 204) {
    return {
      ok: false,
      error:
        userFormat === 'phone'
          ? 'El teléfono móvil no está registrado en el sistema'
          : 'El correo electrónico no está registrado en el sistema',
      status: 204,
      details: { code: 'user_not_found' },
    };
  }

  if (status === 200) {
    if (data.existe) {
      return {
        ok: false,
        error:
          userFormat === 'phone'
            ? 'Ha superado el número de intentos para un día con ese número móvil'
            : 'Ha superado el número de intentos para un día con ese correo electrónico',
        status: 200,
        details: { code: 'too_many_attempts', exists: true },
      };
    }
    return {
      ok: true,
      data: { exists: false },
      status: 200,
    };
  }

  return {
    ok: false,
    error: 'Ocurrió un error al verificar el usuario',
    status,
    details: { code: 'server_error' },
  };
};