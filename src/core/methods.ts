import type { CookieJar } from 'jsdom';
import { loadVirtualDOM } from './dom';
import { AxiosStatic } from 'axios';
import {
  setInitPromise,
  setReady,
  getInitPromise,
  checkReady,
} from './init-cache';

export const ETECSA: {
  axios: AxiosStatic;
  encryptPayload: (data: object) => { datos: [string, string] };
  href: string;
  CryptoJS: typeof CryptoJS;
  cookiesJar: CookieJar;
} = {} as any;

/**
 * Initialize ETECSA methods
 * Ensures all API calls wait for initialization to complete
 */
export const init = async (): Promise<void> => {
  if (getInitPromise()) {
    return getInitPromise()!;
  }

  const promise = (async () => {
    const dom = await loadVirtualDOM();
    Object.assign(ETECSA, {
      ...dom.window.extracted,
      cookiesJar: dom.cookieJar,
    });
    setReady();
  })();

  setInitPromise(promise);
  return promise;
};

/**
 * Ensure client is initialized
 */
export const ensureInit = async (): Promise<void> => {
  if (!getInitPromise()) {
    throw new Error('ETECSA not initialized. Call init() first.');
  }
  await getInitPromise();
  checkReady();
};
