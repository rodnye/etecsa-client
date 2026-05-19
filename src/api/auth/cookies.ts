import { ETECSA } from '../../core/methods';
import type { Cookie } from 'tough-cookie';

export interface AuthCookies {
  csrfToken?: Cookie;
  sessionId?: Cookie;
  [key: string]: Cookie | undefined;
}

export interface SerializedCookie {
  key: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string | null;
  maxAge?: number | 'Infinity' | '-Infinity' | null;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
}

/**
 * Guarda las cookies actuales como objeto JSON serializable
 */
export const saveCookies = (): Record<string, SerializedCookie> => {
  const cookies = ETECSA.cookiesJar.getCookiesSync(ETECSA.href);
  const serialized: Record<string, SerializedCookie> = {};

  for (const cookie of cookies) {
    serialized[cookie.key] = {
      key: cookie.key,
      value: cookie.value,
      domain: cookie.domain ?? undefined,
      path: cookie.path ?? undefined,
      expires: cookie.expires ? cookie.expires.toString() : null,
      maxAge: cookie.maxAge,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
    };
  }

  return serialized;
};

/**
 * Carga cookies desde un objeto JSON serializado
 */
export const loadCookies = async (
  cookiesJson: Record<string, SerializedCookie>,
): Promise<void> => {
  const { Cookie } = await import('tough-cookie');

  for (const key of Object.keys(cookiesJson)) {
    const data = cookiesJson[key];
    const cookie = new Cookie({
      key: data.key,
      value: data.value,
      domain: data.domain,
      path: data.path,
      expires: data.expires ? new Date(data.expires) : undefined,
      maxAge: data.maxAge ?? undefined,
      secure: data.secure,
      httpOnly: data.httpOnly,
      sameSite: data.sameSite as 'strict' | 'lax' | 'none' | undefined,
    });

    ETECSA.cookiesJar.setCookieSync(cookie, ETECSA.href);
  }
};

/**
 * Limpia todas las cookies
 */
export const clearCookies = (): void => {
  ETECSA.cookiesJar.removeAllCookiesSync();
};
