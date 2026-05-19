import { ApiResult } from "../../core/api";
import { GetServiceStatusRequest, GetServiceStatusResponse } from "./types";
import { mobileServicesRequest } from "./utils";

/**
 * Obtener estado del servicio mobil
 * Los datos necesarios se pueden obtener del perfil
 */
export const getMobileServiceStatus = (
  request: GetServiceStatusRequest,
): Promise<ApiResult<GetServiceStatusResponse>> =>
  mobileServicesRequest<GetServiceStatusResponse>({
    operation: 'get_estado_servicio',
    data: {
      servicio: request.service,
      carnet: request.ci,
      tipo_ci: request.typeci,
      enviar_sms: request.sendSms,
    },
  });
