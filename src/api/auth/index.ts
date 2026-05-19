import { login } from './login';
import { sendCode, verifyCode, resetPassword } from './recovery';
import { profileApi } from '../profile';

export const authApi = {
  login,
  logout: profileApi.logout,
  sendCode,
  verifyCode,
  resetPassword,
};
