import { requestEtecsaApi } from '../../core/api';
import { AuthCredentials, AuthResponse } from './types';
import { validateUserFormat, detectUserFormat } from './utils';

/**
 * Verificar si un usuario existe en el sistema ETECSA
 */
export const checkUserExistsAuthApi = async (
  user: string,
): Promise<{
  success: boolean;
  status: number;
  exists?: boolean;
  error?: string;
  message?: string;
}> => {
  const userFormat = detectUserFormat(user);
  if (!validateUserFormat(user, userFormat)) {
    return {
      success: false,
      status: 400,
      error: 'invalid_format',
      message: 'Formato de usuario incorrecto',
    };
  }

  try {
    const response = await requestEtecsaApi<{ existe: boolean }, any>(
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

    if (response.status === 204) {
      return {
        success: false,
        status: 204,
        exists: false,
        error: 'user_not_found',
        message:
          userFormat === 'phone'
            ? 'El teléfono móvil no está registrado en el sistema'
            : 'El correo electrónico no está registrado en el sistema',
      };
    }

    if (response.status === 200) {
      if (response.data.existe) {
        return {
          success: false,
          status: 200,
          exists: true,
          error: 'too_many_attempts',
          message:
            userFormat === 'phone'
              ? 'Ha superado el número de intentos para un día con ese número móvil'
              : 'Ha superado el número de intentos para un día con ese correo electrónico',
        };
      }
      return {
        success: true,
        status: 200,
        exists: false,
      };
    }

    return {
      success: false,
      status: response.status,
      error: 'server_error',
      message: 'Ocurrió un error al verificar el usuario',
    };
  } catch (error) {
    console.error('Verify user error:', error);
    return {
      success: false,
      status: 500,
      error: 'server_error',
      message: 'Ocurrió un error al conectar con el servidor',
    };
  }
};

export const loginAuthApi = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  if (!validateUserFormat(credentials.user, detectUserFormat(credentials.user)))
    throw new Error('Formato de usuario incorrecto');

  try {
    const response = await requestEtecsaApi<null, AuthCredentials>(
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

    if (response.status === 200) {
      const cookies = response.headers['set-cookie'];
      // FIXME: check this, this not get the cookies
      const csrfToken = cookies?.find((c) => c.startsWith('csrftoken='))!;
      const sessionId = cookies?.find((c) => c.startsWith('sessionid='))!;

      return {
        success: true,
        cookies: {
          csrfToken,
          sessionId,
        },
      };
    }

    if (response.status === 203) {
      return {
        success: false,
        error: 'invalid_credentials',
        message: 'Usuario o contraseña incorrectos',
      };
    }

    if (response.status === 226) {
      return {
        success: false,
        error: 'too_many_attempts',
        message:
          'Ha superado el límite de 3 intentos fallidos. Por favor verifique sus datos e inténtelo nuevamente en 30 minutos.',
      };
    }

    return {
      success: false,
      error: 'server_error',
      message: 'Ocurrió un error durante la autenticación',
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      error: 'server_error',
      message: 'Ocurrió un error al conectar con el servidor',
    };
  }
};
