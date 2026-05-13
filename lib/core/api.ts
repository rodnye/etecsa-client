import ky from 'ky';
import { SERVER_API } from './consts';

export const api = ky.extend({
  baseUrl: SERVER_API,
});
