import { ApiResponse } from '../../core/types';

export interface ProfileUser {
  id: number;
  tipo_usuario: boolean;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  carnet: string;
  tipoci: number;
  provincia: number;
  municipio: number;
  sexo: number;
  direccion: string;
  movil: string;
  email: string;
  post_pago: boolean;
}

export interface ProfileServiceItem {
  key: number;
  value: string;
}

export interface ProfileServices {
  moviles: ProfileServiceItem[];
  fijos: unknown[];
  nauta: unknown[];
  nauta_hogar: unknown[];
  nauta_correo: unknown[];
}

export interface ProfileMunicipio {
  id: number;
  name: string;
  provincia_id: number;
  municipalitie_dpa: string;
  store_code_name: string;
}

export interface ProfileData {
  usuario: ProfileUser;
  beneficiarios: unknown[];
  servicios: ProfileServices;
  municipios: ProfileMunicipio[];
}

export interface ProfileResponse extends ApiResponse {
  data?: ProfileData;
}

/**
 * Respuesta de get_id_cajeros
 */
export type CashiersResponse = unknown;

/**
 * Respuesta de get_tarjeta_propia
 */
export type GetOwnCardResponse = unknown;

/**
 * Respuesta de get_servicios_fijos
 */
export type GetLandlineServicesResponse = unknown;

/**
 * Respuesta de get_nauta_hogar
 */
export type NautaHogarResponse = unknown;

/**
 * Respuesta de get_servicios_moviles
 */
export type GetMobileServicesResponse = unknown;

/**
 * Beneficiario
 */
export interface Beneficiary {
  [key: string]: unknown;
}

/**
 * Servicio
 */
export interface Service {
  [key: string]: unknown;
}

/**
 * Solicitud de edición de usuario
 */
export interface EditUserRequest {
  tipo_usuario?: string;
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  carnet?: string;
  provincia?: string;
  municipio?: string;
  sexo?: string;
  direccion?: string;
  correo?: string;
  movil?: string;
  beneficiarios?: Beneficiary[] | string;
  servicios?: Service[] | string;
  tipo_ci?: string;
  tipo_post_pago?: string;
}

/**
 * Respuesta de edición de usuario
 */
export interface EditUserResponse extends ApiResponse {
  error?:
    | 'validation_error'
    | 'session_expired'
    | 'service_unavailable'
    | 'server_error';
  errorKey?: 'carnet' | 'carnet_con_movil' | 'carnet_con_correo';
}
