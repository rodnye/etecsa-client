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

export type CashiersResponse = unknown[];
export type GetOwnCardResponse = unknown[];
export type GetLandlineServicesResponse = unknown[];
export type NautaHogarResponse = unknown[];
export type GetMobileServicesResponse = {
  id: number; // ex: 1234567,
  service: string; // ex: "+53 12345678",
  ci: string; // ex: "71123112345",
  typeci: number; //
}[];

export interface Beneficiary {
  [key: string]: unknown;
}

export interface Service {
  [key: string]: unknown;
}

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

export interface EditUserResponseData {
  message: string;
}
