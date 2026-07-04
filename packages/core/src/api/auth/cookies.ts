import { Cookie, CookieJar } from 'tough-cookie';
import type { EtecsaClientContext } from '../../client';

/**
 * Guarda las cookies actuales como objeto JSON serializable
 */
export const saveCookies = (
  { cookiesJar }: EtecsaClientContext,
): CookieJar.Serialized => {
  return cookiesJar.toJSON();
};

/**
 * Carga cookies desde un objeto JSON serializado
 */
export const loadCookies = async (
  { href, cookiesJar }: EtecsaClientContext,
  cookiesJson: CookieJar.Serialized,
): Promise<void> => {
  for (const cookie of cookiesJson.cookies) {
    cookiesJar.setCookieSync(new Cookie(cookie), href);
  }
};

/**
 * Limpia todas las cookies
 */
export const clearCookies = (context: EtecsaClientContext): void => {
  context.cookiesJar.removeAllCookiesSync();
};
