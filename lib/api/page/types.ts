/**
 * Producto base de paquetes, planes, bolsas. (ppb)
 */
export interface PpbItem {
  id: number;
  nombre: string;
  precio: number;
  tarifa_consumo: number;
  package3G: number;
  package4G: number;
  descripcion: string[];
  imagen: string;
}

export interface BannerTopItem {
  id: number;
  nombre_boton: string;
  icono: string;
  imagen: string;
  icono_secundario: string;
  imagen_celular: string;
  url: string;
}

export interface BannerIntermedio {
  banner_image: string;
  banner_phone_image: string;
}

export interface OportunidadItem {
  id: number;
  title: string;
  subtitle: string;
  action_name: string;
  image: string;
  url_name: string;
}

export interface HomePageDataResponse {
  banner_top: BannerTopItem[];
  ppb: PpbItem[];
  banner_itermedio: BannerIntermedio;
  oportunidades: OportunidadItem[];
}

export interface PpbResponse {
  ppb: PpbItem[];
}

// Nota: loadOffersAndPromotions devuelve un array vacío o de ofertas
export type OffersAndPromotionsResponse = unknown[];

export interface PreguntaFrecuente {
  id: number;
  question_title: string;
  description_question: string;
}

export type FrequentQuestionsResponse = PreguntaFrecuente[];

export type LoadHomePageData = HomePageDataResponse;
export type LoadPackages = PpbResponse;
export type LoadPlans = PpbResponse;
export type LoadBags = PpbResponse;
export type LoadBag = PpbResponse;
export type LoadSpecialPlans = PpbResponse;
export type LoadAdditionalPlans = PpbResponse;
export type LoadOffersAndPromotions = OffersAndPromotionsResponse;
export type LoadFrequentQuestions = FrequentQuestionsResponse;
