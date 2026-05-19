import { AxiosResponse } from 'axios';
import { ETECSA, ensureInit } from './methods';

export const requestEtecsaApi = async <T = unknown, D = unknown>(
  relative: string,
  config: { method?: string; data?: object },
): Promise<AxiosResponse<T, D>> => {
  await ensureInit();
  
  return ETECSA.axios({
    url: ETECSA.href + relative,
    method: config.method || 'get',
    data: config.data && ETECSA.encryptPayload(config.data),
  });
};