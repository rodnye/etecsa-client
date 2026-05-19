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

export const pageApi = {
  home: (): Promise<ApiResult<LoadHomePageData>> =>
    postPageData<LoadHomePageData>({
      operation: 'cargar_datos_pagina_principal',
    }),

  packages: (): Promise<ApiResult<LoadPackages>> =>
    postPageData<LoadPackages>({ operation: 'cargar_paquetes' }),

  bags: (): Promise<ApiResult<LoadBags>> =>
    postPageData<LoadBags>({ operation: 'cargar_bolsas' }),

  bag: (): Promise<ApiResult<LoadBag>> =>
    postPageData<LoadBag>({ operation: 'cargar_bolsa' }),

  plans: (): Promise<ApiResult<LoadPlans>> =>
    postPageData<LoadPlans>({ operation: 'cargar_planes' }),

  specialPlans: (): Promise<ApiResult<LoadSpecialPlans>> =>
    postPageData<LoadSpecialPlans>({ operation: 'cargar_planes_especial' }),

  additionalPlans: (): Promise<ApiResult<LoadAdditionalPlans>> =>
    postPageData<LoadAdditionalPlans>({ operation: 'cargar_planes_adicional' }),

  offers: (): Promise<ApiResult<LoadOffersAndPromotions>> =>
    postPageData<LoadOffersAndPromotions>({
      operation: 'cargar_ofertas_promociones',
    }),

  faq: (): Promise<ApiResult<LoadFrequentQuestions>> =>
    postPageData<LoadFrequentQuestions>({
      operation: 'cargar_preguntas_frecuentes',
    }),
};
