/**
 * Petición para obtener el estado de un servicio móvil
 */
export interface GetServiceStatusRequest {
  /** Número móvil a consultar */
  service: string;
  /** Documento de identidad del titular */
  ci: string;
  /** Tipo de documento de identidad */
  typeci: number; // ex: 1
  /** Si es true, envía un SMS al número consultado con el estado */
  sendSms: boolean;
}

/**
 * Códigos de error específicos para servicios móviles
 */
export type MobileServiceErrorCode =
  | 'user_no_ci'
  | 'invalid_relation'
  | 'invalid_user_number'
  | 'service_not_activated'
  | 'sms_limit_exceeded'
  | 'session_expired'
  | 'service_unavailable';

/**
 * Respuesta de error para servicios móviles
 */
export interface MobileServiceErrorResponse {
  error: string;
  code: MobileServiceErrorCode;
}

/**
 * Estado completo de un servicio prepago
 */
export interface PrepaidServiceStatus {
  numero: string;
  balance: string;
  pinCode: string;
  tipolinea: 'prepago';
  paquete3g: string;
  paquete4g: string;
  tarifaC: string;
  facticacion: string;
  fsupervicion: string;
  fexpiracion: string;
  planSectorial: string;
  planAmigo: string;
  numerosAmigos: string[];
  voz: string;
  fvoz: string;
  sms: string;
  fsms: string;
  bonoDatosNacionales: string;
  fdatosnac: string;
  datos: string;
  datosLTE: string;
  fdatosinter: string;
  montoPermitidoRecarga: string;
  fechaPermitidaRecarga: string;
}

/**
 * Estado completo de un servicio postpago
 */
export interface PostpaidServiceStatus {
  numero: string;
  tipolinea: 'postpago';
  voz: string;
  sms: string;
  datos: string;
}

/**
 * Estado completo de una línea SIM datos
 */
export interface SimDataServiceStatus {
  numero: string;
  tipo_cuenta: string;
  tipolinea: 'simdatos';
  datos: string;
  datos_vence: string;
}

export type GetServiceStatusResponse =
  PrepaidServiceStatus | PostpaidServiceStatus | SimDataServiceStatus;

export type MobileServiceRequestOptions = {
  operation: string;
  data?: Record<string, unknown>;
};
