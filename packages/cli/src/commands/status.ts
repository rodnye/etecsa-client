import { withSession } from '../client.js';
import { printMobileStatus, extractAndPrintField } from '../ui.js';
import chalk from 'chalk';

export async function statusAction(options: { field?: string }) {
  try {
    const status = await withSession(async (client) => {
      return client.mobile.status();
    });

    if (options.field) {
      extractAndPrintField(status, options.field);
    } else {
      printMobileStatus(status);
    }
  } catch (err: any) {
    console.error(chalk.red(`Error: ${err.message}`));
  }
}
