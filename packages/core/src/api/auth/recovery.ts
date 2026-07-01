import type { EtecsaClientContext } from '../../client.ts';
import { requestEtecsaApi, EtecsaApiError } from '../../core/api.ts';
import { detectUserFormat, sanitizeUserFormat } from './utils.ts';

/**
 * Generar y enviar código de verificación al usuario.
 */
export const createSendCode = (context: EtecsaClientContext) => {
  return async (user: string): Promise<{ message: string }> => {
    const userFormat = detectUserFormat(user);
    user = sanitizeUserFormat(user);

    try {
      const data = await requestEtecsaApi<{ existe: boolean }>(
        context,
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

      if (data.existe) {
        throw new EtecsaApiError(
          'Ha superado la cantidad de intentos (3)',
          200,
          {
            code: 'too_many_attempts',
          },
        );
      }

      const message =
        userFormat === 'phone'
          ? 'Se ha reenviado un código de activación a su número móvil'
          : 'Se ha reenviado un código de activación a su correo electrónico';
      return { message };
    } catch (err) {
      throw err;
    }
  };
};

/**
 *
 */
export const createVerifyCode = (context: EtecsaClientContext) => {
  return async (user: string, code: string): Promise<{ message: string }> => {
    try {
      const data = await requestEtecsaApi<boolean>(
        context,
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

      if (data) {
        return { message: 'Código verificado correctamente' };
      }

      throw new EtecsaApiError('Ha superado la cantidad de intentos (3)', 200, {
        code: 'too_many_attempts',
      });
    } catch (err) {
      throw err;
    }
  };
};

/**
 * Verificar código de validación enviado al usuario.
 */
export const createResetPassword = (context: EtecsaClientContext) => {
  return async (
    user: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    try {
      await requestEtecsaApi<null>(context, '/autenticarse/autenticarse_api', {
        method: 'put',
        data: {
          operacion: 'recuperar_contrasenna',
          usuario: user,
          contrasenna: newPassword,
        },
      });

      return { message: 'Ha cambiado tu contraseña correctamente' };
    } catch (err) {
      throw err;
    }
  };
};
