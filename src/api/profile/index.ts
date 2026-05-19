import { requestEtecsaApi, ApiResult } from '../../core/api';
import {
  CashiersResponse,
  EditUserRequest,
  GetLandlineServicesResponse,
  GetMobileServicesResponse,
  GetOwnCardResponse,
  NautaHogarResponse,
  ProfileData,
} from './types';

type ProfileRequestOptions<T> = {
  operation?: string;
  method?: 'get' | 'post' | 'put';
  data?: Record<string, unknown>;
};

async function profileRequest<T>(
  options: ProfileRequestOptions<T>,
): Promise<ApiResult<T>> {
  const result = await requestEtecsaApi<T>('/usuarios/perfil_api', {
    method: options.method || 'post',
    data:
      options.operation !== undefined
        ? { operacion: options.operation, ...options.data }
        : options.data,
  });

  if (!result.ok) {
    return result;
  }

  const { status } = result;

  // Common session expired / unavailable
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

  return result;
}

export const profileApi = {
  me: (): Promise<ApiResult<ProfileData>> =>
    profileRequest<ProfileData>({
      method: 'get',
    }),

  mobileServices: (): Promise<ApiResult<GetMobileServicesResponse>> =>
    profileRequest<GetMobileServicesResponse>({
      operation: 'get_servicios_moviles',
    }),

  /**
   * TODO: untested
   */
  edit: async (
    data: EditUserRequest,
  ): Promise<ApiResult<{ message: string }>> => {
    const result = await requestEtecsaApi<unknown>('/usuarios/perfil_api', {
      method: 'put',
      data: {
        operacion: 'editar_usuario',
        ...data,
      },
    });

    if (!result.ok) {
      return result;
    }

    const { status } = result;

    if (status === 226) {
      const errorMessage = result.data as string;
      let errorKey:
        | 'carnet'
        | 'carnet_con_movil'
        | 'carnet_con_correo'
        | undefined;
      if (errorMessage === 'carnet') errorKey = 'carnet';
      else if (errorMessage === 'carnet_con_movil')
        errorKey = 'carnet_con_movil';
      else if (errorMessage === 'carnet_con_correo')
        errorKey = 'carnet_con_correo';

      return {
        ok: false,
        error: 'Error de validación',
        status: 226,
        details: { code: 'validation_error', errorKey },
      };
    }

    if (status === 200) {
      return {
        ok: true,
        data: { message: 'Perfil editado correctamente' },
        status: 200,
      };
    }

    return {
      ok: false,
      error: 'Ocurrió un error',
      status,
      details: { code: 'server_error' },
    };
  },

  logout: async (): Promise<ApiResult<{ message: string }>> => {
    const result = await profileRequest<null>({
      operation: 'cerrar_session',
      method: 'put',
    });

    if (!result.ok) {
      return result;
    }

    return {
      ok: true,
      data: { message: 'Sesión cerrada correctamente' },
      status: result.status,
    };
  },

  nautaHogar: (): Promise<ApiResult<NautaHogarResponse>> =>
    profileRequest<NautaHogarResponse>({
      operation: 'get_nauta_hogar',
    }),

  cashiersIds: (): Promise<ApiResult<CashiersResponse>> =>
    profileRequest<CashiersResponse>({
      operation: 'get_id_cajeros',
    }),

  ownCard: (): Promise<ApiResult<GetOwnCardResponse>> =>
    profileRequest<GetOwnCardResponse>({
      operation: 'get_tarjeta_propia',
    }),

  landlineServices: (): Promise<ApiResult<GetLandlineServicesResponse>> =>
    profileRequest<GetLandlineServicesResponse>({
      operation: 'get_servicios_fijos',
    }),

  /**
   * FIXME: error 500
   */
  verifyUser: async (
    id: string,
    userType: 'celular' | 'correo',
    username: string,
  ): Promise<ApiResult<{ post_pago?: boolean }>> => {
    const result = await requestEtecsaApi<{
      exists?: boolean;
      data?: { post_pago?: boolean };
    }>('/usuarios/perfil_api', {
      method: 'post',
      data: {
        operacion: 'verificar_usuario',
        id,
        tipo_usuario: userType,
        usuario: username,
      },
    });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
        status: result.status,
        details: { code: 'server_error', original: result.details },
      };
    }

    const { status, data } = result;

    if (status === 226) {
      return {
        ok: false,
        error:
          userType === 'celular'
            ? 'El número móvil ya está registrado en el sistema'
            : 'El correo electrónico ya está registrado en el sistema',
        status: 226,
        details: { code: 'already_registered' },
      };
    }

    if (status === 204) {
      return {
        ok: false,
        error:
          userType === 'celular'
            ? 'El número móvil no existe o no está activo'
            : 'El correo electrónico no existe o no está activo',
        status: 204,
        details: { code: 'not_found_or_inactive' },
      };
    }

    if (status === 200) {
      if (data.exists === true) {
        return {
          ok: false,
          error: 'Se superó el límite diario de intentos',
          status: 200,
          details: { code: 'too_many_attempts', exists: true },
        };
      }
      return {
        ok: true,
        data: data.data ?? {},
        status: 200,
      };
    }

    return {
      ok: false,
      error: 'Ocurrió un error',
      status,
      details: { code: 'server_error' },
    };
  },

  /**
   * FIXME: error 500
   */
  generateCode: async (
    userType: 'celular' | 'correo',
    username: string,
  ): Promise<ApiResult<{ message: string }>> => {
    const result = await requestEtecsaApi<{ exists?: boolean }>(
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
      if (data.exists === true) {
        return {
          ok: false,
          error: 'Se superó la cantidad máxima de intentos (3)',
          status: 200,
          details: { code: 'too_many_attempts' },
        };
      }
      const message =
        userType === 'celular'
          ? 'Se envió un código de activación al número móvil'
          : 'Se envió un código de activación al correo electrónico';
      return {
        ok: true,
        data: { message },
        status: 200,
      };
    }

    return {
      ok: false,
      error: 'Ocurrió un error',
      status,
      details: { code: 'server_error' },
    };
  },

  /**
   * TODO: untested
   */
  verifyCode: async (
    username: string,
    code: string,
    userType: 'celular' | 'correo',
  ): Promise<ApiResult<{ post_pago?: boolean }>> => {
    const result = await requestEtecsaApi<{ data?: { post_pago?: boolean } }>(
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
      if (data.data) {
        return {
          ok: true,
          data: data.data,
          status: 200,
        };
      }
      return {
        ok: false,
        error: 'Código inválido',
        status: 200,
        details: { code: 'invalid_code' },
      };
    }

    return {
      ok: false,
      error: 'Ocurrió un error',
      status,
      details: { code: 'server_error' },
    };
  },
};
