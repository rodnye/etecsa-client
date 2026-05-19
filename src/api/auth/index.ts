import { login } from './login';
import { sendCode, verifyCode, resetPassword } from './recovery';
import { profileApi } from '../profile';
import { clearCookies, loadCookies, saveCookies } from './cookies';

export const authApi = {
  login,
  logout: profileApi.logout,
  sendCode,
  verifyCode,
  resetPassword,
  save: saveCookies,
  load: loadCookies,
  clear: clearCookies,
};