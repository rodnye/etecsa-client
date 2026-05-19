import { authApi } from "./api/auth";
import { profileApi } from "./api/profile";
import { mobileApi } from "./api/mobile";
import { nomenclatorsApi } from "./api/nomenclators";
import { pageApi } from "./api/page";
import { init } from "./core/methods";

export const etecsa = {
  init,
  auth: authApi,
  profile: profileApi,
  mobile: mobileApi,
  nom: nomenclatorsApi,
  page: pageApi,
}

export * from './api/auth/types';
export * from './api/mobile/types';
export * from './api/profile/types';
export * from './core/api';

export default etecsa;