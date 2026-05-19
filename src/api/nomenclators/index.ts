import { requestEtecsaApi, ApiResult } from '../../core/api';
import {
  MunicipalitiesResponse,
  NautaInterruptionsResponse,
  ProvincesResponse,
  StbInterruption,
} from './types';

export const nomenclatorsApi = {
  provinces: (): Promise<ApiResult<ProvincesResponse>> =>
    requestEtecsaApi<ProvincesResponse>('/nomencladores/nom_provincias_api', {
      method: 'get',
    }),

  municipalities: (
    provinceId: number,
  ): Promise<ApiResult<MunicipalitiesResponse>> =>
    requestEtecsaApi<MunicipalitiesResponse>(
      '/nomencladores/nom_municipios_api',
      {
        method: 'post',
        data: {
          operacion: 'get_municipios',
          id: provinceId,
        },
      },
    ),

  nautaInterruptions: (): Promise<ApiResult<NautaInterruptionsResponse>> =>
    requestEtecsaApi<NautaInterruptionsResponse>(
      '/nomencladores/nom_interr_nauta_api',
      { method: 'get' },
    ),

  stbInterruptions: (): Promise<ApiResult<StbInterruption>> =>
    requestEtecsaApi<StbInterruption>('/nomencladores/nom_interr_stb_api', {
      method: 'get',
    }),
};
