import { EtecsaClientContext } from '../../client.ts';
import { requestEtecsaApi } from '../../core/api.ts';
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
} from './types.ts';

const postPageData = async <R = unknown>(
  context: EtecsaClientContext,
  operation: string,
): Promise<R> => {
  return requestEtecsaApi<R>(context, '/tienda_admin/datos_pagina_api', {
    method: 'post',
    data: { operacion: operation },
  });
};

export const createPageApi = (context: EtecsaClientContext) => ({
  home: (): Promise<LoadHomePageData> =>
    postPageData(context, 'cargar_datos_pagina_principal'),
  packages: (): Promise<LoadPackages> =>
    postPageData(context, 'cargar_paquetes'),
  bags: (): Promise<LoadBags> => postPageData(context, 'cargar_bolsas'),
  bag: (): Promise<LoadBag> => postPageData(context, 'cargar_bolsa'),
  plans: (): Promise<LoadPlans> => postPageData(context, 'cargar_planes'),
  specialPlans: (): Promise<LoadSpecialPlans> =>
    postPageData(context, 'cargar_planes_especial'),
  additionalPlans: (): Promise<LoadAdditionalPlans> =>
    postPageData(context, 'cargar_planes_adicional'),
  offers: (): Promise<LoadOffersAndPromotions> =>
    postPageData(context, 'cargar_ofertas_promociones'),
  faq: (): Promise<LoadFrequentQuestions> =>
    postPageData(context, 'cargar_preguntas_frecuentes'),
});
