import type { EtecsaClientContext } from '../../client.ts';
import { createGetMobileServiceStatus } from './status.ts';

export const createMobileApi = (context: EtecsaClientContext) => ({
  status: createGetMobileServiceStatus(context),
});
