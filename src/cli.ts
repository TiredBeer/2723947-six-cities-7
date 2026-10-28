#!/usr/bin/env node
import 'reflect-metadata';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import {ImportOffers} from './import-offers.js';
import {Component} from './shared/di/component.js';
import {container} from './shared/di/container.js';
import {generateOffers} from './offer-generator.js';

const packagePath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');

function printHelp(): void {
  console.log(chalk.cyan('Программа для подготовки данных для REST API сервера.'));
  console.log(chalk.dim('Использование: npm run cli -- --<command> [аргументы]'));
  console.log(`${chalk.green('--help')}                         показать справку`);
  console.log(`${chalk.green('--version')}                      показать версию из package.json`);
  console.log(`${chalk.green('--import <path> <mongodb-uri>')}  сохранить предложения из TSV в MongoDB`);
  console.log(`${chalk.green('--generate <n> <path> <url>')}     сгенерировать TSV из данных JSON-сервера`);
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
      if (args.length !== 2 || !/^mongodb(?:\+srv)?:\/\//.test(args[1])) {
        throw new Error('Укажите путь к TSV-файлу и URI MongoDB: --import <path> <mongodb-uri>');
      }
      await container.get<ImportOffers>(Component.ImportOffers).execute(args[0], args[1]);
      return;
    }
    case '--generate': {
      const count = Number(args[0]);
      if (args.length !== 3 || !/^\d+$/.test(args[0]) || !Number.isSafeInteger(count) || count < 1) {
        throw new Error('Укажите положительное целое число, путь и URL: --generate <n> <path> <url>');
      }
      await generateOffers(count, args[1], args[2]);
      console.log(chalk.cyan(`Сгенерировано предложений: ${count}. Файл: ${args[1]}`));
      return;
    }
    default:
      throw new Error(`Неизвестная команда: ${command}. Используйте --help.`);
  }
}

main().catch((error: Error) => {
  console.error(chalk.red(`Ошибка: ${error.message}`));
  process.exitCode = 1;
});
