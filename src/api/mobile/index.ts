import type { EtecsaClientContext } from '../../client';
import { createGetMobileServiceStatus } from './status';

export const createMobileApi = (context: EtecsaClientContext) => ({
  status: createGetMobileServiceStatus(context),
});
