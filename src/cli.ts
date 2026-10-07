#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import {readOffers} from './tsv-file-reader.js';

const packagePath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');

function printHelp(): void {
  console.log(chalk.cyan('Программа для подготовки данных для REST API сервера.'));
  console.log(chalk.dim('Использование: npm run cli -- --<command> [аргументы]'));
  console.log(`${chalk.green('--help')}                         показать справку`);
  console.log(`${chalk.green('--version')}                      показать версию из package.json`);
  console.log(`${chalk.green('--import <path>')}                прочитать TSV и вывести предложения`);
  console.log(`${chalk.yellow('--generate <n> <path> <url>')}    генерация TSV (следующее задание)`);
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case undefined:
    case '--help':
      printHelp();
      return;
    case '--version': {
      const {version} = JSON.parse(readFileSync(packagePath, 'utf8')) as {version: string};
      console.log(chalk.green(version));
      return;
    }
    case '--import': {
      if (args.length !== 1) {
        throw new Error('Укажите путь к TSV-файлу: --import <path>');
      }
      let count = 0;
      for await (const offer of readOffers(args[0])) {
        console.log(chalk.green(`Предложение ${++count}:`));
        console.log(chalk.white(JSON.stringify(offer, null, 2)));
      }
      console.log(chalk.cyan(`Импортировано предложений: ${count}`));
      return;
    }
    case '--generate':
      throw new Error('Команда --generate будет реализована в следующем задании.');
    default:
      throw new Error(`Неизвестная команда: ${command}. Используйте --help.`);
  }
}

main().catch((error: Error) => {
  console.error(chalk.red(`Ошибка: ${error.message}`));
  process.exitCode = 1;
});
