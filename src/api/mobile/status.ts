import { EtecsaApiError } from '../../core/api';
import { profileApi } from '../profile';
import { GetServiceStatusRequest, GetServiceStatusResponse } from './types';
import { mobileServicesRequest } from './utils';

/**
 * Obtener estado del servicio móvil.
 * - Si no se proporciona request, usa los servicios del perfil.
 * - Si se proporciona request parcial, completa con los datos del perfil.
 */
export const getMobileServiceStatus = async (
  request: Partial<GetServiceStatusRequest> = {},
): Promise<GetServiceStatusResponse> => {
  let finalRequest: GetServiceStatusRequest;
  
  if (request.service && request.ci) {
    // Caso 1: Parámetros completos
    finalRequest = {
      service: request.service,
      ci: request.ci,
      typeci: request.typeci ?? 1,
      sendSms: request.sendSms ?? false,
    };
  } else {
    // Caso 2: Parámetros incompletos - completar con datos del perfil
    const mobileServices = await profileApi.mobileServices();

    if (!mobileServices || mobileServices.length === 0) {
      throw new EtecsaApiError(
        'No se encontraron servicios móviles en el perfil',
        404,
        { code: 'no_mobile_services_found' },
      );
    }

    const service = mobileServices.find((service) => {
      let finded = true;
      if (request.service && request.service !== service.service)
        finded = false;
      if (request.ci && request.ci !== service.ci) finded = false;
      if (request.typeci && request.typeci !== service.typeci) finded = false;
      
      return finded;
    });

    if (!service) throw new EtecsaApiError(
      'Los valores proporcionados en la solicitud no existen en la lista de servicios móviles del perfil',
      404,
      { code: 'no_mobile_services_found' },
    );
    
    finalRequest = {
      service: service.service,
      ci: service.ci,
      typeci: service.typeci,
      sendSms: request.sendSms ?? false,
    };
  }

  return mobileServicesRequest<GetServiceStatusResponse>({
    operation: 'get_estado_servicio',
    data: {
      servicio: finalRequest.service,
      carnet: finalRequest.ci,
      tipo_ci: finalRequest.typeci,
      enviar_sms: finalRequest.sendSms,
    },
  });
};
