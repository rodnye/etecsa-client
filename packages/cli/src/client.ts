import { EtecsaClient, EtecsaApiError } from '@rodny/etecsa-core';
import { getActiveUser, updateUserCookies } from './session.ts';
import ora from 'ora';
import chalk from 'chalk';

/**
 * Ejecuta una operación con el cliente.
 * Si la sesión expira (Error 403), reintenta automáticamente el login usando
 * las credenciales guardadas y cachea la nueva sesión.
 */
export async function withSession<T>(
  operation: (client: EtecsaClient) => Promise<T>,
): Promise<T> {
  const userConfig = getActiveUser();
  if (!userConfig) {
    throw new Error(
      'No hay ningún usuario activo. Ejecuta `etecsa login` primero.',
    );
  }

  const client = new EtecsaClient();
  await client.init();

  // Cargar cookies en caché si existen
  if (userConfig.cookies) {
    await client.auth.load(userConfig.cookies);
  }

  try {
    return await operation(client);
  } catch (err) {
    if (err instanceof EtecsaApiError && err.status === 403) {
      const spinner = ora('Sesión expirada. Reautenticando...').start();
      try {
        await client.auth.login({
          user: userConfig.username,
          pass: userConfig.password,
        });

        const newCookies = client.auth.save();
        updateUserCookies(userConfig.username, newCookies);

        spinner.succeed(
          chalk.green('Reautenticado correctamente. Reintentando...'),
        );
        return await operation(client);
      } catch (loginErr) {
        spinner.fail(
          chalk.red(
            'Error al reautenticar. Credenciales inválidas o cuenta bloqueada.',
          ),
        );
        throw loginErr;
      }
    }
    throw err;
  }
}
