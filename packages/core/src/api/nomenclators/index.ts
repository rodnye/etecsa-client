import type { EtecsaClientContext } from '../../client';
import { requestEtecsaApi } from '../../core/api';
import {
  MunicipalitiesResponse,
  NautaInterruptionsResponse,
  ProvincesResponse,
  StbInterruptionsResponse,
} from './types';

export const createNomenclatorsApi = (context: EtecsaClientContext) => ({
  provinces: (): Promise<ProvincesResponse> =>
    requestEtecsaApi<ProvincesResponse>(
      context,
      '/nomencladores/nom_provincias_api',
      { method: 'get' },
    ),

  municipalities: (provinceId: number): Promise<MunicipalitiesResponse> =>
    requestEtecsaApi<MunicipalitiesResponse>(
      context,
      '/nomencladores/nom_municipios_api',
      {
        method: 'post',
        data: {
          operacion: 'get_municipios',
          id: provinceId,
        },
      },
    ),

  nautaInterruptions: (): Promise<NautaInterruptionsResponse> =>
    requestEtecsaApi<NautaInterruptionsResponse>(
      context,
      '/nomencladores/nom_interr_nauta_api',
      { method: 'get' },
    ),

  stbInterruptions: (): Promise<StbInterruptionsResponse> =>
    requestEtecsaApi<StbInterruptionsResponse>(
      context,
      '/nomencladores/nom_interr_stb_api',
      { method: 'get' },
    ),
});
