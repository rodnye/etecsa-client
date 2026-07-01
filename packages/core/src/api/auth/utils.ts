import { UserFormat } from './types.ts';

export const PHONE_PATTERN = /^\+53 \d{8}$/;
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Valida el formato del usuario según el tipo
 */
export const sanitizeUserFormat = (user: string): string => {
  user = user.trim();
  const type = detectUserFormat(user);
  if (type === 'email') {
    if (!user.endsWith('@nauta.cu'))
      throw new Error('El email debe de ser @nauta.cu');
    return user;
  }

  let phone = '+53 ' + user.replace(/^\+{0,1}53 {0,1}/, '');
  if (!PHONE_PATTERN.test(phone))
    throw new Error('Número telefónico no válido');
  return phone;
};

/**
 * Detecta el tipo de usuario basado en el formato
 */
export const detectUserFormat = (user: string): UserFormat => {
  return EMAIL_PATTERN.test(user) ? 'email' : 'phone';
};
