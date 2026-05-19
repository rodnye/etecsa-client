import { requestEtecsaApi, ApiResult } from '../../core/api';
import type {
  LoadHomePageData,
  LoadPackages,
  LoadPlans,
  LoadBags,
  LoadBag,
  LoadSpecialPlans,
  LoadAdditionalPlans,
  LoadOffersAndPromotions,
  LoadFrequentQuestions,
} from './types';

export interface PageDataRequest {
  operation: string;
  securityValidationUrl?: string;
}

const postPageData = async <R = unknown>(
  data: PageDataRequest,
): Promise<ApiResult<R>> => {
  return requestEtecsaApi<R>('/tienda_admin/datos_pagina_api', {
    method: 'post',
    data: {
      operacion: data.operation,
    },
  });
};

export const pageDataApi = {
  loadHomePageData: (): Promise<ApiResult<LoadHomePageData>> =>
    postPageData<LoadHomePageData>({
      operation: 'cargar_datos_pagina_principal',
    }),

  loadPackages: (): Promise<ApiResult<LoadPackages>> =>
    postPageData<LoadPackages>({ operation: 'cargar_paquetes' }),

  loadPlans: (): Promise<ApiResult<LoadPlans>> =>
    postPageData<LoadPlans>({ operation: 'cargar_planes' }),

  loadBags: (): Promise<ApiResult<LoadBags>> =>
    postPageData<LoadBags>({ operation: 'cargar_bolsas' }),

  loadBag: (): Promise<ApiResult<LoadBag>> =>
    postPageData<LoadBag>({ operation: 'cargar_bolsa' }),

  loadSpecialPlans: (): Promise<ApiResult<LoadSpecialPlans>> =>
    postPageData<LoadSpecialPlans>({ operation: 'cargar_planes_especial' }),

  loadAdditionalPlans: (): Promise<ApiResult<LoadAdditionalPlans>> =>
    postPageData<LoadAdditionalPlans>({ operation: 'cargar_planes_adicional' }),

  loadOffersAndPromotions: (): Promise<ApiResult<LoadOffersAndPromotions>> =>
    postPageData<LoadOffersAndPromotions>({
      operation: 'cargar_ofertas_promociones',
    }),

  loadFrequentQuestions: (): Promise<ApiResult<LoadFrequentQuestions>> =>
    postPageData<LoadFrequentQuestions>({
      operation: 'cargar_preguntas_frecuentes',
    }),
};
