import { checkUserExistsAuthApi, loginAuthApi } from "./_login";
import { generateCodeAuthApi, resetPasswordAuthApi, verifyCodeAuthApi } from "./_recovery";

/**
 * Autenticación de usuario en la tienda ETECSA
 */
export const authApi = {
  login: loginAuthApi,
  checkUser: checkUserExistsAuthApi,
  resetPassword: resetPasswordAuthApi,
  verifyCode: verifyCodeAuthApi,
  generateCode: generateCodeAuthApi
};
