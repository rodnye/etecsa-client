import type { EtecsaClientContext } from '../../client.ts';
import { requestEtecsaApi, EtecsaApiError } from '../../core/api.ts';
import {
  CashiersResponse,
  EditUserRequest,
  GetLandlineServicesResponse,
  GetMobileServicesResponse,
  GetOwnCardResponse,
  NautaHogarResponse,
  ProfileData,
} from './types.ts';
import { performLogout } from '../logout.ts';

type ProfileRequestOptions = {
  operation?: string;
  method?: 'get' | 'post' | 'put';
  data?: Record<string, unknown>;
};

const profileRequest = async <T>(
  context: EtecsaClientContext,
  options: ProfileRequestOptions,
): Promise<T> => {
  try {
    const data = await requestEtecsaApi<T>(context, '/usuarios/perfil_api', {
      method: options.method || 'post',
      data:
        options.operation !== undefined
          ? { operacion: options.operation, ...options.data }
          : options.data,
    });
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
    }
    throw err;
  }
};

export const createProfileApi = (context: EtecsaClientContext) => ({
  me: (): Promise<ProfileData> =>
    profileRequest<ProfileData>(context, { method: 'get' }),

  mobileServices: (): Promise<GetMobileServicesResponse> =>
    profileRequest<GetMobileServicesResponse>(context, {
      operation: 'get_servicios_moviles',
    }),

  /**
   * Editar datos del perfil.
   */
  edit: async (data: EditUserRequest): Promise<{ message: string }> => {
    try {
      await requestEtecsaApi<unknown>(context, '/usuarios/perfil_api', {
        method: 'put',
        data: {
          operacion: 'editar_usuario',
          ...data,
        },
      });
      return { message: 'Perfil editado correctamente' };
    } catch (err) {
      if (err instanceof EtecsaApiError && err.status === 226) {
        const errorMessage = err.details as string;
        let errorKey:
          'carnet' | 'carnet_con_movil' | 'carnet_con_correo' | undefined;
        if (errorMessage === 'carnet') errorKey = 'carnet';
        else if (errorMessage === 'carnet_con_movil')
          errorKey = 'carnet_con_movil';
        else if (errorMessage === 'carnet_con_correo')
          errorKey = 'carnet_con_correo';

        throw new EtecsaApiError('Error de validación', 226, {
          code: 'validation_error',
          errorKey,
        });
      }
      throw err;
    }
  },

  logout: () => performLogout(context),

  nautaHogar: (): Promise<NautaHogarResponse> =>
    profileRequest<NautaHogarResponse>(context, {
      operation: 'get_nauta_hogar',
    }),

  cashiersIds: (): Promise<CashiersResponse> =>
    profileRequest<CashiersResponse>(context, { operation: 'get_id_cajeros' }),

  ownCard: (): Promise<GetOwnCardResponse> =>
    profileRequest<GetOwnCardResponse>(context, {
      operation: 'get_tarjeta_propia',
    }),

  landlineServices: (): Promise<GetLandlineServicesResponse> =>
    profileRequest<GetLandlineServicesResponse>(context, {
      operation: 'get_servicios_fijos',
    }),

  /**
   * Verificar si un número/correo puede asociarse al perfil.
   */
  verifyUser: async (
    id: string,
    userType: 'celular' | 'correo',
    username: string,
  ): Promise<{ post_pago?: boolean }> => {
    try {
      const data = await requestEtecsaApi<{
        exists?: boolean;
        data?: { post_pago?: boolean };
      }>(context, '/usuarios/perfil_api', {
        method: 'post',
        data: {
          operacion: 'verificar_usuario',
          id,
          tipo_usuario: userType,
          usuario: username,
        },
      });

      // Si existe, es un error de límite de intentos
      if (data.exists) {
        throw new EtecsaApiError(
          'Se superó el límite diario de intentos',
          200,
          {
            code: 'too_many_attempts',
            exists: true,
          },
        );
      }

      return data.data ?? {};
    } catch (err) {
      if (err instanceof EtecsaApiError) {
        if (err.status === 226) {
          throw new EtecsaApiError(
            userType === 'celular'
              ? 'El número móvil ya está registrado en el sistema'
              : 'El correo electrónico ya está registrado en el sistema',
            226,
            { code: 'already_registered' },
          );
        }
        if (err.status === 204) {
          throw new EtecsaApiError(
            userType === 'celular'
              ? 'El número móvil no existe o no está activo'
              : 'El correo electrónico no existe o no está activo',
            204,
            { code: 'not_found_or_inactive' },
          );
        }
      }
      throw err;
    }
  },

  /**
   * Generar código de verificación para añadir un servicio.
   */
  generateCode: async (
    userType: 'celular' | 'correo',
    username: string,
  ): Promise<{ message: string }> => {
    try {
      const data = await requestEtecsaApi<{ exists?: boolean }>(
        context,
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'generar_codigo',
            tipo_usuario: userType,
            usuario: username,
          },
        },
      );

      if (data.exists) {
        throw new EtecsaApiError(
          'Se superó la cantidad máxima de intentos (3)',
          200,
          {
            code: 'too_many_attempts',
          },
        );
      }

      const message =
        userType === 'celular'
          ? 'Se envió un código de activación al número móvil'
          : 'Se envió un código de activación al correo electrónico';
      return { message };
    } catch (err) {
      throw err;
    }
  },

  /**
   * Verificar código de activación para añadir servicio.
   */
  verifyCode: async (
    username: string,
    code: string,
    userType: 'celular' | 'correo',
  ): Promise<{ post_pago?: boolean }> => {
    try {
      const data = await requestEtecsaApi<{ data?: { post_pago?: boolean } }>(
        context,
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'verificar_codigo',
            usuario: username,
            codigo: code,
            tipo_usuario: userType,
          },
        },
      );

      if (data.data) {
        return data.data;
      }

      throw new EtecsaApiError('Código inválido', 200, {
        code: 'invalid_code',
      });
    } catch (err) {
      throw err;
    }
  },
});
