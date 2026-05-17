import { requestEtecsaApi } from '../../core/api';
import { ApiResponse } from '../../core/types';
import { detectUserFormat, validateUserFormat } from './utils';

/**
 * Generar y enviar código de verificación al usuario
 */
export const generateCodeAuthApi = async (
  user: string,
): Promise<ApiResponse> => {
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
          operacion: 'generar_codigo',
          tipo_usuario: userFormat === 'phone' ? 'celular' : 'correo',
          usuario: user,
        },
      },
    );

    if (response.status === 200) {
      if (response.data.existe) {
        return {
          success: false,
          status: 200,
          error: 'too_many_attempts',
          message: 'Ha superado la cantidad de intentos (3)',
        };
      }
      return {
        success: true,
        status: 200,
        message:
          userFormat === 'phone'
            ? 'Se ha reenviado un código de activación a su número móvil'
            : 'Se ha reenviado un código de activación a su correo electrónico',
      };
    }

    return {
      success: false,
      status: response.status,
      error: 'server_error',
      message: 'Ocurrió un error al generar el código',
    };
  } catch (error) {
    console.error('Generate code error:', error);
    return {
      success: false,
      status: 500,
      error: 'server_error',
      message: 'Ocurrió un error al conectar con el servidor',
    };
  }
};

/**
 * Verificar código de validación enviado al usuario
 */
export const verifyCodeAuthApi = async (
  user: string,
  code: string,
): Promise<ApiResponse> => {
  try {
    const response = await requestEtecsaApi<boolean, any>(
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

    if (response.status === 200) {
      if (response.data) {
        return {
          success: true,
          status: 200,
          message: 'Código verificado correctamente',
        };
      }

      return {
        success: false,
        status: 200,
        error: 'too_many_attempts',
        message: 'Ha superado la cantidad de intentos (3)',
      };
    }

    return {
      success: false,
      status: response.status,
      error: 'server_error',
      message: 'Ocurrió un error al verificar el código',
    };
  } catch (error) {
    console.error('Verify code error:', error);
    return {
      success: false,
      status: 500,
      error: 'server_error',
      message: 'Ocurrió un error al conectar con el servidor',
    };
  }
};

/**
 * Recuperar/restablecer contraseña
 */
export const resetPasswordAuthApi = async (
  user: string,
  newPassword: string,
): Promise<ApiResponse> => {
  try {
    const response = await requestEtecsaApi<null, any>(
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

    if (response.status === 200) {
      return {
        success: true,
        status: 200,
        message: 'Ha cambiado tu contraseña correctamente',
      };
    }

    return {
      success: false,
      status: response.status,
      error: 'server_error',
      message: 'Ocurrió un error al cambiar la contraseña',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      status: 500,
      error: 'server_error',
      message: 'Ocurrió un error al conectar con el servidor',
    };
  }
};
