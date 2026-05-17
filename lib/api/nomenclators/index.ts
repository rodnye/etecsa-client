import { requestEtecsaApi } from '../../core/api';
import {
  MunicipalitiesResponse,
  NautaInterruptionsResponse,
  ProvincesResponse,
  StbInterruption,
} from './types';

export const nomenclatorsApi = {
  loadNautaInterruptions: async () =>
    (
      await requestEtecsaApi<NautaInterruptionsResponse>(
        '/nomencladores/nom_interr_nauta_api',
        {
          method: 'get',
        },
      )
    ).data,

  loadStbInterruptions: async () =>
    (
      await requestEtecsaApi<StbInterruption>(
        '/nomencladores/nom_interr_stb_api',
        {
          method: 'get',
        },
      )
    ).data,

  /**
   * @param provinceId - de 1 a 16
   */
  loadMunicipalities: async (provinceId: number) =>
    (
      await requestEtecsaApi<MunicipalitiesResponse>(
        '/nomencladores/nom_municipios_api',
        {
          method: 'post',
          data: {
            operacion: 'get_municipios',
            id: provinceId,
          },
        },
      )
    ).data,

  loadProvinces: async () =>
    (
      await requestEtecsaApi<ProvincesResponse>(
        '/nomencladores/nom_provincias_api',
        {
          method: 'get',
        },
      )
    ).data,
};
