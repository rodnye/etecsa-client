#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { loginAction } from './commands/login.ts';
import { useAction } from './commands/use.ts';
import { statusAction } from './commands/status.ts';
import { profileAction } from './commands/profile.ts';
import { store, removeUser } from './session.ts';
import { version, description } from '../package.json' with { type: 'json' };

const program = new Command();

program.name('etecsa').description(description).version(version);

program
  .command('login')
  .description('Añade un nuevo usuario y lo establece como activo')
  .option('-u, --user <user>', 'Usuario (correo o teléfono)')
  .option('-p, --pass <pass>', 'Contraseña')
  .action(loginAction);

program
  .command('use [user]')
  .description('Alterna entre usuarios guardados')
  .action(useAction);

program
  .command('list')
  .description('Muestra todos los usuarios guardados')
  .action(() => {
    const users = store.get('users');
    const active = store.get('activeUser');
    const usernames = Object.keys(users);

    if (usernames.length === 0) {
      console.log(chalk.yellow('No hay usuarios guardados.'));
      return;
    }

    console.log(chalk.cyan('\nUsuarios guardados:'));
    usernames.forEach((u) => {
      const prefix = u === active ? chalk.green('➤ ') : '  ';
      console.log(`${prefix}${u}`);
    });
    console.log();
  });

program
  .command('status')
  .description('Consulta el estado (saldo, datos, voz) del servicio móvil')
  .option(
    '-f, --field <path>',
    'Extraer solo un campo específico (ej. balance)',
  )
  .action(statusAction);

program
  .command('profile')
  .description('Consulta los datos del perfil del usuario')
  .option(
    '-f, --field <path>',
    'Extraer solo un campo específico (ej. usuario.email)',
  )
  .action(profileAction);

program
  .command('logout')
  .description('Elimina el usuario activo y sus credenciales locales')
  .action(() => {
    const active = store.get('activeUser');
    if (!active) {
      console.log(chalk.yellow('No hay ningún usuario activo.'));
      return;
    }
    removeUser(active);
    console.log(
      chalk.green(`Usuario ${chalk.bold(active)} eliminado correctamente.`),
    );
  });

program.parse();
