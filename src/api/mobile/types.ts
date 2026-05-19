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
  /** Número del servicio */
  numero: string;

  /** Saldo disponible */
  balance: string;

  /** PIN de transferencia */
  pinCode: string;

  /** Tipo de línea ("prepago") */
  tipolinea: 'prepago';

  /** Paquete 3G contratado */
  paquete3g: string;

  /** Paquete 4G contratado */
  paquete4g: string;

  /** Tarifa por consumo */
  tarifaC: string;

  /** Fecha de activación */
  facticacion: string;

  /** Fecha de expiración */
  fsupervicion: string;

  /** Fecha de vencimiento */
  fexpiracion: string;

  /** Plan sectorial */
  planSectorial: string;

  /** Plan amigos */
  planAmigo: string;

  /** Números amigos */
  numerosAmigos: string[];

  /** Tiempo de voz disponible */
  voz: string;

  /** Vencimiento de voz */
  fvoz: string;

  /** Cantidad de SMS disponibles */
  sms: string;

  /** Vencimiento de SMS */
  fsms: string;

  /** Bono de datos nacionales */
  bonoDatosNacionales: string;

  /** Vencimiento datos nacionales */
  fdatosnac: string;

  /** Datos internacionales */
  datos: string;

  /** Datos LTE internacionales */
  datosLTE: string;

  /** Vencimiento datos internacionales */
  fdatosinter: string;

  /** Monto permitido para recarga */
  montoPermitidoRecarga: string;

  /** Fecha permitida para recarga */
  fechaPermitidaRecarga: string;
}

/**
 * Estado completo de un servicio postpago
 */
export interface PostpaidServiceStatus {
  /** Número del servicio */
  numero: string;
  /** Tipo de línea ("postpago") */
  tipolinea: 'postpago';
  /** Voz disponible */
  voz: string;
  /** SMS disponibles */
  sms: string;
  /** Datos móviles disponibles */
  datos: string;
}

/**
 * Estado completo de una línea SIM datos
 */
export interface SimDataServiceStatus {
  /** Número del servicio */
  numero: string;
  /** Tipo de cuenta */
  tipo_cuenta: string;
  /** Tipo de línea ("simdatos") */
  tipolinea: 'simdatos';
  /** Datos disponibles */
  datos: string;
  /** Vencimiento de los datos */
  datos_vence: string;
}

export type GetServiceStatusResponse =
  | PrepaidServiceStatus
  | PostpaidServiceStatus
  | SimDataServiceStatus;export type MobileServiceRequestOptions = {
  operation: string;
  data?: Record<string, unknown>;
};

