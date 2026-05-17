import { requestEtecsaApi } from '../../core/api';
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

const postPageData = async <R = unknown>(data: PageDataRequest): Promise<R> => {
  const response = await requestEtecsaApi<R>('/tienda_admin/datos_pagina_api', {
    method: 'post',
    data: {
      operacion: data.operation,
      url_validacion_seguridad: data.securityValidationUrl,
    },
  });
  return response.data;
};

export const pageDataApi = {
  loadHomePageData: () =>
    postPageData<LoadHomePageData>({
      operation: 'cargar_datos_pagina_principal',
    }),

  loadPackages: () =>
    postPageData<LoadPackages>({ operation: 'cargar_paquetes' }),

  loadPlans: () => postPageData<LoadPlans>({ operation: 'cargar_planes' }),

  loadBags: () => postPageData<LoadBags>({ operation: 'cargar_bolsas' }),

  loadBag: () => postPageData<LoadBag>({ operation: 'cargar_bolsa' }),

  loadSpecialPlans: () =>
    postPageData<LoadSpecialPlans>({ operation: 'cargar_planes_especial' }),

  loadAdditionalPlans: () =>
    postPageData<LoadAdditionalPlans>({ operation: 'cargar_planes_adicional' }),

  loadOffersAndPromotions: () =>
    postPageData<LoadOffersAndPromotions>({
      operation: 'cargar_ofertas_promociones',
    }),

  loadFrequentQuestions: () =>
    postPageData<LoadFrequentQuestions>({
      operation: 'cargar_preguntas_frecuentes',
    }),
};
