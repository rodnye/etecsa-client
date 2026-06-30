import { Cookie } from 'tough-cookie';

export type UserFormat = 'email' | 'phone';

export interface AuthCredentials {
  user: string;
  pass: string;
  type?: UserFormat;
}

export interface LoginSuccessData {
  cookies: {
    csrfToken: Cookie;
    sessionId: Cookie;
  };
}
