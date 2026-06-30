import type { EtecsaClientContext } from '../../client';
import { createLogin } from './login';
import {
  createSendCode,
  createVerifyCode,
  createResetPassword,
} from './recovery';
import { saveCookies, loadCookies, clearCookies } from './cookies';
import { performLogout } from '../logout';

export const createAuthApi = (context: EtecsaClientContext) => ({
  login: createLogin(context),
  logout: () => performLogout(context),
  sendCode: createSendCode(context),
  verifyCode: createVerifyCode(context),
  resetPassword: createResetPassword(context),
  save: () => saveCookies(context),
  load: (json: Record<string, import('./cookies').SerializedCookie>) =>
    loadCookies(context, json),
  clear: () => clearCookies(context),
});
