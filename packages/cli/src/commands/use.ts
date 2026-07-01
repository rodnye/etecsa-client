import { select } from '@inquirer/prompts';
import { store, setActiveUser } from '../session.ts';
import chalk from 'chalk';

export async function useAction(targetUser?: string) {
  const users = store.get('users');
  const usernames = Object.keys(users);

  if (usernames.length === 0) {
    console.log(
      chalk.yellow('No hay usuarios guardados. Usa `etecsa login` primero.'),
    );
    return;
  }

  let selectedUser = targetUser;

  if (!selectedUser) {
    selectedUser = await select({
      message: 'Selecciona el usuario activo:',
      choices: usernames.map((u) => ({
        name: u === store.get('activeUser') ? `${u} (Actual)` : u,
        value: u,
      })),
    });
  }

  try {
    setActiveUser(selectedUser!);
    console.log(
      chalk.green(`Usuario activo cambiado a: ${chalk.bold(selectedUser)}`),
    );
  } catch (err: any) {
    console.error(chalk.red(err.message));
  }
}
