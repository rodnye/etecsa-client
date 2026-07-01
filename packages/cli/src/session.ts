import Conf from 'conf';
import { encrypt, decrypt } from './crypto.ts';
import { CookieJar } from 'tough-cookie';

export interface UserConfig {
  username: string;
  password: string; // Cifrada
  cookies: CookieJar.Serialized | null;
}

export interface ConfigSchema {
  activeUser: string | null;
  users: Record<string, UserConfig>;
}

export const store = new Conf<ConfigSchema>({
  projectName: 'etecsa-cli',
  defaults: {
    activeUser: null,
    users: {},
  },
});

export function saveUser(
  username: string,
  password: string,
  cookies: CookieJar.Serialized,
) {
  const users = store.get('users');
  users[username] = {
    username,
    password: encrypt(password),
    cookies,
  };
  store.set('users', users);
  store.set('activeUser', username);
}

export function updateUserCookies(
  username: string,
  cookies: CookieJar.Serialized,
) {
  const users = store.get('users');
  if (users[username]) {
    users[username].cookies = cookies;
    store.set('users', users);
  }
}

export function getActiveUser(): UserConfig | null {
  const active = store.get('activeUser');
  if (!active) return null;
  const user = store.get('users')[active];
  if (!user) return null;

  return {
    ...user,
    password: decrypt(user.password),
  };
}

export function setActiveUser(username: string) {
  const users = store.get('users');
  if (!users[username]) {
    throw new Error(`El usuario ${username} no existe.`);
  }
  store.set('activeUser', username);
}

export function removeUser(username: string) {
  const users = store.get('users');
  delete users[username];
  store.set('users', users);
  if (store.get('activeUser') === username) {
    store.set('activeUser', null);
  }
}
