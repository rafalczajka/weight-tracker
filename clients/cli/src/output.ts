import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import chalk from 'chalk';
import ora from 'ora';

export interface CliOutput {
  confirm(message: string): Promise<boolean>;
  print(message?: string): void;
  printError(message: string): void;
  withStatus<T>(message: string, action: () => Promise<T>): Promise<T>;
}

export const createConsoleOutput = (): CliOutput => ({
  async confirm(message) {
    const reader = createInterface({ input: stdin, output: stdout });

    try {
      const answer = await reader.question(`${message} [y/N] `);
      return ['y', 'yes'].includes(answer.trim().toLowerCase());
    } finally {
      reader.close();
    }
  },

  print(message = '') {
    console.log(message);
  },

  printError(message) {
    console.error(`${chalk.bold.red('Error:')} ${message}`);
  },

  async withStatus(message, action) {
    const spinner = ora({
      color: 'cyan',
      isEnabled: Boolean(stdout.isTTY) && process.env.CI !== 'true',
      spinner: 'arc',
      text: message,
    }).start();

    try {
      return await action();
    } finally {
      spinner.stop();
    }
  },
});
