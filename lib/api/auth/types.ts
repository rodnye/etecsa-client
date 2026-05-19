import { Cookie } from "tough-cookie";
import { ApiResponse } from "../../core/types";
export type UserFormat = 'email' | 'phone';

export interface AuthResponse extends ApiResponse {
  error?: 'invalid_credentials' | 'too_many_attempts' | 'server_error';
  cookies?: {
    csrfToken: Cookie;
    sessionId: Cookie;
  };
}

export interface AuthCredentials {
  user: string;
  pass: string;
  type?: UserFormat;
}
