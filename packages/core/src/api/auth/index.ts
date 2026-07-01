import type { EtecsaClientContext } from '../../client.ts';
import { createLogin } from './login.ts';
import {
  createSendCode,
  createVerifyCode,
  createResetPassword,
} from './recovery.ts';
import { saveCookies, loadCookies, clearCookies } from './cookies.ts';
import { performLogout } from '../logout.ts';
import { CookieJar } from 'tough-cookie';

export const createAuthApi = (context: EtecsaClientContext) => ({
  login: createLogin(context),
  logout: () => performLogout(context),
  sendCode: createSendCode(context),
  verifyCode: createVerifyCode(context),
  resetPassword: createResetPassword(context),
  save: () => saveCookies(context),
  load: (json: CookieJar.Serialized) => loadCookies(context, json),
  clear: () => clearCookies(context),
});
