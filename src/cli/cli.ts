#!/usr/bin/env node

import { createParser } from './parser';
import { cliDefinition as extractOptions, extractCommand } from './commands/extract';
import { cliDefinition as validateOptions, validateCommand } from './commands/validate';
import { ConsoleLogger } from './logger';

async function main() {
  const parser = createParser({
    options: {
      help: {
        alias: 'h',
        description: 'Print this message.',
        type: 'boolean',
      },
      version: {
        alias: 'v',
        description: 'Print version.',
        type: 'boolean',
      },
    },
    commands: {
      extract: extractOptions,
      validate: validateOptions,
    },
  });

  const logger = new ConsoleLogger();

  const args = parser.parse();

  if (!args.command) {
    if (args.options.help) {
      parser.showHelp();
      process.exit(0);
    }
    if (args.options.version) {
      logger.info(require('../../package.json').version);
      process.exit(0);
    }
    parser.showHelp();
    process.exit(1);
  } else {
    if (args.options.help) {
      parser.showCommandHelp(Object.keys(args.command)[0]);
      process.exit(0);
    }
  }

  let result: boolean = false;
  try {
    if (args.command.extract) {
      result = await extractCommand(args.command.extract);
    } else if (args.command.validate) {
      result = await validateCommand(args.command.validate);
    }
    process.exit(result ? 0 : 1);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}

main();
