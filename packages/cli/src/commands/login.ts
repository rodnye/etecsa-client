import { input, password as passwordPrompt } from '@inquirer/prompts';
import { EtecsaClient } from '@rodny/etecsa-core';
import { saveUser } from '../session';
import ora from 'ora';
import chalk from 'chalk';

export async function loginAction(options: { user?: string; pass?: string }) {
  const username =
    options.user ||
    (await input({
      message: 'Usuario (Teléfono +53...):',
    }));

  const pass =
    options.pass ||
    (await passwordPrompt({
      message: 'Contraseña:',
      mask: '*',
    }));

  const spinner = ora('Iniciando y guardando sesión...').start();

  try {
    const client = new EtecsaClient();
    await client.init();
    await client.auth.login({ user: username, pass });

    const cookies = client.auth.save();
    saveUser(username, pass, cookies);

    spinner.succeed(
      chalk.green(`Sesión guardada para ${chalk.bold(username)}.`),
    );
  } catch (err: any) {
    spinner.fail(chalk.red(err.message || 'Error al iniciar sesión.'));
    process.exit(1);
  }
}
