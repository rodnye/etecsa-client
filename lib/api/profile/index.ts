import { requestEtecsaApi } from '../../core/api';
import { ApiResponse } from '../../core/types';
import {
  CashiersResponse,
  EditUserRequest,
  EditUserResponse,
  GetLandlineServicesResponse,
  GetMobileServicesResponse,
  GetOwnCardResponse,
  NautaHogarResponse,
  ProfileResponse,
} from './types';

/**
 * API para operaciones de perfil de usuario
 * Endpoint: /usuarios/perfil_api
 */
export const profileApi = {
  /**
   * Obtener lista de IDs de cajeros
   */
  getCashiersIds: async (): Promise<
    ApiResponse & { data?: CashiersResponse }
  > => {
    try {
      const response = await requestEtecsaApi<CashiersResponse, any>(
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'get_id_cajeros',
          },
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          data: response.data,
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Get id cajeros error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Obtener datos de la tarjeta propia del usuario
   */
  getOwnCard: async (): Promise<
    ApiResponse & { data?: GetOwnCardResponse }
  > => {
    try {
      const response = await requestEtecsaApi<GetOwnCardResponse, any>(
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'get_tarjeta_propia',
          },
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          data: response.data,
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Get tarjeta propia error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Obtener lista de servicios fijos asociados al usuario
   */
  getLandlineServices: async (): Promise<
    ApiResponse & { data?: GetLandlineServicesResponse }
  > => {
    try {
      const response = await requestEtecsaApi<GetLandlineServicesResponse, any>(
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'get_servicios_fijos',
          },
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          data: response.data,
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Get servicios fijos error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Verificar si un usuario existe en el sistema
   */
  verifyUser: async (
    id: string,
    userType: 'celular' | 'correo',
    username: string,
  ): Promise<
    ApiResponse & { exists?: boolean; data?: { post_pago?: boolean } }
  > => {
    try {
      const response = await requestEtecsaApi<
        { exists?: boolean; data?: { post_pago?: boolean } },
        any
      >('/usuarios/perfil_api', {
        method: 'post',
        data: {
          operacion: 'verificar_usuario',
          id,
          tipo_usuario: userType,
          usuario: username,
        },
      });

      if (response.status === 226) {
        return {
          success: false,
          status: 226,
          error: 'already_registered',
          message:
            userType === 'celular'
              ? 'El número móvil ya está registrado en el sistema'
              : 'El correo electrónico ya está registrado en el sistema',
        };
      }

      if (response.status === 204) {
        return {
          success: false,
          status: 204,
          error: 'not_found_or_inactive',
          message:
            userType === 'celular'
              ? 'El número móvil no existe o no está activo'
              : 'El correo electrónico no existe o no está activo',
        };
      }

      if (response.status === 200) {
        if (response.data.exists === true) {
          return {
            success: false,
            status: 200,
            error: 'too_many_attempts',
            exists: true,
            message: 'Se superó el límite diario de intentos',
          };
        }

        return {
          success: true,
          status: 200,
          exists: false,
          data: response.data.data,
          message: 'Usuario válido',
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Verificar usuario error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Generar y enviar código de activación
   */
  generateCode: async (
    userType: 'celular' | 'correo',
    username: string,
  ): Promise<ApiResponse & { exists?: boolean }> => {
    try {
      const response = await requestEtecsaApi<{ exists: boolean }, any>(
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

      if (response.status === 200) {
        if (response.data.exists === true) {
          return {
            success: false,
            status: 200,
            error: 'too_many_attempts',
            exists: true,
            message: 'Se superó la cantidad máxima de intentos (3)',
          };
        }

        return {
          success: true,
          status: 200,
          exists: false,
          message:
            userType === 'celular'
              ? 'Se envió un código de activación al número móvil'
              : 'Se envió un código de activación al correo electrónico',
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Generar código error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Verificar código de activación
   */
  verifyCode: async (
    username: string,
    code: string,
    userType: 'celular' | 'correo',
  ): Promise<ApiResponse & { data?: { post_pago?: boolean } }> => {
    try {
      const response = await requestEtecsaApi<{
        data?: { post_pago?: boolean };
      }>('/usuarios/perfil_api', {
        method: 'post',
        data: {
          operacion: 'verificar_codigo',
          usuario: username,
          codigo: code,
          tipo_usuario: userType,
        },
      });

      if (response.status === 200) {
        if (response.data?.data) {
          const data =
            typeof response.data === 'object' && 'data' in response.data
              ? response.data.data
              : undefined;

          return {
            success: true,
            status: 200,
            data,
            message: 'Código válido, servicio agregado al perfil',
          };
        }

        return {
          success: false,
          status: 200,
          error: 'invalid_code',
          message: 'Código inválido',
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Verificar código error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Obtener perfil completo del usuario
   */
  getProfile: async (): Promise<ApiResponse & { data?: ProfileResponse }> => {
    try {
      const response = await requestEtecsaApi<ProfileResponse, any>(
        '/usuarios/perfil_api',
        {
          method: 'get',
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          data: response.data,
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Get perfil error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Cerrar sesión del usuario en el servidor
   */
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await requestEtecsaApi<null, any>(
        '/usuarios/perfil_api',
        {
          method: 'put',
          data: {
            operacion: 'cerrar_session',
          },
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          message: 'Sesión cerrada correctamente',
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Cerrar sesión error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Editar perfil de usuario
   */
  editUser: async (data: EditUserRequest): Promise<EditUserResponse> => {
    try {
      const response = await requestEtecsaApi<null, EditUserRequest>(
        '/usuarios/perfil_api',
        {
          method: 'put',
          data: {
            operacion: 'editar_usuario',
            ...data,
          },
        },
      );

      if (response.status === 226) {
        const errorMessage = response.data as unknown as string;
        let errorType: EditUserResponse['error'] = 'validation_error';
        let errorKey: EditUserResponse['errorKey'];

        if (errorMessage === 'carnet') {
          errorKey = 'carnet';
        } else if (errorMessage === 'carnet_con_movil') {
          errorKey = 'carnet_con_movil';
        } else if (errorMessage === 'carnet_con_correo') {
          errorKey = 'carnet_con_correo';
        }

        return {
          success: false,
          status: 226,
          error: errorType,
          errorKey,
          message: 'Error de validación',
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          message: 'Perfil editado correctamente',
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Editar usuario error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Obtener lista de servicios Nauta Hogar
   */
  getNautaHogar: async (): Promise<
    ApiResponse & { data?: NautaHogarResponse }
  > => {
    try {
      const response = await requestEtecsaApi<NautaHogarResponse, any>(
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'get_nauta_hogar',
          },
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          data: response.data,
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Get nauta hogar error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },

  /**
   * Obtener lista de servicios móviles
   */
  getMobileServices: async (): Promise<
    ApiResponse & { data?: GetMobileServicesResponse }
  > => {
    try {
      const response = await requestEtecsaApi<GetMobileServicesResponse, any>(
        '/usuarios/perfil_api',
        {
          method: 'post',
          data: {
            operacion: 'get_servicios_moviles',
          },
        },
      );

      if (response.status === 403) {
        return {
          success: false,
          status: 403,
          error: 'session_expired',
          message: 'Su sesión expiró',
        };
      }

      if (response.status === 423) {
        return {
          success: false,
          status: 423,
          error: 'service_unavailable',
          message: 'El servicio no está disponible',
        };
      }

      if (response.status === 200) {
        return {
          success: true,
          status: 200,
          data: response.data,
        };
      }

      return {
        success: false,
        status: response.status,
        error: 'server_error',
        message: 'Ocurrió un error',
      };
    } catch (error) {
      console.error('Get servicios moviles error:', error);
      return {
        success: false,
        status: 500,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },
};
