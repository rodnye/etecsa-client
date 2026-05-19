import type { CookieJar } from 'jsdom';
import { loadVirtualDOM } from './dom';
import { AxiosStatic } from 'axios';

export const ETECSA: {
  axios: AxiosStatic;
  encryptPayload: (data: object) => { datos: [string, string] };
  href: string;
  CryptoJS: typeof CryptoJS;
  cookiesJar: CookieJar;
} = {} as any;

/**
 *
 */
export const initEtecsaMethods = async () => {
  const dom = await loadVirtualDOM();
  Object.assign(ETECSA, {
    ...dom.window.extracted,
    cookiesJar: dom.cookieJar,
  });
};
