import { requestEtecsaApi, ApiResult } from '../../core/api';
import { detectUserFormat, validateUserFormat } from './utils';

/**
 * Generar y enviar código de verificación al usuario
 * TODO: untested
 */
export const sendCode = async (
  user: string,
): Promise<ApiResult<{ message: string }>> => {
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
        operacion: 'generar_codigo',
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

  if (status === 200) {
    if (data.existe) {
      return {
        ok: false,
        error: 'Ha superado la cantidad de intentos (3)',
        status: 200,
        details: { code: 'too_many_attempts' },
      };
    }
    const message =
      userFormat === 'phone'
        ? 'Se ha reenviado un código de activación a su número móvil'
        : 'Se ha reenviado un código de activación a su correo electrónico';
    return {
      ok: true,
      data: { message },
      status: 200,
    };
  }

  return {
    ok: false,
    error: 'Ocurrió un error al generar el código',
    status,
    details: { code: 'server_error' },
  };
};

/**
 * Verificar código de validación enviado al usuario
 * TODO: untested
 */
export const verifyCode = async (
  user: string,
  code: string,
): Promise<ApiResult<{ message: string }>> => {
  const result = await requestEtecsaApi<boolean>(
    '/autenticarse/autenticarse_api',
    {
      method: 'post',
      data: {
        operacion: 'verificar_codigo',
        usuario: user,
        codigo: code,
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

  if (status === 200) {
    if (data) {
      return {
        ok: true,
        data: { message: 'Código verificado correctamente' },
        status: 200,
      };
    }
    return {
      ok: false,
      error: 'Ha superado la cantidad de intentos (3)',
      status: 200,
      details: { code: 'too_many_attempts' },
    };
  }

  return {
    ok: false,
    error: 'Ocurrió un error al verificar el código',
    status,
    details: { code: 'server_error' },
  };
};

/**
 * Recuperar/restablecer contraseña
 * FIXME: error 401
 */
export const resetPassword = async (
  user: string,
  newPassword: string,
): Promise<ApiResult<{ message: string }>> => {
  const result = await requestEtecsaApi<null>(
    '/autenticarse/autenticarse_api',
    {
      method: 'put',
      data: {
        operacion: 'recuperar_contrasenna',
        usuario: user,
        contrasenna: newPassword,
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

  if (result.status === 200) {
    return {
      ok: true,
      data: { message: 'Ha cambiado tu contraseña correctamente' },
      status: 200,
    };
  }

  return {
    ok: false,
    error: 'Ocurrió un error al cambiar la contraseña',
    status: result.status,
    details: { code: 'server_error' },
  };
};
