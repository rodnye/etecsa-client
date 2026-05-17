export interface NautaInterruption {
  id: number;
  code: string;
  description: string;
}

export interface StbInterruption {
  id: number;
  code: string;
  description: string;
}

export interface Province {
  id: number;
  name: string;
  /** Código DPA (División Político-Administrativa) de la provincia */
  state_dpa: string;
}

export interface Municipality {
  id: number;
  name: string;
  provincia_id: number;
  
  /** Código DPA (División Político-Administrativa) del municipio */
  municipalitie_dpa: string;
  
  /**
   * Lista de tiendas/oficinas comerciales en el municipio.
   * Formato: "codigo_tienda,Nombre Tienda|codigo_tienda,Nombre Tienda|..."
   * Ejemplo: "33,Oficina Comercial Guane|10,Oficina Comercial Pinar Del Rio"
   */
  store_code_name: string;
}

export type NautaInterruptionsResponse = NautaInterruption[];
export type StbInterruptionsResponse = StbInterruption[];
export type ProvincesResponse = Province[];
export type MunicipalitiesResponse = Municipality[];
