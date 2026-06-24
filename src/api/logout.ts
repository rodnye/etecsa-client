import { requestEtecsaApi } from '../core/api';
import type { EtecsaClientContext } from '../client';

export const performLogout = async (
  context: EtecsaClientContext,
): Promise<{ message: string }> => {
  await requestEtecsaApi<null>(context, '/usuarios/perfil_api', {
    method: 'put',
    data: { operacion: 'cerrar_session' },
  });
  return { message: 'Sesión cerrada correctamente' };
};
