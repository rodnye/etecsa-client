import chalk from 'chalk';
import { withSession } from '../client.ts';
import { printProfile, extractAndPrintField } from '../ui.ts';

export async function profileAction(options: { field?: string }) {
  try {
    const profile = await withSession(async (client) => {
      return client.profile.me();
    });

    if (options.field) {
      extractAndPrintField(profile, options.field);
    } else {
      printProfile(profile);
    }
  } catch (err: any) {
    console.error(chalk.red(`Error: ${err.message}`));
  }
}
